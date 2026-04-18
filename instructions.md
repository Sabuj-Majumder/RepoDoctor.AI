```markdown
# Build RepoDoctor AI (Open Source GitHub Repository Auditor)

You are an elite senior full-stack engineer and product architect.

Your task is to build a production-quality MVP named **RepoDoctor AI**.

RepoDoctor AI is a web app that audits any public GitHub repository and generates a professional health report, improvement suggestions, and quality score.

The project must be modern, clean, fast, scalable, and open-source ready.

---

# Core Product Vision

User pastes a GitHub repository URL.

Example:

https://github.com/vercel/next.js

The system analyzes the repository and returns:

- Overall Repo Score (/100)
- README Quality Score
- Project Structure Score
- Activity Score
- Maintainability Score
- Security / Best Practice Score
- Improvement Suggestions
- AI-generated Summary
- Exportable Report

---

# Primary Goal

Build something that feels polished enough to go viral on GitHub and Product Hunt.

The experience must feel premium.

---

# Tech Stack (Required)

## Frontend

- Next.js 15+ App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion

## Backend

Use Next.js API routes / server actions

## Database

Use Prisma + SQLite for MVP

## External APIs

Use GitHub Public REST API

## AI (Optional Layer)

Support local LLM via Ollama API:

- llama3
- mistral
- qwen

If unavailable, fallback gracefully.

---

# Core Features

## 1. Landing Page

Beautiful landing page with:

- Hero section
- Repo URL input
- Example repositories
- Benefits
- Demo screenshots placeholders
- CTA buttons

---

## 2. Repo Analysis Flow

When user submits GitHub repo URL:

### Parse:

- owner
- repo

### Fetch from GitHub:

- repo metadata
- stars
- forks
- issues
- language stats
- README
- file tree
- latest commits
- license
- workflows

Use GitHub REST API.

---

## 3. Scoring Engine (/100)

Create modular scoring system.

### A. README Score (20)

Check:

- title
- description
- install steps
- usage
- screenshots
- badges
- contribution section
- license mention

### B. Structure Score (20)

Check:

- src/
- tests/
- docs/
- examples/
- config files
- organized folders

### C. Activity Score (20)

Check:

- recent commits
- open issues ratio
- releases
- active contributors

### D. Maintainability Score (20)

Check:

- giant files
- missing docs
- poor naming
- duplicated folders
- missing env example

### E. Best Practices Score (20)

Check:

- LICENSE
- .gitignore
- CI/CD workflow
- security policy
- issue templates
- PR templates

Return weighted final score.

---

# 4. Report Dashboard

Build premium dashboard page with:

## Sections:

- Repo Header
- Overall Score Circle
- Category Scores
- Key Problems
- Improvement Recommendations
- AI Summary
- Repo Stats
- Charts
- File Tree Insights

---

# 5. AI Suggestions Layer

If Ollama running locally:

Use AI to generate:

- Professional repo summary
- Better README suggestions
- Refactor suggestions
- New contributor onboarding advice

If unavailable:

Use rule-based fallback text.

---

# 6. Export Features

Allow:

- Download PDF report
- Copy Markdown report
- Shareable report link

---

# 7. Saved History

Store scans in SQLite:

- repo URL
- score
- createdAt
- report snapshot

Build recent scans page.

---

# UI / UX Requirements

Design must feel like:

- Linear
- Vercel
- Stripe-level clean

Use:

- dark mode default
- glass cards
- subtle animation
- responsive mobile layout
- premium typography
- smooth transitions

---

# Pages Required

## /

Landing page

## /analyze

Repo input page

## /report/[id]

Saved report page

## /history

Past scans

---

# Components Required

- Navbar
- Footer
- Hero
- RepoInput
- ScoreCard
- RadarChart
- RecommendationsList
- RepoStatsCard
- LoadingSkeleton
- ErrorState

---

# Backend Architecture

Create services:

/lib/github.ts  
Handles GitHub API calls

/lib/scorer.ts  
All scoring logic

/lib/analyzer.ts  
Repo parsing + metrics

/lib/ai.ts  
Ollama integration

/lib/report.ts  
Export helpers

---

# GitHub API Requirements

Use public endpoints.

Need:

- repository details
- readme
- contents tree
- commits
- contributors
- workflows

Handle rate limits elegantly.

Add caching.

---

# Smart Detection Logic

Detect:

- monorepo
- Next.js project
- Python project
- Node project
- Java project
- Dockerized repo

Then tailor suggestions.

Example:

If Node project missing package-lock:

recommend lockfile.

If Python repo missing requirements.txt:

flag it.

---

# Security

Validate URLs.

Prevent abuse.

Add request throttling.

Sanitize markdown output.

---

# SEO

Add:

- metadata
- OG tags
- sitemap
- robots

---

# Performance

- server-side fetching
- route caching
- lazy load charts
- optimize bundle size

---

# Deliverables Required

## 1. Full Working Codebase

Production structured.

## 2. README.md

Excellent open-source README including:

- screenshots placeholders
- install
- setup
- run locally
- roadmap
- contribution guide

## 3. Seed Example Reports

Use:

- vercel/next.js
- facebook/react
- tailwindlabs/tailwindcss

---

# Bonus Features (If Time)

- Compare two repos
- Repo leaderboard
- Chrome extension
- GitHub Action integration
- VSCode extension
- Auto PR suggestions

---

# Code Quality Rules

- strict TypeScript
- reusable components
- clean architecture
- comments where needed
- no messy hacks

---

# Output Format

Build the entire project file by file.

Start with:

1. Folder structure
2. package.json
3. Prisma schema
4. Core backend services
5. UI components
6. Pages
7. Styling
8. README

---

# Important Mindset

Do not create toy code.

Build like a real startup launching in public next week.

Make it GitHub-star worthy.
```
