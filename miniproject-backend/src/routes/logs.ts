import { Router } from "express"
import { authorize } from "../utils"
import { AuthResponse } from "../types"
import Pool from '../database'

const router = Router()

// 4. Audit Log Intelligence - GET /api/logs with query param filtering
// Supports: ?action=CREATE_PROJECT&user=Jasmina
router.get('/', authorize, (req: any, res: AuthResponse) => {
    const { action, user, limit = 50 } = req.query

    // Build query based on filters
    let query = Pool.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(parseInt(limit as string) || 50)

    // Apply action filter if provided
    if (action) {
        query = query.eq('action', action as string)
    }

    // Apply user filter if provided (filter by username)
    if (user) {
        query = query.ilike('username', `%${user}%`)
    }

    query.then(async ({ data, error }) => {
        if (error) {
            res.status(500).json({ error: error.message })
            return;
        }

        res.status(200).json(data || [])
    })
})

// Create a new audit log entry (for internal use)
export async function createAuditLog(action: string, userId: string, username: string, details: any) {
    try {
        await Pool.from('audit_logs').insert({
            action,
            user_id: userId,
            username,
            details: JSON.stringify(details),
            created_at: new Date().toISOString()
        })
    } catch (error) {
        console.error('Failed to create audit log:', error)
    }
}

export default router

