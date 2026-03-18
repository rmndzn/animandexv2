# ◈ AnimanDex

A modern anime database website with user accounts, anime tracking, and a rank progression system. Built with a dark orange glassmorphism aesthetic and powered by live data from the Jikan API.

## What It Does

Browse and search thousands of anime titles, then track everything you watch with a personal list — just like MyAnimeList, but with a cleaner UI. Your list and rank are saved to your account and persist across devices.

## Features

- **Search & Filters** — Live debounced search, genre filter, studio filter, sort by score / popularity / rank
- **Anime Detail Pages** — Full info: synopsis, score, rank, episodes, status, trailer modal, and recommendations
- **User Accounts** — Register and login with email/password via Supabase Auth
- **Anime List Tracking** — Mark any anime as:
  - ▶ Watching
  - ✓ Completed
  - 📋 Plan to Watch
  - ✕ Dropped
- **Rank System** — Your rank grows with your list size:
  | Rank | Requirement |
  |---|---|
  | 🌱 Newbie | 0+ anime |
  | ⭐ Anime Fan | 5+ anime |
  | 🌸 Weeb | 15+ anime |
  | 🔥 Otaku | 30+ anime |
  | ⚡ Hardcore Otaku | 60+ anime |
  | 💎 Veteran Otaku | 100+ anime |
  | 👑 Otaku Master | 200+ anime |
- **Profile Page** — View your full list, filter by status, track progress toward next rank
- **Top Anime** — Paginated top-rated TV anime of all time
- **Responsive Design** — Works on desktop, tablet, and mobile

## Design

Dark charcoal background, orange accent colors, glassmorphic cards with soft blur and glow effects. Fonts: Outfit + Manrope.

## Tech Stack

- **Vite + React** — Frontend
- **React Router v6** — Client-side routing
- **Supabase** — PostgreSQL database + Auth (deploys on Vercel free tier)
- **Jikan API** — Free anime data, no API key needed

## Database

Uses Supabase (PostgreSQL). The full schema is in `supabase/schema.sql`. Run it once in your Supabase project's SQL editor to set up all tables, policies, and triggers.

## Deploying to Vercel

1. Create a free project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the Supabase SQL Editor
3. Copy your project URL and anon key from **Project Settings → API**
4. Push this repo to GitHub
5. Import the repo in [vercel.com](https://vercel.com)
6. Add these environment variables in Vercel:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
7. Deploy — done

## Data

All anime data is sourced from [Jikan API](https://jikan.moe), an unofficial REST API for [MyAnimeList](https://myanimelist.net). Free, no API key required.

---

© 2026 AnimanDex — Made by [rmndzn](https://github.com/rmndzn). All rights reserved.
