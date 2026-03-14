import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
    user?: {
        userId: number
        username: string
        role: string
    }
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ error: 'Access token required' })
    }

    jwt.verify(token, process.env.ACCESS_KEY!, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' })
        }

        req.user = decoded as { userId: number; username: string; role: string }
        next()
    })
}
