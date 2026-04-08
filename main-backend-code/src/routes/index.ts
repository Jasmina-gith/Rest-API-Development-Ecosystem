import express from 'express'
import auth from './auth'
import projects from './projects'
import admin from './admin'
import dashboard from './dashboard'
import proxy from './proxy'

const router = express.Router()

// Combine all routes
router.use('/auth', auth)
router.use('/projects', projects)
router.use('/admin', admin)
router.use('/dashboard', dashboard)

router.use('/proxy', proxy)

export default router
