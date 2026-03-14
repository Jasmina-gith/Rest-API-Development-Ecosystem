import { Router, Response } from 'express'
import { authorize, authorizeRole } from '../utils'
import { AuthResponse, AuthRequest, User } from '../types'
import Pool from '../database'
import { auditLog } from '../middleware/logging'

const router = Router()

// Apply authentication and admin role check to all routes
router.use(authorize)
router.use(authorizeRole('ADMIN'))

// Get all users with pagination
router.get('/users', (req: AuthRequest, res: AuthResponse) => {
    const page = parseInt((req.query.page as string) || '1')
    const limit = parseInt((req.query.limit as string) || '10')
    const offset = (page - 1) * limit

    Pool.from('Users').select('*', { count: 'exact' })
    .range(offset, offset + limit - 1)
    .then(({ data, count, error }) => {
        if (error) {
            res.status(500).json({ error: error.message })
            return
        }

        const users: User[] = data?.map((user: any) => ({
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            role: user.role,
            status: user.status,
            created_at: user.created_at,
            updated_at: user.updated_at
        })) || []

        res.json({
            success: true,
            data: users,
            pagination: {
                page,
                limit,
                total: count || 0,
                pages: Math.ceil((count || 0) / limit)
            }
        })
    })
})

// Toggle user status
router.patch('/users/:id/status', (req: AuthRequest, res: AuthResponse) => {
    const userId = parseInt(req.params.id)
    const { status } = req.body

    if (!['ACTIVE', 'INACTIVE'].includes(status)) {
        res.status(400).json({ error: 'Invalid status' })
        return
    }

    Pool.from('Users').update({ status, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .then(({ data, error }: any) => {
        if (error) {
            res.status(500).json({ error: error.message })
            return
        }

        if (!data?.length) {
            res.status(404).json({ error: 'User not found' })
            return
        }

        auditLog('USER_STATUS_CHANGE', req.user?.userId, { targetUserId: userId, newStatus: status })

        res.json({
            success: true,
            message: 'User status updated successfully',
            data: data[0]
        })
    })
})

// Change user role
router.patch('/users/:id/role', (req: AuthRequest, res: AuthResponse) => {
    const userId = parseInt(req.params.id)
    const { role } = req.body

    if (!['ADMIN', 'USER'].includes(role)) {
        res.status(400).json({ error: 'Invalid role' })
        return
    }

    Pool.from('Users').update({ role, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .then(({ data, error }: any) => {
        if (error) {
            res.status(500).json({ error: error.message })
            return
        }

        if (!data?.length) {
            res.status(404).json({ error: 'User not found' })
            return
        }

        auditLog('USER_ROLE_CHANGE', req.user?.userId, { targetUserId: userId, newRole: role })

        res.json({
            success: true,
            message: 'User role updated successfully',
            data: data[0]
        })
    })
})

export default router
