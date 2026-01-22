import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Ensure this route is always dynamic (no caching)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('status')
      .select('message, updated_at')
      .eq('id', 1)
      .single();

    if (error) {
      console.error('Failed to fetch status:', error);
      return NextResponse.json({ message: '' });
    }

    return NextResponse.json({
      message: data?.message || '',
      updated_at: data?.updated_at,
    });
  } catch (error) {
    console.error('Status fetch error:', error);
    return NextResponse.json({ message: '' });
  }
}
