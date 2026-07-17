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
Express server at `http://localhost:3001`. Add a provider key to `server/.env`
when AI-powered bundle generation is implemented.
