import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// This endpoint is called by Vercel Cron to keep Supabase active
// It performs a simple query every 5 days to prevent the free tier from pausing
export async function GET(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Perform a simple query to keep the database active
    // Query the guestbook_messages table (or any table you have)
    const { data, error } = await supabase
      .from('guestbook_messages')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Keep-alive query failed:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    console.log('Keep-alive ping successful at', new Date().toISOString());
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      message: 'Supabase kept alive successfully',
    });
  } catch (error) {
    console.error('Keep-alive error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
