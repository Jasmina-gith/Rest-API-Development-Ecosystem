import { Response, NextFunction } from 'express'
import { AuthRequest } from './authMiddleware'

export const roleMiddleware = (requiredRole: string) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' })
        }

        if (req.user.role !== requiredRole) {
            return res.status(403).json({ error: 'Insufficient permissions' })
        }

        next()
    }
}
