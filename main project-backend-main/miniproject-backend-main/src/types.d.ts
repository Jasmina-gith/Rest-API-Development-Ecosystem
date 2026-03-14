import { Response, Request } from "express"

export type JwtPayload = {
    userId: number,
    username: string,
    role: 'ADMIN' | 'USER'
}

export type User = {
    user_id: number,
    username: string,
    email?: string,
    role: 'ADMIN' | 'USER',
    status: 'ACTIVE' | 'INACTIVE',
    created_at: string,
    updated_at: string
}

export type AuthResponse = Response & {
    user?: JwtPayload,
    query?: Request['query'],
    params?: Request['params'],
    body?: Request['body']
}

export type AuthRequest = Request & {
    user?: JwtPayload
}

export type ApiResponse<T = any> = {
    success: boolean,
    data?: T,
    error?: string,
    message?: string
}
