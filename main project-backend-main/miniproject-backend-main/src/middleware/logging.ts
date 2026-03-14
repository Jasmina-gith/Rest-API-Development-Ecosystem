import Pool from '../database'

export function auditLog(action: string, userId?: number, details?: any) {
    if (!userId) return;

    Pool.from('AuditLogs').insert({
        user_id: userId,
        action,
        details: JSON.stringify(details),
        timestamp: new Date().toISOString()
    }).then(({ error }) => {
        if (error) {
            console.error('Audit log error:', error.message)
        }
    })
}

export function requestLogger(req: any, res: any, next: any) {
    const start = Date.now()

    res.on('finish', () => {
        const duration = Date.now() - start
        const userId = req.user?.userId

        auditLog('API_REQUEST', userId, {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration,
            userAgent: req.get('User-Agent'),
            ip: req.ip
        })
    })

    next()
}
