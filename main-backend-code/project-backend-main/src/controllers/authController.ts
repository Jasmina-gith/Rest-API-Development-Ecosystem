import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { supabase } from '../config/supabaseClient'
import { AuthRequest } from '../middleware/authMiddleware'
import { logAction } from '../utils/auditLogger'

interface JwtPayload {
    userId: number
    username: string
    role: string
}

export const register = async (req: Request, res: Response) => {
    const { username, password, email } = req.body

    if (username.length < 3) {
        return res.status(400).json({ error: "Username must be at least 3 characters" })
    }
    if (password.length < 4) {
        return res.status(400).json({ error: "Password must be at least 4 characters" })
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        const { data, error } = await supabase
            .from('Users')
            .insert({ username, password: hashedPassword, email })
            .select()
            .single()

        if (error) {
            return res.status(400).json({ error: error.message })
        }

        const user = data
        const payload: JwtPayload = { userId: user.user_id, username: user.username, role: user.role || 'USER' }
        const accessToken = jwt.sign(payload, process.env.ACCESS_KEY!, { expiresIn: '1h' })
        const refreshToken = jwt.sign(payload, process.env.REFRESH_KEY!, { expiresIn: '1d' })

        // Store refresh token in database
        await supabase.from('Tokens').insert({ token: refreshToken })

        // Log registration action
        await logAction(user.user_id, 'USER_REGISTERED', { username: user.username, email: user.email })

        res.status(201).json({ user: { userId: user.user_id, username: user.username, role: user.role }, accessToken, refreshToken })
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body

    try {
        const { data, error } = await supabase
            .from('Users')
            .select('user_id, username, password, role')
            .eq('username', username)
            .single()

        if (error || !data) {
            return res.status(404).json({ error: "User not found" })
        }

        const user = data
        const isValidPassword = await bcrypt.compare(password, user.password)

        if (!isValidPassword) {
            return res.status(401).json({ error: "Invalid password" })
        }

        const payload: JwtPayload = { userId: user.user_id, username: user.username, role: user.role || 'USER' }
        const accessToken = jwt.sign(payload, process.env.ACCESS_KEY!, { expiresIn: '1h' })
        const refreshToken = jwt.sign(payload, process.env.REFRESH_KEY!, { expiresIn: '1d' })

        // Store refresh token
        await supabase.from('Tokens').insert({ token: refreshToken })

        // Log login action
        await logAction(user.user_id, 'USER_LOGGED_IN', { username: user.username })

        res.status(200).json({ user: { userId: user.user_id, username: user.username, role: user.role }, accessToken, refreshToken })
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('Users')
            .select('user_id, username, email, role, status, created_at, updated_at')
            .eq('user_id', req.user!.userId)
            .single()

        if (error) {
            return res.status(500).json({ error: error.message })
        }

        res.status(200).json(data)
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const updateProfile = async (req: AuthRequest, res: Response) => {
    const { email, username } = req.body

    try {
        const { data, error } = await supabase
            .from('Users')
            .update({ email, username, updated_at: new Date().toISOString() })
            .eq('user_id', req.user!.userId)
            .select()
            .single()

        if (error) {
            return res.status(400).json({ error: error.message })
        }

        res.status(200).json(data)
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' })
    }
}
