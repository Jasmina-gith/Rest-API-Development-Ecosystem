import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { AuthResponse, JwtPayload } from "./types";

export function authorize(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1]
    if(!token) {
        res.status(400).json({ error: "Token not found" });
        return;
    }

jwt.verify(token, (process.env.ACCESS_KEY || 'JASMINA_SECRET_2026') as string, (err, result) => {
        if(err) return res.status(403).json({ error: err.message });
        (res as AuthResponse).user = result as JwtPayload
        next()
    })
}

export function authorizeRole(requiredRole: 'ADMIN' | 'USER' = 'USER') {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(" ")[1]
        if(!token) {
            res.status(400).json({ error: "Token not found" });
            return;
        }

jwt.verify(token, (process.env.ACCESS_KEY || 'JASMINA_SECRET_2026') as string, (err: any, result: any) => {
            if(err) return res.status(403).json({ error: err.message });

            if (result.role !== requiredRole && result.role !== 'ADMIN') {
                return res.status(403).json({ error: "Insufficient permissions" });
            }

            (res as AuthResponse).user = result as JwtPayload
            next()
        })
    }
}
