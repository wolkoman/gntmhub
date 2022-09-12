import * as dotenv from 'dotenv'
dotenv.config()
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
    'https://cxkivqkfvuohkcpmgdoi.supabase.co',
    process.env.SUPABASE_SECRET
);