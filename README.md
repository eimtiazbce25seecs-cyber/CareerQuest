# CareerQuest
A career-discovery game built on Ikigai: choose a character,take the discovery quest, uncover your Learning DNA,  try a "day in the life" of a career, and see your matches change as you gather evidence, with an AI mentor that answers from cited sources.

**Live demo:** https://career-quest-peach.vercel.app

**Why CareerQuest exists**

Most career tools hand students a label after a quiz. That approach has two problems. Interests shift as people try things, and self-estimates of ability are only modestly accurate (a finding reviewed in one of the 32 papers behind our questionnaire). A single snapshot is a weak basis for a life decision.The Tic-Tac-Toe Game Playing Career Guidance System demonstrated that behavioral interaction—observing what users *do* rather than what they *say*—can effectively assess intelligence, patience, learning ability, and problem-solving speed Lubinski (2004). Game-based and scenario-based assessment captures psychological factors through performance rather than introspection.

CareerQuest replaces the snapshot with a short journey of evidence, built on four ideas:

**Measure with research, not guesswork**. A seven-part, branching questionnaire below employing *immersive scenario-based branching*, where each response reveals cognitive tendencies, and subsequent scenarios adapt based on prior answers. The Multi-Dimensional Psychometric Alignment (MDPA) framework validates this multi-dimensional approach, jointly integrating cognitive preferences, cognitive modalities (Gardner's Multiple Intelligences including "logical-mathematical, linguistic, spatial, interpersonal, intrapersonal, musical, bodily-kinesthetic, naturalistic, and existential tendencies"), and personality stability. It is scored against the points actually available, flags ambiguous results, and cites 32 academic sources on career readiness, RIASEC, cognitive ability and AI-assisted guidance.Scoring uses a weighted multi-dimensional rubric where responses earn points (0–5) across relevant intelligence axes. Some intelligences carry higher weight in career-critical contexts, reflecting the established finding that cognitive abilities are organized hierarchically, with general intelligence at the vertex, while specific abilities refine longitudinal forecasts .
What makes it careful rather than a quiz with bars:

Scored against points available. Each dimension is scored against the points the student could have earned on the scenarios they actually answered, and the result shows how many questions backed each bar.
Ambiguity handling. If the top two strengths are almost level, a tie-break question appears. If social answers contradict each other, a reconciliation question asks which statement fits better.
Branching depth. The profile reports how many deeper branches you reached and in which dimensions.
Career-family fit. Five families (for example Engineering, Architecture, Data Science or Counseling, Human Resources, Education) are matched from high and low dimensions, each labelled with its Holland RIASEC pairing.
Sources at the bottom of every section. The questionnaire carries 32 academic references.
**Frame the decision with Ikigai**. Every career is scored on the four circles of Ikigai: what you love, what you are good at, what the world needs and what you can be paid for. Love and Good at start from your character's traits, then move with your own simulation evidence; you can compare how each circle contributes across careers. See The Ikigai engine.
Test it in practice. Short "day in the life" simulations let you try the work, then rate enjoyment and confidence separately, so liking something is never confused with being able to do it. Those ratings update your matches and appear in an evidence timeline.
Grounded the advice with RAG. The mentor, Yuki, uses retrieval-augmented generation over a knowledge base built from the questionnaire's research. She answers only from numbered passages and your profile summary, cites them as [1], [2], and says plainly when the sources do not cover a question. 

The result is a 30-day roadmap for the career you choose, with every score traceable to an answer or a rating you gave.

Everything is framed as a starting point, not a verdict.
🧭 Career possibilities

Eight careers (UX Designer, Data Analyst, Environmental Scientist, Software Engineer, Teacher, Nurse, Product Manager, Journalist), each with real tasks, a reality check, an "AI and this job" note and an O*NET-style occupation label.

Ranked by an Ikigai-style fit score (see below).
Compare paths: tick up to three careers to see the four Ikigai sides side by side.
Surprise path: surfaces a career outside your strongest trait that still scores well, so a good fit is not hidden by your first impression.
## Features

- **Characters:** pick a starting persona (Creator, Thinker, Connector, Explorer) that seeds your trait profile.
- **Discovery quest:** 8 short questions that build a six-trait preference profile (creativity, analysis, teamwork, autonomy, exploration, purpose).
- **Career matching:** 7 careers ranked by an Ikigai-style fit score (what you love, what you're good at, what the world needs, what pays).
- **Day-in-the-life simulations:** two short scenes per career. Make a call, then rate how it felt (enjoyment and confidence). Your ratings update your matches.
**📈 Reflection: your evolving fit**

A chart compares the initial and current fit for your top five careers, an evidence timeline shows the moments behind each change, and a private journal with guided prompts keeps your own words next to the numbers.

**🗺️ 30-day roadmap**

Pick one career and get a four-week plan (three steps each): follow your curiosity, learn one foundational skill, make something small, reflect and choose the next step. Each plan is filled in from the career's own skill and starter project, and finishing all 12 steps earns a badge.
- **XP, levels, and badges:** light gamification to keep exploring.
- **Report export:** download your results as a markdown file.
- **Accounts or guest mode:** sign up with Supabase Auth, or continue as a guest with nothing sent to a database.

**🌸 The Ikigai engine**

Ikigai (生き甲斐) is a Japanese word for what makes life feel worth living. CareerQuest uses the familiar four-circle framing as its scoring frame:

                       What you LOVE
           ╱             ╲
   Passion                 Mission
What you are            What the world
GOOD AT      IKIGAI       NEEDS
   Profession              Vocation
           ╲             ╱
         What you can be PAID FOR

  **Where the principle comes from**
Mieko Kamiya, On the Meaning of Life (1966): the foundational Japanese study of ikigai as a sense that life is worth living.
Héctor García & Francesc Miralles, Ikigai: The Japanese Secret to a Long and Happy Life (2016).
Marc Winn (2014): the four-circle Venn diagram popularised in the West, adapted from an earlier "purpose" diagram by Andrés Zuzunaga.
Sone et al., Psychosomatic Medicine 70 (2008), the Ohsaki cohort study of about 43,000 adults linking having ikigai with lower mortality.

Note: the four-circle Venn is a Western adaptation. In Japanese usage ikigai is usually found in small, everyday sources of meaning. CareerQuest uses the diagram as a transparent scoring frame, not as a claim about traditional ikigai.
## How it works

**Flow:** the root component wraps the app in an auth provider. Until there is a user (signed in or guest), it shows the auth screen. After that it mounts the progress provider and the app shell with its seven views. Navigation uses the URL hash, so refresh and the back button work.

**Progress** is a single object: your character, quiz answers, simulation evidence, roadmap tasks, journal entries, and explored careers. A reducer updates it, and everything shown (traits, rankings, XP, badges) is recomputed from it.

**Scoring** (`lib/scoring.ts`):

1. **Traits (0 to 98).** Your character seeds the values. Each quiz answer adds 2 to a primary trait and 1 to a secondary trait. The final value is `min(98, 50 + raw × 4)`.
2. **Base fit.** Each career has trait weights, and the base fit is the weighted average of your traits.
3. **Ikigai score.**
   - *Love* starts from the base fit and moves by `(enjoyment − 3) × 7` for each simulation rated. Simulations of careers with shared tags nudge it slightly.
   - *Good at* starts near neutral and moves with your confidence ratings and the quality of your decisions.
   - *World needs* and *paid* are backed by career values taken from datsets 
   - Overall = 35% love + 25% good at + 20% needs + 20% paid.
4. **Simulations.** Each scene offers three scripted choices rated 0 to 2. You can also write your own approach
5. **XP.** 50 for choosing a character, 25 per quiz answer, 100 per simulation, 10 per roadmap step, 30 per journal entry, 5 per career explored. A new level every 200 XP.

## Accounts and data

- **Authentication** is handled by Supabase Auth. Passwords are hashed and sessions are issued by Supabase.
- **Progress is stored in the browser** (localStorage), keyed by user id. 
- **Guest mode** has no Supabase session. Its progress stays in the browser, and if a guest later signs up, their progress is carried over to the new account.
- **Account deletion** goes through `app/api/account`, which verifies the caller's token on the server and deletes only that user.

Models and AI

CareerQuest combines deterministic, auditable scoring with a small amount of ML and retrieval-grounded generation. Each piece does one job and can run without the others.

1. Deterministic scoring engine (scoring/)

Every response maps to fixed point vectors, so the same answer always gives the same score. It includes a branching engine (which scenario comes next), a profile vectorizer (profile → vector for retrieval) and confidence levels from very low to very high.

2. XGBoost dimension scorer (models/)
What: one XGBRegressor per dimension (n_estimators=50, max_depth=3, learning_rate=0.3, RMSE metric), stored as models/dna_xgboost.json (about 540 KB).
How it is trained: python -m models.train_xgboost. Training data is synthetic: it is generated from the questionnaire's own scoring vectors, one sample per possible answer.
How it is used: it is blended with the deterministic scorer. If the model file or the xgboost package is missing, scoring falls back to the deterministic path with no change in behaviour.
What it is not: it learns the rubric, it is not a validated predictor of ability or success. We say so in the report footer and the UI.
3. Retrieval-augmented mentor (Ask Yuki)
Layer	What it does
Corpus	87 passages built from the questionnaire (backend/knowledge.json), loaded into Postgres by python ingest.py
Production retrieval	Postgres full-text search (tsvector, ts_rank) returning the top five passages
Hybrid retrieval library (rag/)	Title-weighted BM25 blended with dense similarity from sentence-transformers/all-MiniLM-L6-v2, indexed with HNSW (hnswlib); a deterministic token-hashing embedding keeps it working when the model weights are unavailable
Context assembly	Bounded, numbered evidence plus the student's profile, trimmed so large profiles never break the prompt
Generation	Anthropic Claude (model set by ANTHROPIC_MODEL), instructed to answer only from numbered context, cite [n], keep under 180 words, and say when the context does not cover the question
Graceful degradation	No API key: the endpoint returns the matching passages with status: "not_configured". No match: status: "no_match". It never invents an answer
4. Satisfaction and feedback modules (satisfaction/)

A tracker, an outcome predictor and a feedback loop for recording how students feel about their choices and learning from it. Covered by unit tests. The storage classes in knowledge_bases/ (careers, scenarios, satisfaction, user history) are interface skeletons for a future persistence layer; today progress is stored as one JSON document in Postgres.

Evidence base

The 32 references in the app include career-readiness typologies, AI-assisted career matching and guidance evaluations, RIASEC research and cognitive-ability work (for example Gottfredson 2003, Lubinski 2004, Orzan 2026, Steppan et al. 2026, and the OECD Skills Profiling Tool by Tuccio et al. 2023). The full list is shown at the bottom of each profiler section and is exported with the catalog.

🏗️ Architecture
/api/* rewrite
retrieve top passages
grounded answer
optional
keeps Python catalogin sync with UI data
Browser
Next.js 15 appReact 19 · Tailwind 4
FastAPI backend
Postgres / Supabaseusers · progress ·rag_chunks
Anthropic Claude
XGBoost scorer+ deterministic scorer
scripts/export-catalog.mjs

**Key design choices:**

First-party cookies. The browser only talks to the Next.js origin. /api/* is proxied to FastAPI (frontend/next.config.mjs), so login cookies stay first-party.
One source of truth for content. Careers, scenarios and references live in frontend/lib/data/. scripts/export-catalog.mjs exports them to backend/catalog.json for Python, and --check fails CI if the two drift.
Progress is one JSON document per user, saved through a small queue (save-queue.ts) so quick successive actions do not overwrite each other.
**🧰 Tech stack**
Layer	Technology
Frontend	Next.js 15, React 19, TypeScript 5.6, Tailwind CSS 4, Radix UI (Dialog, Slot), class-variance-authority, clsx, tailwind-merge, lucide-react, Recharts, tw-animate-css
Backend	FastAPI, Uvicorn, asyncpg, Pydantic v2 (email), bcrypt, PyJWT
Database	PostgreSQL 17 (local Docker) or Supabase Postgres (hosted)
ML / retrieval	XGBoost, NumPy, BM25 (in-house), sentence-transformers and hnswlib (optional, not required)
LLM	Anthropic Python SDK (Claude)
Testing	pytest, pytest-asyncio, httpx, Node test runner for the TypeScript API client
Deploy	Docker and Docker Compose, Vercel
**🔌 API reference**

The FastAPI service (backend/main.py) documents itself at /docs.

Method	Endpoint	Purpose
POST	/auth/signup	Create an account and send a verification email
POST	/auth/verify · /auth/resend	Confirm or resend the email link
POST	/auth/login	Log in (limited to 10 attempts per 15 minutes per email)
POST	/auth/forgot · /auth/reset	Password reset flow
POST	/auth/logout	Clear the session cookie
GET PATCH DELETE	/auth/me	Read, update or delete your account
GET PUT	/progress	Load or save the progress document
POST	/rag/ask	Ask Yuki (limited to 20 questions per 10 minutes per user)
GET	/health	Liveness check
