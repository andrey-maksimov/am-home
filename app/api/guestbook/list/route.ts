import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');

    const { data, error } = await supabase
      .from('guestbook_entries')
      .select('id, name, message, created_at, photo_url')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(Math.min(limit, 100)); // Cap at 100

    if (error) {
      console.error('Failed to fetch guestbook entries:', error);
      return NextResponse.json([]);
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Guestbook list error:', error);
    return NextResponse.json({ entries: [] });
  }
}
