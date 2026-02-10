import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Try with regular client (anon key)
    const { data: publicData, error: publicError } = await supabase
      .from('guestbook_entries')
      .select('*')
      .eq('published', true);

    // Try with admin client (service role key)
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('guestbook_entries')
      .select('*');

    // Get all entries regardless of published status with admin
    const { data: allEntries, error: allError } = await supabaseAdmin
      .from('guestbook_entries')
      .select('*')
      .order('created_at', { ascending: false });

    return NextResponse.json({
      publicClient: {
        success: !publicError,
        error: publicError ? JSON.stringify(publicError) : null,
        count: publicData?.length || 0,
        data: publicData,
      },
      adminClient: {
        success: !adminError,
        error: adminError ? JSON.stringify(adminError) : null,
        count: adminData?.length || 0,
        data: adminData,
      },
      allEntries: {
        success: !allError,
        error: allError ? JSON.stringify(allError) : null,
        count: allEntries?.length || 0,
        data: allEntries,
      },
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Exception occurred',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
