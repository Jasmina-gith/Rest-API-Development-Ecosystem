import express, { Request, Response } from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import apiRoutes from './routes/index'
import dashboardManagement from './routes/dashboardManagement'
import { errorHandler, notFoundHandler } from './middleware/errorHandler'
import { requestLogger } from './middleware/logging'
import { initDB } from './database'



// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'REST API Development Ecosystem',
            version: '1.0.0',
            description: 'API Documentation for the Ecosystem with dashboard monitoring and learning wiki'
        },
        servers: [
            {
                url: 'https://rest-api-ecosystem-backend.onrender.com',
                description: 'Production Server'
            },
            {
                url: 'http://localhost:10000',
                description: 'Local Server'
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
    apis: ['./dist/routes/*.js', './src/routes/*.ts']
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)

const app = express()

// Middleware
app.use(express.json())
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(requestLogger)

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// API routes
app.use('/api', apiRoutes)
app.use('/api/dashboard', dashboardManagement)



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
