import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import proxy from './routes/proxy'
import auth from './routes/auth'
import projects from './routes/projects'
import echo from './routes/echo'
import logs from './routes/logs'
import { responseMiddleware } from './middleware/response'
import Pool from './database'

const app = express()
app.use(express.json())
app.use(cors())

// Response middleware for standardized API responses
app.use(responseMiddleware)

app.use('/proxy', proxy)
app.use('/echo', echo)
app.use('/auth', auth)
app.use('/projects', projects)
app.use('/api/logs', logs)


// 1. Infrastructure Health & Monitoring - Health Check Endpoint
app.get('/api/health', async (req: Request, res: Response): Promise<void> => {
    const start = Date.now()
    
    // Check if database client is initialized
    if (!Pool) {
        const latency = Date.now() - start
        res.status(503).json({
            status: 'DOWN',
            db: 'NOT_CONFIGURED',
            latency: `${latency}ms`,
            error: 'Supabase client not configured - missing SUPABASE_KEY'
        })
        return
    }
    
    try {
        // Try to connect to database using Supabase
        const { error } = await Pool.from('Projects').select('project_id').limit(1)
        
        const latency = Date.now() - start
        
        if (error) {
             res.status(503).json({
                status: 'DOWN',
                db: 'DISCONNECTED',
                latency: `${latency}ms`,
                error: error.message
            })
            return
        }

        res.status(200).json({
            status: 'UP',
            db: 'CONNECTED',
            latency: `${latency}ms`
        })
    } catch (err: any) {
        const latency = Date.now() - start
        res.status(503).json({
            status: 'DOWN',
            db: 'DISCONNECTED',
            latency: `${latency}ms`,
            error: err.message
        })
    }
})

app.listen(10000, () => {
    console.log("Listening at 10000")
})
