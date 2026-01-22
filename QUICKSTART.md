# Quick Start Guide

Get your townhouse homepage running in 5 minutes!

## 1. Install Dependencies

```bash
npm install
```

## 2. Create Environment File

Create `.env.local` in the project root:

```env
# Required for development (use placeholder values to start)
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder-key
SUPABASE_SERVICE_ROLE_KEY=placeholder-service-key

# Optional for development
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
TELEGRAM_WEBHOOK_SECRET=
```

## 3. Update Configuration

Edit `config/site.ts`:
- Update Wi-Fi credentials
- Update contact information
- Update rental property links

## 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:5173

## 5. Test the Site

- ✅ Root `/` should redirect to Notion page
- ✅ `/h` should show the main menu
- ✅ `/h/wifi` should show Wi-Fi QR code
- ✅ Other pages should load with placeholder content

## What Works Without Setup?

✅ All pages render
✅ Navigation works
✅ Wi-Fi QR code generator works
✅ Entry animation works (with fallback emoji if no image)

## What Needs Setup?

🔧 **Supabase** (for status banner & guestbook)
🔧 **Telegram Bot** (for scan notifications & status updates)
🔧 **Images** (add photos to `/public` folder)

## Next Steps

1. **Set up Supabase:**
   - Create account at supabase.com
   - Run SQL from `supabase/schema.sql`
   - Update `.env.local` with real credentials

2. **Set up Telegram Bot:**
   - Follow instructions in README.md
   - Optional but highly recommended!

3. **Add Images:**
   - See `/public/.gitkeep` for image list
   - Start with `qr-photo.jpg` for best experience

4. **Deploy to Vercel:**
   ```bash
   vercel
   ```

## Troubleshooting

### Port 5173 already in use?
Change port in `package.json`:
```json
"dev": "next dev -p 3000"
```

### Supabase errors?
The site will work without Supabase, but:
- Status banner won't load (graceful fallback)
- Scan tracking will fail silently
- Guestbook will show empty state

### Images not showing?
- Check files are in `/public` folder (not `/public/images`)
- Use exact filenames from `/public/.gitkeep`
- Images should be accessible at `/image-name.jpg`

## Development Tips

- **Hot reload:** Changes auto-refresh in browser
- **Type checking:** `npx tsc --noEmit`
- **Build test:** `npm run build` before deploying

## Need Help?

Check the full [README.md](./README.md) for detailed instructions!

---

Happy building! 🚀
