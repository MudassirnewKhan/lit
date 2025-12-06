import { createClient }  from '@supabase/supabase-js';

// You need to add these to your .env.local file!
// NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
// NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);