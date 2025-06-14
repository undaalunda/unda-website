// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

// ใช้ตัวแปรที่มีอยู่ใน .env.local แล้ว (ไม่ต้องเพิ่มใหม่)
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

console.log('🔌 Supabase connecting to:', supabaseUrl.substring(0, 30) + '...')

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase