import { supabase } from '../config/supabaseClient'

export const logAction = async (userId: number, action: string, details: any) => {
    try {
        const { error } = await supabase
            .from('AuditLogs')
            .insert({
                user_id: userId,
                action,
                details,
                timestamp: new Date().toISOString()
            })

        if (error) {
            console.error('Error logging action:', error)
        }
    } catch (err) {
        console.error('Error in logAction:', err)
    }
}
