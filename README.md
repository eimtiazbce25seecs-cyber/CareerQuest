# CareerQuest

A playful career-discovery game. Choose a character, take the discovery quest, try a "day in the life" of a career, and watch your career matches evolve as you learn what you actually enjoy.

**Live demo:** https://career-quest-peach.vercel.app

## Features

- **Characters:** pick a starting persona (Creator, Thinker, Connector, Explorer) that seeds your trait profile.
- **Discovery quest:** 8 short questions that build a six-trait preference profile (creativity, analysis, teamwork, autonomy, exploration, purpose).
- **Career matching:** 8 careers ranked by an Ikigai-style fit score (what you love, what you're good at, what the world needs, what pays).
- **Day-in-the-life simulations:** two short scenes per career. Make a call, then rate how it felt (enjoyment and confidence). Your ratings update your matches.
- **Reflection:** separates what you enjoy from what you felt able to do, with a journal.
- **30-day roadmap:** a 4-week, 12-step starter plan for any career.
- **XP, levels, and badges:** light gamification to keep exploring.
- **Report export:** download your results as a markdown file.
- **Accounts or guest mode:** sign up with Supabase Auth, or continue as a guest with nothing sent to a database.

## Tech stack

- [Next.js 15](https://nextjs.org/) (App Router) and React 19
- TypeScript
- Tailwind CSS 4, Radix UI (dialog, slot), `lucide-react` icons, Recharts
- [Supabase](https://supabase.com/) Auth (`@supabase/supabase-js`, `@supabase/ssr`)

## Getting started

### Prerequisites

- Node.js 18.18 or newer
- A free Supabase project (for sign up and login)

### 1. Install

```bash
npm install
```

### 2. Set environment variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

| Variable | Where to find it | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → Project Settings → API | Safe to expose to the browser |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same page | Safe to expose to the browser |
| `SUPABASE_SERVICE_ROLE_KEY` | Same page | **Server-only.** Used to delete accounts. Never give it a `NEXT_PUBLIC_` prefix and never commit it |

The app will not build or run without the first two variables, because the Supabase client is created when the app loads.

### 3. Configure Supabase Auth

In the Supabase dashboard under **Authentication → URL Configuration**, set the Site URL to your app's URL and add your local and deployed URLs (for example `http://localhost:3000` and your Vercel domain) to the redirect URLs. This is needed for the email confirmation link to land back on your app.

Sign up works with email confirmation switched on or off. With it on, users see a "check your email" message and log in after confirming.

### 4. Run

```bash
npm run dev     # http://localhost:3000
```

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
```

## Deploy on Vercel

1. Push the repo to GitHub and import it in Vercel.
2. In **Project Settings → Environment Variables**, add all three variables from above for both **Production** and **Preview**.
3. Deploy. If you add or change variables later, redeploy so they take effect.
4. Add your Vercel domain to the Supabase redirect URLs (see step 3 above).

## Project structure

```
app/
  layout.tsx, page.tsx, globals.css   App shell, metadata, theme tokens
  api/account/route.ts                Server route: deletes the signed-in user's account
components/
  auth/                               Log in, sign up (with character pick), guest mode
  providers/                          Auth state and progress state (React context)
  quest/                              App shell and the seven views
    views/                            journey, discovery, careers, simulation,
                                      reflection, roadmap, profile
  ui/                                 Button and dialog primitives
lib/
  auth.ts                             Supabase Auth wrapper plus guest mode
  supabase.ts                         Browser Supabase client
  storage.ts                          localStorage persistence for progress
  scoring.ts                          Traits, Ikigai fit, XP, levels, badges
  roadmap.ts                          30-day plan builder and journal prompts
  report.ts                           Markdown report export
  types.ts                            Shared types
  data/                               Content: characters, questions, careers
public/images/                        Character and hero images
```

## How it works

**Flow:** the root component wraps the app in an auth provider. Until there is a user (signed in or guest), it shows the auth screen. After that it mounts the progress provider and the app shell with its seven views. Navigation uses the URL hash, so refresh and the back button work.

**Progress** is a single object: your character, quiz answers, simulation evidence, roadmap tasks, journal entries, and explored careers. A reducer updates it, and everything shown (traits, rankings, XP, badges) is recomputed from it.

**Scoring** (`lib/scoring.ts`):

1. **Traits (0 to 98).** Your character seeds the values. Each quiz answer adds 2 to a primary trait and 1 to a secondary trait. The final value is `min(98, 50 + raw × 4)`.
2. **Base fit.** Each career has trait weights, and the base fit is the weighted average of your traits.
3. **Ikigai score.**
   - *Love* starts from the base fit and moves by `(enjoyment − 3) × 7` for each simulation rated. Simulations of careers with shared tags nudge it slightly.
   - *Good at* starts near neutral and moves with your confidence ratings and the quality of your decisions.
   - *World needs* and *paid* are fixed per-career values.
   - Overall = 35% love + 25% good at + 20% needs + 20% paid.
4. **Simulations.** Each scene offers three scripted choices rated 0 to 2. You can also write your own approach, but free-text answers are not scored.
5. **XP.** 50 for choosing a character, 25 per quiz answer, 100 per simulation, 10 per roadmap step, 30 per journal entry, 5 per career explored. A new level every 200 XP.

## Accounts and data

- **Authentication** is handled by Supabase Auth. Passwords are hashed and sessions are issued by Supabase.
- **Progress is stored in the browser** (localStorage), keyed by user id. It does not sync across devices yet.
- **Guest mode** has no Supabase session. Its progress stays in the browser, and if a guest later signs up, their progress is carried over to the new account.
- **Account deletion** goes through `app/api/account`, which verifies the caller's token on the server and deletes only that user.

## Editing content

All content lives in `lib/data/`, so you can extend the game without touching logic:

- `characters.ts`: starting personas and their trait seeds
- `questions.ts`: discovery quiz questions and the traits each answer feeds
- `careers.ts`: careers, trait weights, tags, simulation scenes, and outcomes

The career numbers (`needs`, `paid`) are illustrative values for the prototype, not labor-market forecasts.

## Limitations and next steps

- Progress does not sync across devices. Moving it into Supabase tables is the natural next step.
- Career summaries and scenarios are hand-written prototype content. O\*NET-backed data would be a good replacement.
- Free-text simulation answers are recorded but not scored.
- Scores are estimates from self-reported answers. They are not validated assessments or employment forecasts.
