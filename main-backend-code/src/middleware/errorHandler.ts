import { Request, Response, NextFunction } from 'express'

export interface ApiError extends Error {
    statusCode?: number
}

export const errorHandler = (
    err: ApiError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error('🚨 Server Error:', {
        url: req.originalUrl,
        method: req.method,
        status: err.statusCode,
        name: err.name,
        message: err.message,
        stack: err.stack?.toString()
    })

    res.status(err.statusCode || 500).json({
        success: false,
        error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
        ...(process.env.NODE_ENV === 'development' && { 
            name: err.name,
            stack: err.stack 
        })
    })
}

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    const error: ApiError = new Error(`Not found - ${req.originalUrl}`) as ApiError
    error.statusCode = 404
    next(error)
}
