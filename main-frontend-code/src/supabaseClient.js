import { createClient } from '@supabase/supabase-js'

// Supabase not configured for local - using dummy to prevent crash
export const supabase = createClient('https://dummy.supabase.co', 'dummy')

