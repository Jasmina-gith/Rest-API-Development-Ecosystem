import { Request, Response } from 'express'
import { supabase } from '../config/supabaseClient'
import { AuthRequest } from '../middleware/authMiddleware'
import { logAction } from '../utils/auditLogger'

export const createProject = async (req: AuthRequest, res: Response) => {
    const { project_name, state } = req.body

    try {
        const { data, error } = await supabase
            .from('Projects')
            .insert({ project_name, state: state || 'ACTIVE' })
            .select()
            .single()

        if (error) {
            return res.status(400).json({ error: error.message })
        }

        // Add creator as owner in Project_Collaborators
        await supabase
            .from('Project_Collaborators')
            .insert({ project_id: data.project_id, user_id: req.user!.userId, is_owner: true })

        // Log project creation
        try {
            await logAction(req.user!.userId, 'PROJECT_CREATED', { name: data.project_name, project_id: data.project_id })
        } catch (logErr) {
            console.error('Audit log failed for project creation:', logErr)
        }

        res.status(201).json(data)
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const getProjects = async (req: AuthRequest, res: Response) => {
    const { page = 1, limit = 10, search, state } = req.query
    const offset = (Number(page) - 1) * Number(limit)

    try {
        let query = supabase
            .from('Projects')
            .select(`
                *,
                Project_Collaborators!inner(user_id)
            `)
            .eq('Project_Collaborators.user_id', req.user!.userId)
            .range(offset, offset + Number(limit) - 1)

        if (search) {
            query = query.ilike('project_name', `%${search}%`)
        }

        if (state) {
            query = query.eq('state', state)
        }

        const { data, error, count } = await query

        if (error) {
            return res.status(400).json({ error: error.message })
        }

        res.status(200).json({
            projects: data,
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

export const getProjectById = async (req: AuthRequest, res: Response) => {
    const { id } = req.params

    try {
        const { data, error } = await supabase
            .from('Projects')
            .select(`
                *,
                Project_Collaborators(user_id, is_owner, Users(username))
            `)
            .eq('project_id', id)
            .eq('Project_Collaborators.user_id', req.user!.userId)
            .single()

        if (error) {
            return res.status(404).json({ error: 'Project not found' })
        }

        res.status(200).json(data)
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const updateProject = async (req: AuthRequest, res: Response) => {
    const { id } = req.params
    const { project_name, state } = req.body

    try {
        // Check if user is owner
        const { data: collab, error: collabError } = await supabase
            .from('Project_Collaborators')
            .select('is_owner')
            .eq('project_id', id)
            .eq('user_id', req.user!.userId)
            .single()

        if (collabError || !collab?.is_owner) {
            return res.status(403).json({ error: 'Only project owners can update projects' })
        }

        const { data, error } = await supabase
            .from('Projects')
            .update({ project_name, state, updated_at: new Date().toISOString() })
            .eq('project_id', id)
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

export const deleteProject = async (req: AuthRequest, res: Response) => {
    const { id } = req.params

    try {
        // Check if user is owner
        const { data: collab, error: collabError } = await supabase
            .from('Project_Collaborators')
            .select('is_owner')
            .eq('project_id', id)
            .eq('user_id', req.user!.userId)
            .single()

        if (collabError || !collab?.is_owner) {
            return res.status(403).json({ error: 'Only project owners can delete projects' })
        }

        // Get project details for logging
        const { data: project, error: projectError } = await supabase
            .from('Projects')
            .select('project_name')
            .eq('project_id', id)
            .single()

        if (projectError) {
            return res.status(400).json({ error: projectError.message })
        }

        // Log project deletion
        try {
            await logAction(req.user!.userId, 'PROJECT_DELETED', { project_id: id, name: project.project_name })
        } catch (logErr) {
            console.error('Audit log failed for project deletion:', logErr)
        }

        const { error } = await supabase
            .from('Projects')
            .delete()
            .eq('project_id', id)

        if (error) {
            return res.status(400).json({ error: error.message })
        }

        res.status(200).json({ message: 'Project deleted successfully' })
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const addCollaborator = async (req: AuthRequest, res: Response) => {
    const { project_id, user_id } = req.body

    try {
        // Check if current user is owner
        const { data: collab, error: collabError } = await supabase
            .from('Project_Collaborators')
            .select('is_owner')
            .eq('project_id', project_id)
            .eq('user_id', req.user!.userId)
            .single()

        if (collabError || !collab?.is_owner) {
            return res.status(403).json({ error: 'Only project owners can add collaborators' })
        }

        // Check if user exists
        const { data: user, error: userError } = await supabase
            .from('Users')
            .select('user_id')
            .eq('user_id', user_id)
            .single()

        if (userError || !user) {
            return res.status(404).json({ error: 'User not found' })
        }

        // Add collaborator
        const { data, error } = await supabase
            .from('Project_Collaborators')
            .insert({ project_id, user_id, is_owner: false })
            .select()
            .single()

        if (error) {
            return res.status(400).json({ error: error.message })
        }

        // Log collaborator addition
        try {
            await logAction(req.user!.userId, 'COLLABORATOR_ADDED', { project_id, user_id, added_by: req.user!.userId })
        } catch (logErr) {
            console.error('Audit log failed for collaborator addition:', logErr)
        }

        res.status(201).json(data)
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' })
    }
}
