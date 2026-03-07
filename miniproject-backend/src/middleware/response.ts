import { Request, Response, NextFunction } from 'express';
import { AuthResponse } from '../types';

// 2. Professional Response Handling & Formatting - Response Middleware
// This middleware ensures every API response includes statusCode, payload, and requestTime
export function responseMiddleware(req: Request, res: AuthResponse, next: NextFunction) {
    // Capture the original json method
    const originalJson = res.json.bind(res);
    
    // Add request start time
    (req as any).requestTime = Date.now();

    // Override json method to add standardized response format
    res.json = function (payload: any): Response {
        const requestTime = Date.now() - (req as any).requestTime;
        
        // Create standardized response object
        const standardizedResponse = {
            statusCode: res.statusCode,
            payload: payload,
            requestTime: `${requestTime}ms`,
            timestamp: new Date().toISOString()
        };

        // For error responses, format differently
        if (res.statusCode >= 400) {
            return originalJson({
                statusCode: res.statusCode,
                error: payload,
                requestTime: `${requestTime}ms`,
                timestamp: new Date().toISOString()
            });
        }

        return originalJson(standardizedResponse);
    };

    next();
}

