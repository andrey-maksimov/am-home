import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// This endpoint is called by Vercel Cron to keep Supabase active
// It performs a simple query every 3 days to prevent the free tier from pausing
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

    // Perform multiple queries to keep the database active
    // Query multiple tables to ensure comprehensive activity
    const queries = [
      supabase.from('guestbook_entries').select('id').limit(1),
      supabase.from('status').select('id').limit(1),
      supabase.from('scan_events').select('id').limit(1),
    ];

    const results = await Promise.allSettled(queries);
    
    const errors = results
      .filter((r): r is PromiseRejectedReason => r.status === 'rejected')
      .map(r => r.reason);

    if (errors.length > 0) {
      console.error('Some keep-alive queries failed:', errors);
    }

    console.log('Keep-alive ping successful at', new Date().toISOString());
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      message: 'Supabase kept alive successfully',
      queriesExecuted: queries.length,
      errors: errors.length,
    });
  } catch (error) {
    console.error('Keep-alive error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
