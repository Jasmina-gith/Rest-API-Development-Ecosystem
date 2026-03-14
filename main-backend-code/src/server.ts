import express, { Request, Response } from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import dashboardManagement from './routes/dashboardManagement'
import proxy from './routes/proxy'
import auth from './routes/auth'
import projects from './routes/projects'
import echo from './routes/echo'
import admin from './routes/admin'
import dashboard from './routes/dashboard'
import { errorHandler, notFoundHandler } from './middleware/errorHandler'
import { requestLogger } from './middleware/logging'
import { initDB } from './database'


// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Testing Platform API',
            version: '1.0.0',
            description: 'REST API for API Testing Platform with JWT authentication and role-based access control'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ['./src/routes/*.ts']
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)

const app = express()

// Middleware
app.use(express.json())
app.use(cors())
app.use(requestLogger)

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// API routes
app.use('/api/dashboard', dashboardManagement)

// Protected routes
app.use('/proxy', proxy)
app.use('/echo', echo)
app.use('/auth', auth)
app.use('/projects', projects)
app.use('/admin', admin)
app.use('/dashboard', dashboard)


// Health check
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// 404 handler
app.use(notFoundHandler)

// Global error handler
app.use(errorHandler)

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000

// Initialize database and start server
initDB().then(() => {
    app.listen(port, () => {
        console.log(`Server listening at http://localhost:${port}`)
        console.log(`API documentation available at http://localhost:${port}/api-docs`)
    })
}).catch((error: any) => {
    console.error('Failed to initialize database:', error)
    process.exit(1)
})
