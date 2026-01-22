import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Ensure this route is always dynamic
export const dynamic = 'force-dynamic';

interface TelegramMessage {
  message_id: number;
  from: {
    id: number;
    first_name: string;
  };
  chat: {
    id: number;
  };
  text?: string;
}

interface TelegramCallbackQuery {
  id: string;
  from: {
    id: number;
    first_name: string;
  };
  message?: {
    message_id: number;
    chat: {
      id: number;
    };
  };
  data?: string;
}

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: TelegramCallbackQuery;
}

async function sendTelegramReply(chatId: number, text: string, replyToMessageId?: number) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  
  console.log('Sending Telegram reply:', { chatId, textLength: text.length, hasToken: !!botToken });
  
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
        reply_to_message_id: replyToMessageId,
      }),
    });
    
    const result = await response.json();
    console.log('Telegram API response:', result);
    
    if (!result.ok) {
      console.error('Failed to send Telegram message:', result);
    }
  } catch (error) {
    console.error('Error sending Telegram message:', error);
  }
}

async function answerCallbackQuery(callbackQueryId: string, text?: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text: text || 'Done',
        show_alert: false,
      }),
    });
  } catch (error) {
    console.error('Error answering callback query:', error);
  }
}

async function editMessageReplyMarkup(chatId: number, messageId: number, replyMarkup?: object) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/editMessageReplyMarkup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        reply_markup: replyMarkup,
      }),
    });
  } catch (error) {
    console.error('Error editing message markup:', error);
  }
}

export async function POST(request: NextRequest) {
  // Validate webhook secret (temporarily disabled for debugging)
  // const secret = request.nextUrl.searchParams.get('secret');
  // const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  // if (!expectedSecret || secret !== expectedSecret) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    const update: TelegramUpdate = await request.json();
    console.log('Received update:', JSON.stringify(update));
    
    // Handle callback queries (button presses)
    if (update.callback_query) {
      const callbackQuery = update.callback_query;
      const data = callbackQuery.data;
      const chatId = callbackQuery.message?.chat.id;
      const messageId = callbackQuery.message?.message_id;
      
      if (!data || !chatId || !messageId) {
        return NextResponse.json({ ok: true });
      }

      // Check if this is from the allowed chat
      const allowedChatId = process.env.TELEGRAM_CHAT_ID;
      if (allowedChatId && chatId.toString() !== allowedChatId) {
        await answerCallbackQuery(callbackQuery.id, 'Unauthorized');
        return NextResponse.json({ ok: true });
      }

      // Handle publish action
      if (data.startsWith('publish_')) {
        const entryId = data.substring(8);
        
        const { data: entry, error } = await supabaseAdmin
          .from('guestbook_entries')
          .update({ published: true })
          .eq('id', entryId)
          .select('name, message')
          .single();

        if (error || !entry) {
          await answerCallbackQuery(callbackQuery.id, 'Entry not found');
        } else {
          // Remove buttons after action
          await editMessageReplyMarkup(chatId, messageId, { inline_keyboard: [] });
          
          await answerCallbackQuery(callbackQuery.id, 'Published');
          await sendTelegramReply(
            chatId,
            `Entry published.\n\nFrom: ${entry.name}\nMessage: "${entry.message.slice(0, 100)}${entry.message.length > 100 ? '...' : ''}"\n\nNow visible at: https://a-m.ae/h/guestbook`
          );
        }
        return NextResponse.json({ ok: true });
      }

      // Handle delete action
      if (data.startsWith('delete_')) {
        const entryId = data.substring(7);
        
        const { data: entry, error } = await supabaseAdmin
          .from('guestbook_entries')
          .delete()
          .eq('id', entryId)
          .select('name')
          .single();

        if (error || !entry) {
          await answerCallbackQuery(callbackQuery.id, 'Entry not found');
        } else {
          // Remove buttons after action
          await editMessageReplyMarkup(chatId, messageId, { inline_keyboard: [] });
          
          await answerCallbackQuery(callbackQuery.id, 'Deleted');
          await sendTelegramReply(chatId, `Entry deleted.\n\nFrom: ${entry.name}`);
        }
        return NextResponse.json({ ok: true });
      }

      await answerCallbackQuery(callbackQuery.id);
      return NextResponse.json({ ok: true });
    }
    
    const message = update.message;

    if (!message || !message.text) {
      console.log('No message or text, skipping');
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id;
    const text = message.text.trim();
    const messageId = message.message_id;

    console.log('Processing message:', { chatId, text, messageId });

    // Only respond to the configured chat
    const allowedChatId = process.env.TELEGRAM_CHAT_ID;
    console.log('Chat ID check:', { chatId: chatId.toString(), allowedChatId, matches: chatId.toString() === allowedChatId });
    
    if (allowedChatId && chatId.toString() !== allowedChatId) {
      console.log('Chat ID mismatch, ignoring message');
      return NextResponse.json({ ok: true });
    }

    console.log('Chat ID verified, processing command:', text);

    // Command: /status <new message>
    if (text.startsWith('/status ')) {
      const newStatus = text.substring(8).trim();
      
      // Validation: Check if message is empty
      if (!newStatus) {
        await sendTelegramReply(chatId, 'Please provide a status message.\n\nExample: /status Welcome to our home', messageId);
        return NextResponse.json({ ok: true });
      }

      // Validation: Check message length (max 250 characters)
      if (newStatus.length > 250) {
        await sendTelegramReply(chatId, `Message too long (${newStatus.length}/250 characters). Please shorten it.`, messageId);
        return NextResponse.json({ ok: true });
      }

      // Validation: Remove any HTML tags for security
      const sanitizedMessage = newStatus.replace(/<[^>]*>/g, '');
      
      // Validation: Check if message became empty after sanitization
      if (!sanitizedMessage.trim()) {
        await sendTelegramReply(chatId, 'Invalid message content. Please avoid using HTML tags.', messageId);
        return NextResponse.json({ ok: true });
      }

      // Update the status in Supabase
      const { error } = await supabaseAdmin
        .from('status')
        .update({
          message: sanitizedMessage,
          updated_at: new Date().toISOString(),
        })
        .eq('id', 1);

      if (error) {
        console.error('Failed to update status:', error);
        await sendTelegramReply(chatId, 'Failed to update status. Please try again.', messageId);
      } else {
        await sendTelegramReply(
          chatId, 
          `Status updated.\n\nNew message:\n"${sanitizedMessage}"\n\nLive at: https://a-m.ae/h`, 
          messageId
        );
      }

      return NextResponse.json({ ok: true });
    }

    // Command: /current - Show current status
    if (text === '/current') {
      const { data, error } = await supabaseAdmin
        .from('status')
        .select('message, updated_at')
        .eq('id', 1)
        .single();

      if (error || !data) {
        await sendTelegramReply(chatId, 'Failed to fetch current status.', messageId);
      } else {
        const updatedDate = new Date(data.updated_at).toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        });
        await sendTelegramReply(
          chatId,
          `Current status message:\n\n"${data.message}"\n\nLast updated: ${updatedDate}`,
          messageId
        );
      }
      return NextResponse.json({ ok: true });
    }

    // Command: /help
    if (text === '/help' || text === '/start') {
      const helpText = 
        `*Townhouse Management Bot*\n\n` +
        `*Available Commands:*\n` +
        `/status <message>` + ` - Update homepage banner\n` +
        `/current` + ` - View current status\n` +
        `/pending` + ` - View pending guestbook entries\n` +
        `/publish <id>` + ` - Publish a guestbook entry\n` +
        `/delete <id>` + ` - Delete a guestbook entry\n` +
        `/help` + ` - Show this message\n\n` +
        `*Status Message Rules:*\n` +
        `• Maximum 250 characters\n` +
        `• HTML tags will be removed\n\n` +
        `*Examples:*\n` +
        `/status Welcome to our home. We're here all weekend.\n` +
        `/status Currently away, back on Monday.\n` +
        `/publish 12345`;

      await sendTelegramReply(chatId, helpText, messageId);
      return NextResponse.json({ ok: true });
    }

    // Command: /pending - List pending guestbook entries
    if (text === '/pending') {
      const { data, error } = await supabaseAdmin
        .from('guestbook_entries')
        .select('id, name, phone, message, created_at')
        .eq('published', false)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        await sendTelegramReply(chatId, 'Failed to fetch pending entries.', messageId);
      } else if (!data || data.length === 0) {
        await sendTelegramReply(chatId, 'No pending entries.', messageId);
      } else {
        let response = `*Pending Guestbook Entries (${data.length}):*\n\n`;
        data.forEach((entry, index) => {
          const date = new Date(entry.created_at).toLocaleDateString();
          response += `${index + 1}. ${entry.name}${entry.phone ? ` (${entry.phone})` : ''}\n`;
          response += `   "${entry.message.slice(0, 100)}${entry.message.length > 100 ? '...' : ''}"\n`;
          response += `   Date: ${date} | ID: ${entry.id}\n`;
          response += `   /publish ${entry.id} | /delete ${entry.id}\n\n`;
        });
        await sendTelegramReply(chatId, response, messageId);
      }
      return NextResponse.json({ ok: true });
    }

    // Command: /publish <id> - Publish a guestbook entry
    if (text.startsWith('/publish ')) {
      const entryId = text.substring(9).trim();
      
      if (!entryId) {
        await sendTelegramReply(chatId, 'Please provide an entry ID.\n\nExample: /publish 12345', messageId);
        return NextResponse.json({ ok: true });
      }

      const { data, error } = await supabaseAdmin
        .from('guestbook_entries')
        .update({ published: true })
        .eq('id', entryId)
        .select('name, message')
        .single();

      if (error || !data) {
        await sendTelegramReply(chatId, `Failed to publish entry. Entry ID ${entryId} not found.`, messageId);
      } else {
        await sendTelegramReply(
          chatId,
          `Entry published.\n\nFrom: ${data.name}\nMessage: "${data.message.slice(0, 100)}${data.message.length > 100 ? '...' : ''}"\n\nNow visible at: https://a-m.ae/h/guestbook`,
          messageId
        );
      }
      return NextResponse.json({ ok: true });
    }

    // Command: /delete <id> - Delete a guestbook entry
    if (text.startsWith('/delete ')) {
      const entryId = text.substring(8).trim();
      
      if (!entryId) {
        await sendTelegramReply(chatId, 'Please provide an entry ID.\n\nExample: /delete 12345', messageId);
        return NextResponse.json({ ok: true });
      }

      const { data, error } = await supabaseAdmin
        .from('guestbook_entries')
        .delete()
        .eq('id', entryId)
        .select('name')
        .single();

      if (error || !data) {
        await sendTelegramReply(chatId, `Failed to delete entry. Entry ID ${entryId} not found.`, messageId);
      } else {
        await sendTelegramReply(chatId, `Entry deleted.\n\nFrom: ${data.name}`, messageId);
      }
      return NextResponse.json({ ok: true });
    }

    // Unknown command
    if (text.startsWith('/')) {
      await sendTelegramReply(chatId, 'Unknown command. Send /help for available commands.', messageId);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Prevent GET requests
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
