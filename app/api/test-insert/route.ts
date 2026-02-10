import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Testing direct insert...');
    
    const { data, error } = await supabaseAdmin
      .from('guestbook_entries')
      .insert({
        name: 'Test User',
        phone: '1234567890',
        message: 'Test message',
        photo_url: null,
        published: false,
      })
      .select()
      .single();

    return NextResponse.json({
      success: !error,
      error: error ? JSON.parse(JSON.stringify(error)) : null,
      data: data,
      envVars: {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      exception: err instanceof Error ? err.message : String(err),
    });
  }
}
