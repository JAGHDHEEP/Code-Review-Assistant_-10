<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1uXNZnQ44PNRLkgzEWFyES2S3qLuPyPXp

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Create a `.env.local` file (it is gitignored) containing `GEMINI_API_KEY=your-key`
3. Run the app:
   `npm run dev`

## How the API key is kept private

The browser never sees the Gemini key. The frontend posts code to `/api/review`, and that
endpoint calls Gemini on the server:

- `server/review.ts`: the Gemini call, input validation (100k-character limit) and error handling
- `api/review.ts`: the same handler exposed as a Vercel serverless function
- `vite.config.ts`: serves `/api/review` locally during `npm run dev` and `npm run preview`

## Deploy (Vercel)

Import the repo in Vercel and set `GEMINI_API_KEY` under Project → Settings → Environment
Variables. Vercel serves the Vite build and `api/review.ts` together.
