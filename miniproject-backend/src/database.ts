


import { config } from 'dotenv'
config()

import { createClient, SupabaseClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.SUPABASE_URL || 'https://svdeakdjjchmnyjucxhh.supabase.co'
let supabaseKey = process.env.SUPABASE_KEY

// Fallback to hardcoded key if env var is missing (for development)
if (!supabaseKey) {
    console.warn('⚠️ SUPABASE_KEY not found in environment, using fallback key')
    supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2ZGVha2RqamNobW55anVjeGhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4OTAxNTUsImV4cCI6MjA4ODQ2NjE1NX0.nc2TI_kXE2Lj2_Hw-pM_y7mRajteYLUn4pqpt4jiVlY'
}

// Create client - requires valid SUPABASE_KEY environment variable
const Pool = createClient(supabaseUrl, supabaseKey)
console.log('🔗 Supabase client initialized:', supabaseUrl)
export default Pool
