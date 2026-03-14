import { Request, Response } from 'express'
import { supabase } from '../config/supabaseClient'
import { AuthRequest } from '../middleware/authMiddleware'

export const getAllUsers = async (req: AuthRequest, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('Users')
            .select('user_id, username, email, role, status, created_at')

        if (error) {
            return res.status(400).json({ error: error.message })
        }

        res.status(200).json(data)
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const updateUserRole = async (req: AuthRequest, res: Response) => {
    const { userId, role } = req.body

    if (!['USER', 'ADMIN'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' })
    }

    try {
        const { data, error } = await supabase
            .from('Users')
            .update({ role, updated_at: new Date().toISOString() })
            .eq('user_id', userId)
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

export const getAuditLogs = async (req: AuthRequest, res: Response) => {
    const { page = 1, limit = 20 } = req.query
    const offset = (Number(page) - 1) * Number(limit)

    try {
        const { data, error, count } = await supabase
            .from('AuditLogs')
            .select(`
                *,
                Users(username)
            `, { count: 'exact' })
            .order('timestamp', { ascending: false })
            .range(offset, offset + Number(limit) - 1)

        if (error) {
            return res.status(400).json({ error: error.message })
        }

        res.status(200).json({
            logs: data,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total: count,
                pages: Math.ceil((count || 0) / Number(limit))
            }
        })
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' })
    }
}
