# Curio

### An AI-curated daily discovery box for curious kids

**[Live Demo →](https://curio-nu-jet.vercel.app/)** &nbsp;|&nbsp; **[Repo](https://github.com/PrakrutiPareek/Curio)**

---

## What it is

Curio turns "I'm bored" into a five-minute adventure. A parent picks their
kid's age, an interest, and how much time they've got — Curio generates a
themed bundle on the spot: a fun fact, a kid-friendly joke, and a hands-on
science experiment using things already lying around the house. Kids can
also ask follow-up questions through a built-in "Ask Me Anything," answered
safely and at the right reading level for their age.

Every bundle is generated live by AI, not pulled from a static content
library — so no two days (or two kids) get quite the same experience.

## Why I built it

This started as my submission for the **OpenAI Codex Hackathon** (a 4-day
build sprint where using Codex as the core dev tool was a requirement). I
wanted to build something with real everyday utility rather than another
productivity tool — something a parent could actually open at 6pm on a
rainy Tuesday and get genuine value from immediately.

After the hackathon, I kept iterating on it as a personal project — cleaning
up the architecture, fixing real production issues (see **What I Learned**
below), and shipping it properly to Vercel — because I wanted it to be more
than a weekend prototype.

## Features

- **Personalized generation** — age, interest, and time-budget inputs shape every bundle
- **Real science experiments** — household materials only, with a clear safety note and a plain-language "why it works" explanation
- **Kid-friendly jokes** — with a tap-to-reveal punchline interaction
- **Ask Me Anything** — an on-theme, age-appropriate Q&A with a built-in content safety filter for anything unsafe or inappropriate
- **Badge collection** — kids build a collection across categories (Space, Animals, Ocean, and more) as they complete activities
- **Printable activity cards** — one-click PDF export for offline/road-trip use
- Fully responsive, built mobile-first for a parent-and-kid shared screen

## Tech Stack

**Frontend:** React (Vite), Tailwind CSS, React Router
**Backend:** Vercel Serverless Functions (Node.js)
**AI:** OpenAI API (`gpt-4.1-nano` / `gpt-4o-mini`) for structured content generation, with prompt-engineered JSON schemas and a keyword-based safety filter
**PDF Export:** `@react-pdf/renderer`
**Hosting:** Vercel
**Dev tooling:** Built with OpenAI Codex as the primary coding assistant

## Architecture notes

- Content generation is fully structured — the AI is prompted to return a
  strict JSON schema (fact, joke, experiment steps, safety note), which is
  validated before being rendered, with a retry path if parsing fails.
- Age-appropriateness and safety aren't an afterthought bolted onto the
  end — every prompt (bundle generation and Ask Me Anything) is
  constrained by age and filtered for unsafe content before it ever
  reaches a child.
- No database — badge progress persists via `localStorage`, which was a
  deliberate scope decision to keep the app fast and simple for a personal
  project of this size.

## What I learned

This project ended up teaching me as much about **shipping** as it did
about prompt engineering:

- **Serverless migration:** Originally built with a local Express server;
  migrating to Vercel serverless functions surfaced real issues — stale
  proxy configs, environment variable scoping across Development/Preview/
  Production, and build-tool auto-detection defaulting incorrectly — all
  good practice in debugging a deployment pipeline, not just app code.
- **Third-party library pitfalls:** Hit a duplicate-React-instance bug
  after adding a PDF export library, and separately learned the hard way
  that `html2canvas`-based PDF tools don't reliably render modern CSS
  (Grid layouts, hidden elements) — which led me to switch to
  `@react-pdf/renderer` for a more robust, canvas-free approach.
- **Designing for kids specifically:** age-appropriate language, visual
  clarity, and a real safety layer for open-ended AI Q&A required more
  careful prompt design than a general-purpose chatbot would.
- **Scoping under a deadline:** originally planned to support origami
  instructions alongside experiments; cut it during the hackathon when
  AI-generated diagrams proved unreliable — a good reminder that a
  smaller, working feature set beats a larger, half-working one.

## Running it locally

```bash
git clone https://github.com/PrakrutiPareek/Curio
cd curio
npm run install:all
vercel dev
```

`vercel dev` runs the Vite frontend and the root `api/` Vercel Functions on
one local origin (normally `http://localhost:3000`). Copy `.env.example` to
`.env.local` and set `OPENAI_API_KEY` to enable AI-powered generation
locally. The client uses relative `/api/...` paths, so no proxy or separate
Express server is required. The root package intentionally has no
`npm run dev` script — run `vercel dev` directly so Vercel can host both the
frontend and functions together.

For a linked Vercel project, add `OPENAI_API_KEY` to its **Development**
environment. `vercel dev` downloads those variables automatically; run
`vercel pull` first if you need to work offline.

## Deploy to Vercel

1. Push this repository to GitHub, then import it from the Vercel dashboard.
2. In the Vercel project, open **Settings → Environment Variables** and add
   `OPENAI_API_KEY` with your OpenAI API key.
3. Deploy. Vercel builds the React app from `client/` and automatically
   serves the root `api/` serverless functions at `/api/generate-bundle`
   and `/api/ask-anything`.

No client configuration is needed: the frontend uses relative `/api/...`
URLs, which work in both local development and the deployed app.

## Roadmap / what's next

- [ ] AI-generated illustrations per activity (image generation API)
- [ ] Optional account sync so badge progress isn't tied to one device
- [ ] Parent dashboard showing a week's worth of completed activities
- [ ] Multi-language support

## Credits

Built solo by [Prakruti Pareek] for the OpenAI Codex Hackathon (July 2026),
using OpenAI Codex as the primary development tool throughout.

---

_Have feedback or spot a bug? Open an issue or reach out — [LinkedIn](https://www.linkedin.com/in/prakruti-pareek)._
