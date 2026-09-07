# Curio 🌟
An AI-curated daily discovery box for kids — fun facts, jokes, mini science
experiments, curated around one theme every day.

Built for the OpenAI Codex Hackathon (July 2026).

## Development

Install all project dependencies, then start the frontend and API together:

```bash
npm run install:all
npm run dev
```

The React app runs at `http://localhost:5173` and proxies `/api` requests to the
local API adapter at `http://localhost:3001`. Copy `.env.example` to `.env`
and set `OPENAI_API_KEY` to enable AI-powered generation locally.

## Deploy to Vercel

1. Push this repository to GitHub, then import it from the Vercel dashboard.
2. In the Vercel project, open **Settings → Environment Variables** and add
   `OPENAI_API_KEY` with your OpenAI API key.
3. Deploy. Vercel builds the React app from `client/` and automatically serves
   the root `api/` serverless functions at `/api/generate-bundle` and
   `/api/ask-anything`.

No client configuration is needed: the frontend uses relative `/api/...` URLs,
which work in both local development and the deployed app.
