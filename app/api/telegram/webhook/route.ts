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

      // Handle publish action (for old pending entries)
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

      // Handle keep action (entry is already published)
      if (data.startsWith('keep_')) {
        const entryId = data.substring(5);
        
        const { data: entry, error } = await supabaseAdmin
          .from('guestbook_entries')
          .select('name, message')
          .eq('id', entryId)
          .single();

        if (error || !entry) {
          await answerCallbackQuery(callbackQuery.id, 'Entry not found');
        } else {
          // Remove buttons after action
          await editMessageReplyMarkup(chatId, messageId, { inline_keyboard: [] });
          
          await answerCallbackQuery(callbackQuery.id, 'Kept');
          await sendTelegramReply(
            chatId,
            `Entry kept.\n\nFrom: ${entry.name}\nMessage: "${entry.message.slice(0, 100)}${entry.message.length > 100 ? '...' : ''}"`
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

      // Handle nuke confirmation
      if (data === 'confirm_nuke') {
        const { error } = await supabaseAdmin
          .from('guestbook_entries')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000');

        if (error) {
          await answerCallbackQuery(callbackQuery.id, 'Failed to delete');
          await sendTelegramReply(chatId, `Failed to delete all entries: ${error.message}`);
        } else {
          await editMessageReplyMarkup(chatId, messageId, { inline_keyboard: [] });
          await answerCallbackQuery(callbackQuery.id, 'All deleted');
          await sendTelegramReply(chatId, 'All guestbook entries have been deleted.');
        }
        return NextResponse.json({ ok: true });
      }

      // Handle nuke cancellation
      if (data === 'cancel_nuke') {
        await editMessageReplyMarkup(chatId, messageId, { inline_keyboard: [] });
        await answerCallbackQuery(callbackQuery.id, 'Cancelled');
        await sendTelegramReply(chatId, 'Deletion cancelled.');
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
        `/list` + ` - List all guestbook entries\n` +
        `/delete <id>` + ` - Delete a guestbook entry\n` +
        `/nukeall` + ` - Delete ALL guestbook entries\n` +
        `/help` + ` - Show this message\n\n` +
        `*Status Message Rules:*\n` +
        `• Maximum 250 characters\n` +
        `• HTML tags will be removed\n\n` +
        `*Guestbook Notes:*\n` +
        `• Messages are published instantly\n` +
        `• Use /list to view and delete entries\n\n` +
        `*Examples:*\n` +
        `/status Welcome to our home. We're here all weekend.\n` +
        `/status Currently away, back on Monday.\n` +
        `/delete 12345`;

      await sendTelegramReply(chatId, helpText, messageId);
      return NextResponse.json({ ok: true });
    }

    // Command: /list - List all guestbook entries with management buttons
    if (text === '/list') {
      const { data, error } = await supabaseAdmin
        .from('guestbook_entries')
        .select('id, name, phone, message, created_at, photo_url, published')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        await sendTelegramReply(chatId, 'Failed to fetch entries.', messageId);
      } else if (!data || data.length === 0) {
        await sendTelegramReply(chatId, 'No entries in the guestbook.', messageId);
      } else {
        // Count published vs unpublished
        const publishedCount = data.filter(e => e.published).length;
        const unpublishedCount = data.length - publishedCount;
        
        // Send a summary message
        await sendTelegramReply(
          chatId, 
          `Found ${data.length} total ${data.length === 1 ? 'entry' : 'entries'}\n` +
          `Published: ${publishedCount} | Unpublished: ${unpublishedCount}`,
          messageId
        );
        
        // Send each entry as a separate message with inline buttons
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        for (const entry of data) {
          const date = new Date(entry.created_at).toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
          });
          const status = entry.published ? 'Published' : 'Unpublished';
          const shortId = entry.id.split('-')[0];
          
          const entryMessage = 
            `${status}\n` +
            `*From:* ${entry.name}\n` +
            (entry.phone ? `*Phone:* ${entry.phone}\n` : '') +
            (entry.photo_url ? `*Photo:* [View](${entry.photo_url})\n` : '') +
            `*Date:* ${date}\n` +
            `*ID:* \`${shortId}\`\n\n` +
            `*Message:*\n"${entry.message}"`;

          try {
            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: entryMessage,
                parse_mode: 'Markdown',
                reply_markup: {
                  inline_keyboard: [
                    [
                      {
                        text: 'Delete',
                        callback_data: `delete_${entry.id}`,
                      },
                    ],
                  ],
                },
              }),
            });
          } catch (error) {
            console.error('Failed to send entry:', error);
          }
        }
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

    // Command: /nukeall - Delete all guestbook entries (with confirmation)
    if (text === '/nukeall') {
      // First, get count of entries
      const { count, error } = await supabaseAdmin
        .from('guestbook_entries')
        .select('id', { count: 'exact', head: true });

      if (error) {
        await sendTelegramReply(chatId, 'Failed to count entries.', messageId);
        return NextResponse.json({ ok: true });
      }

      if (count === 0) {
        await sendTelegramReply(chatId, 'No entries to delete.', messageId);
        return NextResponse.json({ ok: true });
      }

      // Send confirmation message with buttons
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: `*WARNING*\n\nThis will permanently delete ALL ${count} guestbook ${count === 1 ? 'entry' : 'entries'}.\n\nThis action cannot be undone.\n\nAre you sure?`,
            parse_mode: 'Markdown',
            reply_to_message_id: messageId,
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: 'Cancel',
                    callback_data: 'cancel_nuke',
                  },
                  {
                    text: 'Delete All',
                    callback_data: 'confirm_nuke',
                  },
                ],
              ],
            },
          }),
        });
      } catch (error) {
        console.error('Failed to send confirmation:', error);
        await sendTelegramReply(chatId, 'Failed to send confirmation message.', messageId);
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
