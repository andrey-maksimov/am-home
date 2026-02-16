# a-m.ae Townhouse Homepage

A modern, playful website for our townhouse with a subtle space theme. Features a ceramic QR code that welcomes guests to a digital hub with Wi-Fi access, contact details, guestbook, and more.

## 🌟 Features

### Phase A (Current Implementation)
- ✅ Root domain redirects to public Notion page
- ✅ `/h` - Modern Linktree-style menu with QR warp-in animation
- ✅ Wi-Fi page with QR code generator
- ✅ Contact page with WhatsApp/Telegram/LinkedIn links
- ✅ Family story page
- ✅ Rental property showcase
- ✅ QR code story page
- ✅ Guestbook list view (stub)
- ✅ Leave message page (UI ready, submission disabled)
- ✅ Scan notifications via Telegram
- ✅ Telegram bot for updating status banner
- ✅ SEO hiding (noindex, robots.txt)
- ✅ Rate limiting for scan notifications

### Phase B/C (Future)
- 🚧 Full guestbook submission with photo upload
- 🚧 Supabase Storage integration
- 🚧 Admin approval workflow for guestbook entries
- 🚧 Enhanced Telegram bot commands

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- A Supabase account
- A Telegram bot (optional but recommended)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd am-home
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `/supabase/schema.sql`
3. Get your credentials from Project Settings > API:
   - Project URL
   - `anon` (public) key
   - `service_role` (secret) key

### 3. Set Up Telegram Bot (Optional)

1. **Create a bot:**
   - Message [@BotFather](https://t.me/botfather) on Telegram
   - Send `/newbot` and follow the prompts
   - Save the bot token

2. **Get your chat ID:**
   - Message your bot
   - Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Find your `chat.id` in the response

3. **Set webhook (after deployment):**
   ```bash
   curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url":"https://a-m.ae/api/telegram/webhook?secret=<YOUR_WEBHOOK_SECRET>"}'
   ```

### 4. Configure Environment Variables

Create a `.env.local` file (copy from `.env.example`):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Telegram Bot
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id
TELEGRAM_WEBHOOK_SECRET=generate-a-random-string

# Cron Job Security (for keep-alive endpoint)
CRON_SECRET=generate-a-random-string

# Notion redirect URL (optional override)
NOTION_PAGE_URL=https://amoffice.notion.site/Andrey-Maksimov-3930e83e68884fbd9da04dcd8dbadab6
```

### 5. Customize Content

Edit `/config/site.ts` to update:
- Wi-Fi credentials
- Contact details (phone, WhatsApp, Telegram, LinkedIn)
- Rental property links

### 6. Add Images

Add these images to the `/public` directory:
- `qr-photo.jpg` - Photo of ceramic QR code
- `coverage-map.png` - Wi-Fi coverage map
- `router-install-1.jpg`, `router-install-2.jpg` - Router photos
- `pottery-process-1.jpg`, `pottery-process-2.jpg` - QR making process
- `family-photo.jpg` - Main family portrait
- `family-1.jpg` through `family-4.jpg` - Family gallery photos
- `rental-hero.jpg` - Main rental property photo
- `rental-1.jpg` through `rental-4.jpg` - Property photos

### 7. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`

### 8. Deploy to Vercel

```bash
vercel
```

Or connect your GitHub repo to Vercel for automatic deployments.

Don't forget to add environment variables in Vercel Dashboard > Settings > Environment Variables.

## 🤖 Telegram Bot Commands

Once your bot webhook is configured, you can use:

- `/status <message>` - Update the homepage banner
  - Example: `/status Welcome! We're home this weekend.`
- `/help` - Show available commands

## 📊 How Scan Notifications Work

1. When someone visits `/h` for the first time in a day:
   - A POST request is sent to `/api/scan`
   - The visit is logged to Supabase `scan_events` table
   - A Telegram notification is sent to your configured chat
   - Rate limiting prevents spam (max once per 10 minutes per unique visitor)

2. **Privacy:** IP addresses are hashed (SHA-256) before storage

3. **Rate Limiting:** In-memory store (for production, consider Redis)

## ⏰ Supabase Keep-Alive

To prevent Supabase free-tier projects from pausing after 7 days of inactivity, a Vercel Cron job automatically pings the database every 5 days:

- **Endpoint:** `/api/keep-alive`
- **Schedule:** Every 5 days (at midnight UTC)
- **Security:** Protected by `CRON_SECRET` environment variable

The cron job performs a simple database query to keep the project active without upgrading to Pro.

**Setup in Vercel:**
1. Add `CRON_SECRET` to your environment variables (generate a random string)
2. The cron job is automatically configured via `vercel.json`
3. Check Vercel Dashboard > Cron Jobs to verify it's running

## 🔒 SEO Hiding

The site is hidden from search engines via:
- `robots.txt` - Disallows all crawlers
- Meta tags - `noindex, nofollow` on all pages
- HTTP headers - `X-Robots-Tag: noindex, nofollow`

No authentication is required; the site is "hidden" but publicly accessible.

## 🎨 Design System

### Colors
- `space-dark`: `#0a0e27` - Deep space background
- `space-purple`: `#6366f1` - Primary accent
- `space-blue`: `#3b82f6` - Secondary accent
- `space-glow`: `#818cf8` - Highlight color

### Components
- `PageShell` - Page wrapper with back button
- `LinkButton` - Styled link with hover glow
- `Card` - Frosted glass effect card
- `NoteBanner` - Dynamic status banner

### Animations
- Entry animation: QR photo warps into menu (once per day)
- Starfield background: Subtle floating stars
- Button glows: Hover effects with box shadows

## 📁 Project Structure

```
am-home/
├── app/
│   ├── api/
│   │   ├── scan/route.ts           # Scan tracking & notifications
│   │   ├── status/route.ts         # Fetch status banner
│   │   ├── telegram/webhook/       # Telegram bot webhook
│   │   └── guestbook/
│   │       ├── list/route.ts       # Fetch guestbook entries
│   │       └── submit/route.ts     # Submit entry (stub)
│   ├── h/
│   │   ├── page.tsx                # Main menu
│   │   ├── wifi/page.tsx           # Wi-Fi QR code
│   │   ├── qr-story/page.tsx       # Ceramic QR story
│   │   ├── contact/page.tsx        # Contact details
│   │   ├── family/page.tsx         # Family page
│   │   ├── rental/page.tsx         # Rental property
│   │   ├── leave-message/page.tsx  # Message form
│   │   └── guestbook/page.tsx      # Guestbook list
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Root redirect
│   └── globals.css                 # Global styles
├── components/
│   ├── PageShell.tsx               # Page wrapper
│   ├── LinkButton.tsx              # Styled button
│   ├── Card.tsx                    # Card component
│   ├── NoteBanner.tsx              # Status banner
│   ├── WarpAnimation.tsx           # Entry animation
│   └── ScanTracker.tsx             # Client-side scan tracking
├── lib/
│   ├── supabase.ts                 # Supabase clients
│   ├── telegram.ts                 # Telegram helpers
│   └── rate-limit.ts               # Rate limiting
├── config/
│   └── site.ts                     # Site configuration
├── supabase/
│   └── schema.sql                  # Database schema
├── public/
│   ├── robots.txt                  # SEO blocking
│   └── [images]                    # Image assets
├── next.config.js                  # Next.js config
├── tailwind.config.ts              # Tailwind config
└── package.json
```

## 🛠️ Development Tips

### Testing Locally
```bash
npm run dev
```

### Building for Production
```bash
npm run build
npm start
```

### Checking for Type Errors
```bash
npx tsc --noEmit
```

### Testing Telegram Webhook Locally
Use [ngrok](https://ngrok.com/) to expose your local server:
```bash
ngrok http 5173
```
Then update webhook with ngrok URL.

## 🔄 Phase B Implementation Guide

When ready to implement full guestbook submission:

1. **Update `/app/api/guestbook/submit/route.ts`:**
   - Accept form data with photo upload
   - Upload photo to Supabase Storage
   - Insert entry with `published=false`
   - Send Telegram notification to admin

2. **Create admin approval flow:**
   - Add Telegram bot commands: `/approve <id>`, `/reject <id>`
   - Update `published` status in database

3. **Update client components:**
   - Enable form submission in `leave-message/page.tsx`
   - Add photo upload UI with preview
   - Show success message after submission

## 📝 License

Private project for personal use.

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [qrcode](https://www.npmjs.com/package/qrcode)

---

Made with ❤️ in Dubai 🇦🇪
# Trigger deployment to enable cron jobs
