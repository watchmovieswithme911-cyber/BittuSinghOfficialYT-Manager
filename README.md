# 🎬 BittuSinghOfficialYT — AI-Powered YouTube Channel Manager

A full-stack AI-powered content management system for the **BittuSinghOfficialYT** YouTube channel. Manage genres, generate scripts, optimize SEO, track analytics, and automate uploads — all in one dashboard.

## 🌟 Features

| Module | Description |
|--------|-------------|
| 🎵 **Genre Library** | 16 music genres with BPM, mood, tags, language |
| ✍️ **Script Generator** | Lyrics, video scripts, descriptions in Hindi/Punjabi/English/Bhojpuri |
| 🔍 **SEO Optimizer** | Viral titles, tags, descriptions, per-genre SEO tips |
| 📤 **Auto Upload Queue** | 5-stage pipeline: Pending → Processing → Uploading → Uploaded → Failed |
| 🤖 **AI Chatbot** | 24/7 assistant for lyrics, ideas, trends, channel growth |
| 💡 **Video Ideas** | Brainstorm, prioritize, approve/reject content ideas |
| 📅 **Content Calendar** | Month-view scheduler with 6-stage production pipeline |
| 📊 **Analytics Dashboard** | Subscriber growth, views, watch time with interactive charts |
| 💬 **Comment Manager** | Sentiment tracking, status workflow, moderation |

## 🎵 Genres Covered

Bass Boosted · Hindi Devotional · Punjabi Bhangra · English Trance · Racing Motivation · Gym Workout · Bhojpuri Remix · English Rap · Global Trance Remix · Desi Hip Hop · Spiritual Meditation · Hindi Pop Remix · Punjabi Pop · Car Racing Bass · Gym Rep Music · Devotional Fusion

## 🛠 Tech Stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS + shadcn/ui + Recharts + Lucide Icons
- **Backend:** Hono (serverless) + Prisma ORM + SQLite
- **Language:** Supports Hindi, English, Punjabi, Bhojpuri, Hinglish, Global

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/watchmovieswithme911-cyber/BittuSinghOfficialYT-Manager.git
cd BittuSinghOfficialYT-Manager

# Install dependencies
bun install

# Set up database
bunx prisma generate && bunx prisma db push

# Seed sample data
bun run scripts/seed-youtube.ts

# Start dev server
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## 📁 Project Structure

```
├── prisma/
│   └── schema.prisma          # 8 data models
├── src/
│   ├── components/
│   │   ├── GenreLibrary.tsx    # Music genre management
│   │   ├── ScriptGenerator.tsx # Lyrics & script generation
│   │   ├── SEOOptimizer.tsx    # Title/tags/description optimizer
│   │   ├── AutoUploadQueue.tsx # Upload pipeline management
│   │   ├── AIChatbot.tsx       # AI content assistant
│   │   ├── VideoIdeas.tsx      # Idea brainstorming
│   │   ├── ContentCalendar.tsx # Production calendar
│   │   ├── AnalyticsDashboard.tsx # Channel analytics
│   │   ├── CommentManager.tsx  # Comment moderation
│   │   └── ui/                 # 22 shadcn/ui components
│   └── App.tsx                 # Main app with tabbed navigation
├── scripts/
│   ├── seed-youtube.ts         # YouTube content seed data
│   └── seed-ai-agent.ts        # AI agent seed data
└── custom-routes.ts            # Custom API routes
```

## 📡 API Endpoints

| Endpoint | Methods |
|----------|---------|
| `/api/genres` | GET, POST, PATCH, DELETE |
| `/api/videos` | GET, POST, PATCH, DELETE |
| `/api/video-ideas` | GET, POST, PATCH, DELETE |
| `/api/analytics-snapshots` | GET, POST, PATCH, DELETE |
| `/api/comments` | GET, POST, PATCH, DELETE |
| `/api/content-scripts` | GET, POST, PATCH, DELETE |
| `/api/upload-queues` | GET, POST, PATCH, DELETE |
| `/api/chat-messages` | GET, POST, PATCH, DELETE |

## 📜 License

Built with ❤️ for BittuSinghOfficialYT
