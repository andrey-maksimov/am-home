import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Raw SQL query bypassing the Supabase client's query builder
    const { data, error } = await supabaseAdmin.rpc('get_all_guestbook_entries');
    
    if (error) {
      // If RPC doesn't exist, try direct query
      const result = await supabaseAdmin
        .from('guestbook_entries')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });
      
      return NextResponse.json({
        method: 'direct_query',
        count: result.count,
        dataLength: result.data?.length,
        error: result.error ? JSON.parse(JSON.stringify(result.error)) : null,
        data: result.data,
      });
    }

    return NextResponse.json({
      method: 'rpc',
      data,
      error,
    });
  } catch (err) {
    return NextResponse.json({
      exception: err instanceof Error ? err.message : String(err),
    });
  }
}
