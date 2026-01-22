# 🚀 Deployment Guide for a-m.ae

## Quick Deploy to Vercel (Recommended)

### Step 1: Deploy the Site

From your project directory, run:

```bash
cd /Users/am/landing/am-home
vercel
```

You'll be asked some questions:

1. **Set up and deploy?** → Yes
2. **Which scope?** → Choose your account
3. **Link to existing project?** → No
4. **Project name?** → `am-home` (or press Enter)
5. **In which directory is your code?** → `./` (press Enter)
6. **Want to modify settings?** → No

Vercel will:
- ✅ Build your site
- ✅ Deploy it to a preview URL (like `am-home-xxx.vercel.app`)
- ✅ Give you a deployment URL

### Step 2: Add Environment Variables

Your site won't work yet because environment variables aren't deployed. Add them:

**Option A: Via Command Line**
```bash
# Add Supabase variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste your Supabase URL when prompted, press Enter
# Select: Production, Preview, Development (press Space to select all, Enter to confirm)

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste your anon key, select all environments

vercel env add SUPABASE_SERVICE_ROLE_KEY
# Paste your service role key, select all environments

# Optional: Add Telegram variables (if you set them up)
vercel env add TELEGRAM_BOT_TOKEN
vercel env add TELEGRAM_CHAT_ID
vercel env add TELEGRAM_WEBHOOK_SECRET
```

**Option B: Via Vercel Dashboard**
1. Go to https://vercel.com/dashboard
2. Click your project (`am-home`)
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - Key: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: Your Supabase URL
   - Environments: Check all three (Production, Preview, Development)
   - Click **Save**
5. Repeat for all variables

### Step 3: Redeploy with Environment Variables

After adding environment variables, redeploy:

```bash
vercel --prod
```

This deploys to production with your environment variables.

### Step 4: Connect Your Domain (a-m.ae)

#### 4a. Add Domain in Vercel

```bash
vercel domains add a-m.ae
```

Or via dashboard:
1. Go to your project → **Settings** → **Domains**
2. Enter `a-m.ae`
3. Click **Add**

#### 4b. Configure DNS

Vercel will show you DNS records to add. Go to your domain registrar (where you bought a-m.ae):

**Add these DNS records:**

For Vercel:
```
Type: A
Name: @
Value: 76.76.21.21
```

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Important:** If you have existing DNS records for a-m.ae, you'll need to decide:
- Keep root on current setup, use subdomain like `home.a-m.ae`
- OR move everything to Vercel

#### 4c. Wait for DNS Propagation

- Usually takes 5-60 minutes
- Check status: `dig a-m.ae` or visit https://dnschecker.org

### Step 5: Set Up SSL Certificate

Vercel automatically provisions SSL certificates! Once DNS propagates:
- ✅ Your site will be live at `https://a-m.ae`
- ✅ SSL certificate auto-renews

### Step 6: Configure Telegram Webhook (Optional)

If you set up Telegram bot, update the webhook URL:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://a-m.ae/api/telegram/webhook?secret=<YOUR_WEBHOOK_SECRET>"}'
```

Replace:
- `<YOUR_BOT_TOKEN>` with your actual bot token
- `<YOUR_WEBHOOK_SECRET>` with your actual webhook secret

Verify it worked:
```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"
```

Should show `"url": "https://a-m.ae/api/telegram/webhook?secret=..."`

---

## 🎯 Complete Deployment Checklist

- [ ] Run `vercel` to deploy
- [ ] Add environment variables via `vercel env add` or dashboard
- [ ] Run `vercel --prod` to redeploy with env vars
- [ ] Add domain `a-m.ae` via `vercel domains add`
- [ ] Update DNS records at your domain registrar
- [ ] Wait for DNS propagation (5-60 minutes)
- [ ] Test site at `https://a-m.ae`
- [ ] Set Telegram webhook to production URL (if using Telegram)
- [ ] Test all features work in production

---

## 🧪 Testing Your Production Site

After deployment, test these:

1. **Root redirect:** `https://a-m.ae/` → Should redirect to Notion
2. **Main hub:** `https://a-m.ae/h` → Should show menu with animation
3. **Status banner:** Should display message from Supabase
4. **Wi-Fi page:** QR code should generate
5. **All pages:** Should load without errors
6. **Scan tracking:** Visit `/h` and check Supabase `scan_events` table
7. **Telegram:** Send `/status Test message` to your bot (if configured)

---

## 🔍 Troubleshooting

### Site shows errors in production but works locally?

**Check environment variables:**
```bash
vercel env ls
```

Should show all your variables. If missing, add them and redeploy.

### Status banner not showing?

1. Check browser console for errors
2. Verify Supabase credentials in Vercel env vars
3. Make sure you ran `vercel --prod` after adding env vars

### Domain not working?

1. Check DNS: `dig a-m.ae`
2. Should show Vercel's IP: `76.76.21.21`
3. If not, check DNS records at your registrar
4. Wait longer (DNS can take up to 24 hours)

### SSL certificate not working?

1. Wait for DNS to fully propagate first
2. Vercel auto-provisions SSL once DNS is correct
3. Check Vercel dashboard → Domains for status

### Telegram bot not receiving updates?

1. Verify webhook URL: `curl https://api.telegram.org/bot<TOKEN>/getWebhookInfo`
2. Should point to production URL
3. Test manually: `curl -X POST https://a-m.ae/api/telegram/webhook?secret=<SECRET>`

---

## 🔄 Future Deployments

After initial setup, deploying updates is easy:

**Deploy to production:**
```bash
vercel --prod
```

Or:
- Push to GitHub (if you connected it)
- Vercel auto-deploys on every push!

---

## 🎊 You're Live!

Once DNS propagates, your site will be live at:
- 🌐 **https://a-m.ae** (redirects to Notion)
- 🏠 **https://a-m.ae/h** (your townhouse hub)

All with:
- ✅ Free hosting
- ✅ Automatic SSL
- ✅ Global CDN
- ✅ Automatic deployments
- ✅ Zero server management
