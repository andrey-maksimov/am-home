import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    
    console.log('[Guestbook List] Fetching entries at', new Date().toISOString());

    // Debug: Check environment variables
    const debugMode = searchParams.get('debug') === '1';
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // Use admin client for API routes (server-side only)
    const { data, error } = await supabaseAdmin
      .from('guestbook_entries')
      .select('id, name, message, created_at, photo_url', { count: 'exact' })
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(Math.min(limit, 100));

    if (debugMode) {
      return NextResponse.json({
        hasUrl,
        hasKey,
        error: error ? JSON.parse(JSON.stringify(error)) : null,
        dataCount: data?.length || 0,
        data: data || [],
      });
    }

    console.log('[Guestbook List] Query returned', data?.length || 0, 'entries');

    if (error) {
      console.error('Guestbook list error:', error);
      return NextResponse.json({
        error: true,
        message: error.message,
        details: JSON.parse(JSON.stringify(error)),
        data: [],
      });
    }

    // Add no-cache headers to response
    const response = NextResponse.json(data || []);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Guestbook list exception:', error);
    return NextResponse.json({
      error: true,
      exception: error instanceof Error ? error.message : String(error),
      data: [],
    });
  }
}
