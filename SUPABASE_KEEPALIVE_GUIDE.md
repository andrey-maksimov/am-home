# 🔄 Supabase Keep-Alive Setup Guide

## Problem
Supabase pauses inactive projects on the free tier after 7 days of no database activity, which can disrupt your application.

## Solution
We've implemented an automated keep-alive system that **writes** to your database every 12 hours to prevent pausing.

## How It Works

### 1. Vercel Cron Job
- **File:** `vercel.json`
- **Schedule:** Runs every 12 hours (`0 */12 * * *` = at minute 0, every 12 hours)
- **Endpoint:** `/api/keep-alive`

### 2. Keep-Alive Endpoint
- **File:** `app/api/keep-alive/route.ts`
- **Function:** Performs WRITE operations to register activity (not just reads)
- **Operations:**
  - Inserts a ping record into `keep_alive_pings` table (write operation)
  - Queries `guestbook_entries`, `status`, and `scan_events` tables (read operations)

### 3. Keep-Alive Table
- **File:** `supabase/keep-alive-table.sql`
- **Purpose:** Dedicated table for logging automated pings
- **Auto-cleanup:** Keeps only last 30 days of pings

## 🚨 IMPORTANT: Create the Table First

Before deploying, you MUST create the `keep_alive_pings` table in Supabase:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Copy and paste the contents of `supabase/keep-alive-table.sql`
5. Click **Run** to execute the SQL

## ✅ Verify It's Working

### Check Vercel Cron Logs

1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Select your project
3. Click **Settings** → **Cron Jobs**
4. You should see `/api/keep-alive` scheduled to run every 12 hours
5. Click on it to see execution logs and next run time

### Check Execution History

1. In Vercel Dashboard, go to **Logs**
2. Filter by `/api/keep-alive`
3. You should see successful executions every 12 hours
4. Look for: `"Keep-alive ping successful at [timestamp]"`

### Check Supabase Table

1. Go to Supabase Dashboard → **Table Editor**
2. Open the `keep_alive_pings` table
3. You should see new rows being added every 12 hours

### Manual Test

You can manually trigger the keep-alive endpoint:

```bash
curl https://a-m.ae/api/keep-alive
```

Expected response:
```json
{
  "success": true,
  "timestamp": "2026-02-20T...",
  "message": "Supabase kept alive successfully",
  "pingId": 123,
  "queriesExecuted": 4,
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

1. **Verify the table exists:**
   - Check if `keep_alive_pings` table exists in Supabase
   - Run the SQL script if it doesn't exist

2. **Check if cron is running:**
   - Go to Vercel Settings → Cron Jobs
   - Ensure the cron shows recent executions
   - Check logs for any errors

3. **Check environment variables:**
   - Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in Vercel
   - Or use `SUPABASE_SERVICE_ROLE_KEY` for more reliable writes

4. **Check Supabase logs:**
   - Go to Supabase Dashboard → Logs → API Logs
   - Look for INSERT operations from your Vercel deployment

5. **Manually unpause (if needed):**
   - Go to Supabase Dashboard → Settings → General
   - Click "Restore Project" if paused

6. **Contact Supabase Support:**
   - If the cron is running but Supabase still complains, contact their support
   - Show them proof of regular database write activity

## 📊 What Changed (Latest Update)

- ✅ Changed from reads to **write operations** (INSERT)
- ✅ Created dedicated `keep_alive_pings` table
- ✅ Increased frequency from every 3 days to **every 12 hours**
- ✅ Added auto-cleanup for old ping records
- ✅ Better error handling and logging
- ✅ Returns ping ID for verification

## Key Improvements

**Why every 12 hours instead of every 3 days?**
- Supabase pauses after 7 days of inactivity
- Every 12 hours provides a much safer margin
- Even if 2-3 pings fail, you're still well within the 7-day window

**Why write operations instead of just reads?**
- Supabase free tier monitors write activity more closely
- Reads alone may not count as "sufficient activity"
- INSERT operations guarantee database activity is logged

## Next Steps

After deploying these changes:

1. **Create the table** in Supabase using the SQL script
2. Wait 12 hours and check Vercel logs to confirm the cron ran
3. Check the `keep_alive_pings` table for new records
4. Monitor your Supabase project status
5. If you receive another warning from Supabase, check the troubleshooting steps above

The system is now much more robust and should prevent future pausing warnings! 🎉
