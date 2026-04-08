import { Router, Response } from 'express'
import { authorize } from '../utils'
import { AuthResponse, AuthRequest } from '../types'
import Pool from '../database'

const router = Router()

router.use(authorize)

// Get dashboard statistics
router.get('/stats', authorize, async (req: any, res: any) => {
    try {
        const userId = (req as AuthRequest).user?.userId

        // Get user's projects count
        const result1 = await Pool
            .from('Collaborators')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
        const userProjectsCount = (result1 as any).count || 0

        if (result1.error) {
            return res.status(500).json({ error: result1.error.message })
        }

        // Get active projects (simplified query without JOIN)
        const result2 = await Pool
            .from('Projects')
            .select('project_id', { count: 'exact', head: true })
            .neq('state', 'completed')
        
        const activeProjectsCount = (result2 as any).count || 0

        if (result2.error) {
            return res.status(500).json({ error: result2.error.message })
        }

        // Get total users (for admin view)
        const result3 = await Pool
            .from('Users')
            .select('*', { count: 'exact', head: true })
        
        const totalUsers = (result3 as any).count || 0

        if (result3.error) {
            return res.status(500).json({ error: result3.error.message })
        }

        // Get active users
        const result4 = await Pool
            .from('Users')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'ACTIVE')

        const activeUsers = (result4 as any).count || 0

        if (result4.error) {
            return res.status(500).json({ error: result4.error.message })
        }

        // Get recent activity (last 5 projects updated in last 7 days)
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const recentProjectsResult = await Pool
            .from('Projects')
            .select('project_id, project_name, updated_at')
            .gte('updated_at', sevenDaysAgo.toISOString())
            .order('updated_at', { ascending: false })
            .limit(5)

        if (recentProjectsResult.error) {
            return res.status(500).json({ error: recentProjectsResult.error.message })
        }

        const stats = {
            totalProjects: userProjectsCount,
            activeProjects: activeProjectsCount,
            totalUsers: totalUsers,
            activeUsers: activeUsers,
            recentActivity: recentProjectsResult.data || []
        }

        res.json({
            success: true,
            data: stats
        })

    } catch (error) {
        console.error('Dashboard stats error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

export default router
