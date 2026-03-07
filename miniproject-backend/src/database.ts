

import { config } from 'dotenv'
config()

import { createClient, SupabaseClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://zyuzhqcaehznxfwcuczd.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY as string

// Create client - requires valid SUPABASE_KEY environment variable
// For local development, create a .env file with SUPABASE_KEY
const Pool = supabaseKey ? createClient(supabaseUrl, supabaseKey) : null as unknown as SupabaseClient
export default Pool
