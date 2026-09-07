# Curio 🌟
An AI-curated daily discovery box for kids — fun facts, jokes, mini science
experiments, curated around one theme every day.

Built for the OpenAI Codex Hackathon (July 2026).

## Development

Install all project dependencies, then start the Vercel development environment:

```bash
npm run install:all
vercel dev
```

`vercel dev` runs the Vite frontend and the root `api/` Vercel Functions on one
local origin (normally `http://localhost:3000`). Copy `.env.example` to
`.env.local` and set `OPENAI_API_KEY` to enable AI-powered generation locally.
The client uses relative `/api/...` paths, so no proxy or separate Express
server is required. The root package intentionally has no `npm run dev` script:
run `vercel dev` directly so Vercel can host both the frontend and functions.

For a linked Vercel project, add `OPENAI_API_KEY` to its **Development**
environment. `vercel dev` downloads those variables automatically; run
`vercel pull` first if you need to work offline.

## Deploy to Vercel

1. Push this repository to GitHub, then import it from the Vercel dashboard.
2. In the Vercel project, open **Settings → Environment Variables** and add
   `OPENAI_API_KEY` with your OpenAI API key.
3. Deploy. Vercel builds the React app from `client/` and automatically serves
   the root `api/` serverless functions at `/api/generate-bundle` and
   `/api/ask-anything`.

No client configuration is needed: the frontend uses relative `/api/...` URLs,
which work in both local development and the deployed app.
