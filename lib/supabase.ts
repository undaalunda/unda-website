// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

// ✅ รองรับทั้ง client และ server
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

console.log('🔌 Supabase connecting to:', supabaseUrl.substring(0, 30) + '...')

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase