import { createClient } from '@supabase/supabase-js';

// Client-side Supabase client (uses anon key)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key',
  {
    db: {
      schema: 'public',
    },
    auth: {
      persistSession: false,
    },
  }
);

// Server-side Supabase client (uses service role key for admin operations)
// Create a fresh client with connection pooling disabled to avoid stale data
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key',
  {
    db: {
      schema: 'public',
    },
    auth: {
      persistSession: false,
    },
    global: {
      headers: {
        'x-cache-control': 'no-cache',
      },
    },
  }
);
