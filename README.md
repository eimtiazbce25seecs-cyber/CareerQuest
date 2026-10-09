<<<<<<< HEAD
# CareerQuest

A playful career-discovery game: choose a character, take the discovery quest, try a day in the life of a career, and watch your matches evolve. Frontend only (Next.js 15, React 19, Tailwind 4).

## Run
```bash
npm install
npm run dev     # http://localhost:3000
```

## Deploy on Vercel
Push to GitHub, import the repo in Vercel, and deploy. No environment variables are needed.

## Structure
- `app/` – layout, page, global styles (colors and tokens in `globals.css`)
- `components/providers/` – auth and progress state
- `components/auth/` – log in, sign up (with character pick), guest mode
- `components/quest/` – app shell and views (journey, discovery, careers, simulation, reflection, roadmap, profile)
- `lib/data/` – characters, discovery questions, careers and scenarios (edit these to add content)
- `lib/scoring.ts` – trait scoring, Ikigai fit, XP, badges
- `lib/auth.ts` – browser-only accounts (see note)

## Note on accounts
Accounts are stored in the browser (salted PBKDF2 hashes in localStorage), so progress stays on one device. That suits a demo; replace `lib/auth.ts` and `lib/storage.ts` with Supabase/Clerk/Auth.js if you need cross-device accounts.
=======
# CareerQuest
>>>>>>> 8cf5b7e87a944fc0fd2fae937f944e2deee4777f
