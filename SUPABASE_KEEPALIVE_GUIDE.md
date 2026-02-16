# 🔄 Supabase Keep-Alive Setup Guide

## Problem
Supabase pauses inactive projects on the free tier after 7 days of no database activity, which can disrupt your application.

## Solution
We've implemented an automated keep-alive system that queries your database every 3 days to prevent pausing.

## How It Works

### 1. Vercel Cron Job
- **File:** `vercel.json`
- **Schedule:** Runs every 3 days (`0 0 */3 * *` = midnight every 3rd day)
- **Endpoint:** `/api/keep-alive`

### 2. Keep-Alive Endpoint
- **File:** `app/api/keep-alive/route.ts`
- **Function:** Queries multiple Supabase tables to register activity
- **Tables queried:**
  - `guestbook_entries`
  - `status`
  - `scan_events`

## ✅ Verify It's Working

### Check Vercel Cron Logs

1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Select your project
3. Click **Settings** → **Cron Jobs**
4. You should see `/api/keep-alive` scheduled
5. Click on it to see execution logs and next run time

### Check Execution History

1. In Vercel Dashboard, go to **Logs**
2. Filter by `/api/keep-alive`
3. You should see successful executions every 3 days
4. Look for: `"Keep-alive ping successful at [timestamp]"`

### Manual Test

You can manually trigger the keep-alive endpoint:

```bash
curl https://a-m.ae/api/keep-alive
```

Expected response:
```json
{
  "success": true,
  "timestamp": "2026-01-22T...",
  "message": "Supabase kept alive successfully",
  "queriesExecuted": 3,
  "errors": 0
}
```

## 🔐 Optional: Add CRON_SECRET

For extra security, add a `CRON_SECRET` environment variable:

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Add a new variable:
   - **Name:** `CRON_SECRET`
   - **Value:** Any random string (e.g., `sk_live_abc123xyz789...`)
3. The endpoint will still work without this, but it adds authentication

## 🆘 Troubleshooting

### If Supabase Still Gets Paused:

1. **Check if cron is enabled:**
   - Go to Vercel Settings → Cron Jobs
   - Ensure the cron is active and shows a "next run" time

2. **Check environment variables:**
   - Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in Vercel

3. **Check Supabase logs:**
   - Go to Supabase Dashboard → Logs
   - Look for queries from your Vercel deployment

4. **Manually unpause (if needed):**
   - Go to Supabase Dashboard → Settings → General
   - Click "Restore Project" if paused

5. **Contact Supabase Support:**
   - If the cron is running but Supabase still complains, contact their support
   - Show them proof of regular database activity

## 📊 What Changed (Latest Update)

- ✅ Fixed table name (`guestbook_messages` → `guestbook_entries`)
- ✅ Queries multiple tables instead of one
- ✅ Changed schedule from every 5 days to every 3 days
- ✅ Made authentication optional (works even without `CRON_SECRET`)
- ✅ Added better error handling and logging

## Next Steps

After deploying these changes:

1. Wait 3 days and check Vercel logs to confirm the cron ran
2. Monitor your Supabase project status
3. If you receive another warning from Supabase, check the troubleshooting steps above

The system is now more robust and should prevent future pausing warnings! 🎉
