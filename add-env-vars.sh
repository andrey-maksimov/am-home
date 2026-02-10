#!/bin/bash
# Script to add environment variables to Vercel

echo "📝 Adding environment variables to Vercel..."
echo ""
echo "For each variable, you'll be prompted to enter the value."
echo "Then select which environments (Production, Preview, Development) by pressing Space, then Enter."
echo ""

# Supabase variables
echo "1. Adding NEXT_PUBLIC_SUPABASE_URL..."
vercel env add NEXT_PUBLIC_SUPABASE_URL

echo ""
echo "2. Adding NEXT_PUBLIC_SUPABASE_ANON_KEY..."
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

echo ""
echo "3. Adding SUPABASE_SERVICE_ROLE_KEY..."
vercel env add SUPABASE_SERVICE_ROLE_KEY

echo ""
echo "✅ Environment variables added!"
echo ""
echo "Now deploying to production with environment variables..."
vercel --prod
