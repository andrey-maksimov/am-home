import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendTelegramMessage } from '@/lib/telegram';
import { rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = request.headers.get('x-forwarded-for') || 'anonymous';
    const rateLimitResult = await rateLimit(identifier, 5, 3600); // 5 submissions per hour
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { message: 'Too many submissions. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;
    const photo = formData.get('photo') as File | null;

    // Validation
    if (!name?.trim() || !message?.trim()) {
      return NextResponse.json(
        { message: 'Name and message are required.' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedName = name.trim().slice(0, 100);
    const sanitizedPhone = phone?.trim().slice(0, 20) || null;
    const sanitizedMessage = message.trim().slice(0, 1000);

    // Check message length
    if (sanitizedMessage.length < 3) {
      return NextResponse.json(
        { message: 'Message must be at least 3 characters.' },
        { status: 400 }
      );
    }

    let photoUrl: string | null = null;

    // Handle photo upload if provided
    if (photo && photo.size > 0) {
      // Validate photo size (max 5MB)
      if (photo.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { message: 'Photo must be less than 5MB.' },
          { status: 400 }
        );
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic'];
      if (!allowedTypes.includes(photo.type)) {
        return NextResponse.json(
          { message: 'Photo must be a valid image (JPEG, PNG, or WebP).' },
          { status: 400 }
        );
      }

      try {
        // Generate unique filename
        const fileExt = photo.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        // Convert File to ArrayBuffer then to Buffer
        const arrayBuffer = await photo.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabaseAdmin
          .storage
          .from('guestbook-photos')
          .upload(fileName, buffer, {
            contentType: photo.type,
            cacheControl: '3600',
          });

        if (uploadError) {
          console.error('Photo upload error:', uploadError);
          return NextResponse.json(
            { message: 'Failed to upload photo. Please try again.' },
            { status: 500 }
          );
        }

        // Get public URL
        const { data: urlData } = supabaseAdmin
          .storage
          .from('guestbook-photos')
          .getPublicUrl(fileName);
        
        photoUrl = urlData.publicUrl;
      } catch (error) {
        console.error('Photo processing error:', error);
        return NextResponse.json(
          { message: 'Failed to process photo. Please try again.' },
          { status: 500 }
        );
      }
    }

    // Insert into Supabase (published=true for instant publishing)
    console.log('Attempting to insert entry:', { sanitizedName, sanitizedPhone, sanitizedMessage, photoUrl });
    
    const { data: entry, error } = await supabaseAdmin
      .from('guestbook_entries')
      .insert({
        name: sanitizedName,
        phone: sanitizedPhone,
        message: sanitizedMessage,
        photo_url: photoUrl,
        published: true,
      })
      .select('id, name, phone, message, photo_url, created_at')
      .single();

    if (error) {
      console.error('Failed to insert guestbook entry:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { 
          message: 'Failed to submit message. Database error.',
          error: JSON.parse(JSON.stringify(error)),
        },
        { status: 500 }
      );
    }
    
    console.log('Entry inserted successfully:', entry);

    // Send Telegram notification with inline keyboard
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    
    if (botToken && chatId) {
      const telegramMessage = 
        `*New Guestbook Entry*\n\n` +
        `From: ${entry.name}\n` +
        (entry.phone ? `Phone: ${entry.phone}\n` : '') +
        (entry.photo_url ? `Photo: Yes\n` : '') +
        `\nMessage:\n"${entry.message}"`;

      try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: telegramMessage + `\n\n✅ *Published instantly* - Visible at: https://a-m.ae/h/guestbook`,
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: '✅ Keep',
                    callback_data: `keep_${entry.id}`,
                  },
                  {
                    text: '🗑️ Delete',
                    callback_data: `delete_${entry.id}`,
                  },
                ],
              ],
            },
          }),
        });
      } catch (error) {
        console.error('Failed to send Telegram notification:', error);
      }
    }

    // If there's a photo, send it to Telegram as well
    if (photoUrl) {
      try {
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;
        
        if (botToken && chatId) {
          await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              photo: photoUrl,
              caption: `Photo from ${entry.name}`,
            }),
          });
        }
      } catch (error) {
        console.error('Failed to send photo to Telegram:', error);
        // Don't fail the request if Telegram photo send fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Your message is live!',
      entryId: entry.id,
    });

  } catch (error) {
    console.error('Guestbook submission error:', error);
    return NextResponse.json(
      { message: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
