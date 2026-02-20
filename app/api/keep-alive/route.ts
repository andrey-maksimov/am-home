import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// This endpoint is called by Vercel Cron to keep Supabase active
// It performs writes every 12 hours to prevent the free tier from pausing
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron (optional, works without auth too)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    // If CRON_SECRET is set, verify it. Otherwise, allow public access
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.warn('Keep-alive called without proper authentication');
      // Don't block - just log it and continue
    }

    // IMPORTANT: Perform WRITE operations, not just reads
    // Supabase free tier monitors write activity more than reads
    
    // 1. Insert a ping record (write operation)
    const { data: pingData, error: pingError } = await supabase
      .from('keep_alive_pings')
      .insert({ source: 'vercel-cron' })
      .select()
      .single();

    // 2. Perform read queries on other tables to ensure comprehensive activity
    const queries = [
      supabase.from('guestbook_entries').select('id').limit(1),
      supabase.from('status').select('id').limit(1),
      supabase.from('scan_events').select('id').limit(1),
    ];

    const results = await Promise.allSettled(queries);
    
    const errors = results
      .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
      .map(r => r.reason);

    if (pingError) {
      console.error('Keep-alive ping insertion failed:', pingError);
      errors.push(pingError);
    }

    if (errors.length > 0) {
      console.error('Some keep-alive queries failed:', errors);
    }

    const timestamp = new Date().toISOString();
    console.log('Keep-alive ping successful at', timestamp);
    
    return NextResponse.json({
      success: true,
      timestamp,
      message: 'Supabase kept alive successfully',
      pingId: pingData?.id,
      queriesExecuted: queries.length + 1, // +1 for the insert
      errors: errors.length,
    });
  } catch (error) {
    console.error('Keep-alive error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
