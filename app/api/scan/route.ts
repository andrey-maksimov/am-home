import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendTelegramMessage } from '@/lib/telegram';
import { shouldRateLimit, getClientInfo } from '@/lib/rate-limit';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { ip, userAgent } = getClientInfo(request);
    
    // Rate limiting: only notify once per 10 minutes per unique visitor
    if (shouldRateLimit(ip, userAgent, 10)) {
      return NextResponse.json({ message: 'Rate limited' }, { status: 429 });
    }

    const body = await request.json();
    const { path, timestamp } = body;

    // Create hashes for privacy
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex');
    const uaHash = crypto.createHash('sha256').update(userAgent).digest('hex');

    // Log to Supabase
    const { error: dbError } = await supabaseAdmin
      .from('scan_events')
      .insert({
        path: path || '/h',
        ip_hash: ipHash,
        ua_hash: uaHash,
      });

    if (dbError) {
      console.error('Failed to log scan event:', dbError);
    }

    // Send Telegram notification
    const message = `🔔 *New Visitor Alert*\n\n` +
      `Someone just visited your townhouse homepage!\n\n` +
      `📍 Path: \`${path || '/h'}\`\n` +
      `🕐 Time: ${new Date(timestamp || Date.now()).toLocaleString('en-US', { 
        timeZone: 'Asia/Dubai',
        dateStyle: 'medium',
        timeStyle: 'short'
      })} GST\n` +
      `🌍 IP Hash: \`${ipHash.substring(0, 8)}...\``;

    await sendTelegramMessage(message);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Scan tracking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
