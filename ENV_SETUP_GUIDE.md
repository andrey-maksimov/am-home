# 🔧 Environment Setup Guide

## Step 1: Create `.env.local` File

In your project root (`/Users/am/landing/am-home`), create a new file named `.env.local`

You can do this by running:
```bash
touch .env.local
```

Or create it in your code editor.

## Step 2: Add Your Supabase Credentials

### Finding Your Supabase Credentials:

1. **Go to your Supabase project dashboard** at https://supabase.com/dashboard
2. **Select your project**
3. **Click the "Settings" icon** (gear/cog icon) in the left sidebar
4. **Click "API"** in the settings menu
5. **You'll see two sections:**

   **Project URL** - Copy this (looks like: `https://abcdefghijklm.supabase.co`)
   
   **Project API keys:**
   - `anon` `public` - This is your public key (safe to use in browser)
   - `service_role` `secret` - This is your secret key (⚠️ NEVER expose publicly!)

### Copy This Template Into Your `.env.local` File:

```env
# ============================================
# SUPABASE CREDENTIALS
# ============================================

# Your Project URL (from Settings > API)
NEXT_PUBLIC_SUPABASE_URL=paste-your-project-url-here

# Your anon/public key (from Settings > API)
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste-your-anon-key-here

# Your service_role key (from Settings > API)
SUPABASE_SERVICE_ROLE_KEY=paste-your-service-role-key-here


# ============================================
# TELEGRAM BOT (Optional - Leave blank for now)
# ============================================

TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
TELEGRAM_WEBHOOK_SECRET=
```

### Example (with fake values):

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG0iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MjAwMDAwMCwiZXhwIjoxOTU3NTc2MDAwfQ.fake-signature-here
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG0iLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjQyMDAwMDAwLCJleHAiOjE5NTc1NzYwMDB9.fake-signature-here

TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
TELEGRAM_WEBHOOK_SECRET=
```

## Step 3: Set Up Your Supabase Database

Now you need to create the database tables:

1. **In your Supabase dashboard**, click **"SQL Editor"** in the left sidebar
2. **Click "New query"**
3. **Copy the entire contents** of `/Users/am/landing/am-home/supabase/schema.sql`
4. **Paste it into the SQL Editor**
5. **Click "Run"** (or press Cmd/Ctrl + Enter)

You should see a success message! ✅

This creates three tables:
- `status` - For the homepage banner message
- `scan_events` - For logging page visits
- `guestbook_entries` - For future guestbook submissions

## Step 4: Verify It Works

After adding your credentials and running the schema:

1. **Restart your dev server** (stop with Ctrl+C and run `npm run dev` again)
2. **Visit** http://localhost:5173/h
3. **You should see** the status banner with "Welcome to our townhouse! Feel free to explore and leave a message."

## Step 5 (Optional): Set Up Telegram Bot

If you want scan notifications and remote control:

### 5a. Create a Telegram Bot

1. Open Telegram and search for **@BotFather**
2. Send `/newbot`
3. Follow the prompts to name your bot
4. **Copy the bot token** it gives you (looks like: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)
5. Add it to `.env.local` as `TELEGRAM_BOT_TOKEN=your-token-here`

### 5b. Get Your Chat ID

1. **Message your bot** (send any message like "Hello")
2. **Visit this URL** in your browser (replace `YOUR_BOT_TOKEN`):
   ```
   https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
   ```
3. **Look for** `"chat":{"id":123456789}` in the response
4. **Copy that number** and add it to `.env.local` as `TELEGRAM_CHAT_ID=123456789`

### 5c. Generate Webhook Secret

Run this in your terminal:
```bash
openssl rand -hex 32
```

Copy the output and add it to `.env.local` as `TELEGRAM_WEBHOOK_SECRET=the-random-string`

### 5d. Set Webhook (After Deploying to Vercel)

After you deploy to Vercel, run:
```bash
curl -X POST "https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://a-m.ae/api/telegram/webhook?secret=YOUR_WEBHOOK_SECRET"}'
```

## Troubleshooting

### ❌ "Invalid API key" error
- Double-check you copied the complete keys (they're very long!)
- Make sure there are no extra spaces before/after
- The keys should start with `eyJ`

### ❌ Status banner not showing
- Check the browser console for errors (F12 > Console tab)
- Verify you ran the SQL schema in Supabase
- Make sure you restarted the dev server after adding env vars

### ❌ Tables don't exist
- Run the SQL schema from `supabase/schema.sql` in Supabase SQL Editor
- Check for error messages in the SQL Editor output

## Quick Reference

**Your Supabase Dashboard:** https://supabase.com/dashboard/project/YOUR_PROJECT_ID

**Required for basic functionality:**
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`

**Optional (for Telegram features):**
- ⭕ `TELEGRAM_BOT_TOKEN`
- ⭕ `TELEGRAM_CHAT_ID`
- ⭕ `TELEGRAM_WEBHOOK_SECRET`

---

Once you've completed Steps 1-4, your site will be fully functional! 🎉
