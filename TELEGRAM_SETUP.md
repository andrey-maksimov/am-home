# Telegram Bot Setup Instructions

## Your Bot Credentials:
- **Bot Token:** `8260546983:AAFRlBL4eqHW76SEPXf6XGy4rpU32lKZhGo`
- **Chat ID:** `86981936`
- **Webhook Secret:** `617ba7d7eb49e2d464a431e1e8ea0004371fc3a7bc6c5d50bb2f456f14f1d2f3`

## Step 1: Update .env.local

Open your `.env.local` file and add these lines (or update if they exist):

```env
TELEGRAM_BOT_TOKEN=8260546983:AAFRlBL4eqHW76SEPXf6XGy4rpU32lKZhGo
TELEGRAM_CHAT_ID=86981936
TELEGRAM_WEBHOOK_SECRET=617ba7d7eb49e2d464a431e1e8ea0004371fc3a7bc6c5d50bb2f456f14f1d2f3
```

## Step 2: Add to Vercel

Add these same variables to Vercel:

1. Go to: https://vercel.com/andreys-projects-ba619af1/am-home/settings/environment-variables

2. Add each variable:
   - `TELEGRAM_BOT_TOKEN` = `8260546983:AAFRlBL4eqHW76SEPXf6XGy4rpU32lKZhGo`
   - `TELEGRAM_CHAT_ID` = `86981936`
   - `TELEGRAM_WEBHOOK_SECRET` = `617ba7d7eb49e2d464a431e1e8ea0004371fc3a7bc6c5d50bb2f456f14f1d2f3`
   
   (Check all three environments: Production, Preview, Development)

## Step 3: Redeploy

After adding to Vercel, redeploy:
```bash
vercel --prod
```

## Step 4: Set the Webhook (AFTER DNS is fixed)

Once your domain is working (after DNS propagates), run this command:

```bash
curl -X POST "https://api.telegram.org/bot8260546983:AAFRlBL4eqHW76SEPXf6XGy4rpU32lKZhGo/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://a-m.ae/api/telegram/webhook?secret=617ba7d7eb49e2d464a431e1e8ea0004371fc3a7bc6c5d50bb2f456f14f1d2f3"}'
```

Expected response:
```json
{"ok":true,"result":true,"description":"Webhook was set"}
```

## Step 5: Verify Webhook

Check if webhook is set:
```bash
curl "https://api.telegram.org/bot8260546983:AAFRlBL4eqHW76SEPXf6XGy4rpU32lKZhGo/getWebhookInfo"
```

## Step 6: Test Your Bot

Send these commands to your bot on Telegram:

- `/help` - See available commands
- `/status Welcome to our home!` - Update the homepage banner

## Bot Commands Available:

1. **Update homepage banner:**
   ```
   /status Your message here
   ```
   Example: `/status We're home this weekend!`

2. **Get help:**
   ```
   /help
   ```

## Features Enabled:

✅ **Scan Notifications** - Get notified when someone visits a-m.ae/h (rate-limited to once per 10 minutes per visitor)

✅ **Remote Status Updates** - Update the homepage banner from anywhere via Telegram

✅ **Future Ready** - Architecture ready for Phase B guestbook approvals

---

**Note:** The webhook can only be set AFTER your DNS is updated and a-m.ae is working!
