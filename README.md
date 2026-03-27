# RAISE Now

**RAISE** (Resume AI Socratic Engine) is an AI-powered resume builder that coaches you through building a complete, gap-free resume using a Socratic conversation approach — asking targeted questions one at a time rather than dumping a form on you.

## Features

- **Socratic AI Chat** — RAISE asks focused questions, detects timeline gaps in your career history, and extracts structured resume data from natural conversation
- **Live Streaming Responses** — AI replies stream token-by-token for a natural chat feel
- **Resume Preview** — Real-time preview across multiple templates (Classic, Modern, Minimal, Executive)
- **Career Insights** — Skill breakdown, role-fit radar, and gap analysis against target roles
- **Completeness Panel** — Detects missing sections and lets you jump straight to fixing them
- **Auth & Quota** — NextAuth credential auth with per-user daily message limits

## Tech Stack

- **Framework** — Next.js 15 (App Router)
- **AI** — OpenRouter API (OpenAI-compatible, model-swappable)
- **Database** — MongoDB Atlas
- **Auth** — NextAuth.js
- **Styling** — CSS Modules with custom design tokens

## Getting Started

### 1. Clone & install

```bash
git clone git@github.com:thefullstackalchemist/raisenow.git
cd raisenow
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in `.env.local` with your credentials:

| Variable | Description |
|---|---|
| `OPENROUTER_API_KEY` | API key from [openrouter.ai](https://openrouter.ai) |
| `OPENROUTER_BASE_URL` | OpenRouter base URL (default provided) |
| `OPENROUTER_MODEL` | Model slug — swap freely (e.g. `openai/gpt-4o`) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `NEXTAUTH_SECRET` | Random secret for JWT signing (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | App base URL (`http://localhost:3000` for local dev) |

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  api/          # Route handlers (chat, auth, profile, insights, quota…)
  resume/       # Resume builder page
  insights/     # Career insights page
  login/        # Auth page
  templates/    # Template picker page
components/
  Dashboard/    # ChatPanel, CompletenessPanel, AccordionPanel
  Resume/       # ResumePreview, templates, ColorThemePicker
  Insights/     # RadarChart, SkillBreakdown, GapCard…
lib/
  services/     # AIService, profileDbService, quotaService…
  constants/    # System prompts, AI config, quota limits
services/       # Client-side API fetch helpers
utils/          # Field detection, markdown renderer, resume helpers
```

## Deployment

Deploy to Vercel with zero config — it picks up the App Router automatically. Set all `.env.local` variables as environment variables in your Vercel project settings.

> **Never commit `.env.local`** — it is gitignored. Use `.env.example` as the reference template.
