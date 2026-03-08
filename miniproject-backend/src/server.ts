import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { config } from 'dotenv'
config()
import proxy from './routes/proxy'
import auth from './routes/auth'
import projects from './routes/projects'
import echo from './routes/echo'
import logs from './routes/logs'
import { responseMiddleware } from './middleware/response'
import Pool from './database'

const supabaseUrl = process.env.SUPABASE_URL || 'https://svdeakdjjchmnyjucxhh.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY

const app = express()
app.use(express.json())
app.use(cors({
    origin: [
        'http://localhost:5173', 
        'https://rest-api-ecosystem-frontend.onrender.com'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

// Response middleware for standardized API responses
app.use(responseMiddleware)

app.use('/proxy', proxy)
app.use('/echo', echo)
app.use('/auth', auth)
app.use('/projects', projects)
app.use('/api/logs', logs)


// 1. Infrastructure Health & Monitoring - Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', db: 'CONNECTED' });
});

app.listen(10000, () => {
    console.log("Listening at 10000")
})
