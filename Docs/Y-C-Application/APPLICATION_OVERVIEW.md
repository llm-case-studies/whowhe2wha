# YC Application Overview

## Are people using your product.md

Not many outside of myself and my wife. We deployed the public demo two days ago; the next step is onboarding 5–10 planners (actuarial coworkers, tennis league captains, family event coordinators) to validate the richer event types and collaboration flows.

## Are you currently fundraising.md

No. Focused on product and early users; will raise only if YC or demand requires it.

## Are you looking for a cofounder.md

Not actively. I’m comfortable carrying the product forward as a solo founder and have already built the current prototype myself. That said, I’m open to adding a cofounder later if I meet someone with deep go-to-market or community-building DNA who shares the same obsession with context-aware planning.

## Company URL.md

https://llm-case-studies.github.io/whowhe2wha/

## Company name.md

WhoWhe2Wha (pronunciation adapts by locale; in English we often say “Who-way-too-wah”).

## Describe what your company does in 50 characters or less.md

Context-aware life/work timeline OS.

## Do you have revenue.md

No.

## Explain your decision regarding location.md

I already live in Monroe, NJ and have family roots here, so basing the LLC locally keeps operations simple while I focus on product. Engineering and go-to-market are remote-friendly, but the legal entity, banking, and initial ops will stay in New Jersey until it makes sense to flip into a Delaware C-corp for YC.

## Have you formed ANY legal entity yet.md

Not yet. Plan is to register a New Jersey LLC in the next few weeks, then flip to a Delaware C-corp if admitted to YC.

## Have you taken any investment yet.md

No—self-funded.

## How did you hear about Y Combinator.md

Following YC since Hacker News + Startup School days; also attended YC Build sessions and podcasts.

## How do or will you make money-How much could you make.md

Freemium: the free tier lets individuals host data in their own Google Drive/iCloud/Dropbox. The paid tier ($12–$18/user/month) provides our managed sync, real-time collab, AI prep suggestions, and premium templates (travel, exam, fundraising). Long term we can layer in enterprise licensing for teams that need compliance exports or custom templates (insurers, consulting shops). If we capture even 0.1% of the ~50M U.S. knowledge workers who juggle structured projects + personal logistics, that’s a $72M ARR business; the broader TAM (global professional/household planners) pushes it into hundreds of millions.

## How far along are you.md

Clickable prototype (public GitHub Pages build) with the core experience working: zoomable timeline, tiered project lanes, history sidebar, CSV/mock data import, AI-assisted search via Gemini, Google Places-powered location finder, and smooth Maps integration for travel. No external users yet beyond myself and my wife, but the daily driver I use for my own work/personal planning is the same code we just deployed.

## How long have each of you been working on this.md

I started this specific incarnation of WhoWhe2Wha on Nov 3, 2025, after my wife suggested turning an actuary exam-planning tool from my ActCLI suite into a general-purpose context engine. Grok helped brainstorm the name/concept that day, and within 72 hours Gemini in Google AI Studio helped spike the initial UI. Once the codebase outgrew AI Studio I moved the repo local and continued full-time in VS Code with Codex CLI and Claude. So it’s been one very intense week so far, 100% of it full-time.

## If login credentials are required for the link above, enter them here.md

Not required (public demo).

## If you applied with a different idea, why did you pivot and what did you learn from the last idea.md

I previously applied with other experiments—StockPolls (community investing), iHomeNerd/iOfficeNerd (IoT concierge), and PronunCo (multilingual pronunciation tutor). Each taught me something: how to run remote beta programs, how hard hardware loops are, and how to ship compact language features. Since Fall 2024 two things changed: (1) the AI toolchain (Codex CLI, Claude CLI, Gemini 2.5 Pro) became strong enough that a solo founder can build a polished planner quickly, and (2) I’ve learned how to collaborate with those models effectively. WhoWhe2Wha also fits that tooling perfectly: React/Vite + AI pair programming lets me ship timeline breakthroughs in days instead of months, so this idea is already far further along than the previous submissions.

## If you had any other ideas you considered applying with-please list them.md

1. AI underwriting copilot for reinsurance treaties (spin-out of my iMedisys workflow work).
2. Tennis league ops platform (scheduling + availability + club payments).
3. Regulatory filing checklist assistant for P&C insurers.

## If you have a demo, attach it below.md

Plan: Screen-record a 2–3 minute walkthrough (Zoom-level timeline, templates, Google Places modal) and export <100MB MP4. Upload with application as demo.

## If you have already participated or committed to participate in an incubator, accelerator or pre-accelerator program please tell us about it.md

None.

## If you have not formed the company yet, describe the planned equity ownership breakdown among the founders, employees and any other proposed stockholders.md

Planned ownership: I will own 100% at formation (single-member LLC to start, then Delaware C-corp post-YC). No other shareholders, options, or SAFEs outstanding yet.

## Please provide a link to the product.md

https://llm-case-studies.github.io/whowhe2wha/

## Please record a one minute video introducing the founder(s).md

Plan: Record a 60-second selfie video covering (1) name/background (actuarial + workflow software), (2) what WhoWhe2Wha does, (3) traction so far, (4) why YC now. Will upload MP4 <100MB before submitting application.

## What batch do you want to apply for.md

Winter 2026.

## What convinced you to apply to Y Combinator.md

I’ve followed YC since the early calendaring/knowledge tools (Sunrise, Cron, Reclaim). YC consistently backs founders who reimagine workflows, and I want that peer group + push while turning WhoWhe2Wha from a polished prototype into a company. Hearing alumni talk about the speed/reset they got (most recently at YC Build) convinced me this is the fastest path to pressure-test distribution, pricing, and collaboration features.

## What is your company going to make.md

WhoWhe2Wha is a “living timeline” that unifies projects, prep work, and social logistics in one context-aware view. Instead of juggling calendars, kanban boards, and email threads, users drag templates (travel, exams, launches) onto an infinite zoomable timeline that shows workload density, prep windows, and constraints in a single glance. Events are richer than calendar appointments—they carry impact/risk tags, embedded notes/pitches, and optionally sync through the user’s own storage (Drive/iCloud) or our managed service. Collaboration happens inside each event via comments, voting, and shareable proposal pages, so planning a Hartford reunion or coordinating an actuarial exam prep block feels more like manipulating a visual operating system than emailing spreadsheets.

## What tech stack are you using, or planning to use, to build this product-Include AI models and AI coding tools you use.md

Current stack: React 19 + TypeScript + Vite on the frontend, Tailwind-esque utility classes, and a local-first data layer (IndexedDB for now). We integrate Google Maps/Places APIs for deterministic location search, and Gemini 1.5 via the `@google/genai` SDK for context-aware timeline queries. Source control is GitHub; deployments run through Vite→GitHub Pages today, moving to Vercel once auth/sync land. For AI-assisted coding I occasionally use GitHub Copilot and Cursor to stub UI pieces. Roadmap includes adding Replicache/ElectricSQL for sync, a Supabase (Postgres) backend for managed storage, and eventually CRDT replication so families can host their data in Google Drive/iCloud if they prefer. The UI already ships through an i18n scaffold (English, Spanish, French, German, Portuguese) so we can localize into additional markets by dropping new translation bundles.

## Where do you live now, and where would the company be based after YC.md

Monroe, NJ, USA / Monroe, NJ, USA (remote-friendly but legally based in NJ).

## Which category best applies to your company.md

Productivity / Collaboration (B2C → Prosumer → Teams).

## Who are your competitors.md

Closest comparisons are Notion (databases + templates), Motion/Sunsama (calendar+task blends), ClickUp/Asana (project management), and horizontal calendars like Cron or Apple/Google Calendar. None treat the timeline as a first-class operating system: they either silo projects from calendars or force users into kanban/list paradigms. WhoWhe2Wha’s differentiator is the living timeline with zoomable context, rich event semantics (prep windows, proposals, travel), and the ability to self-host data (Drive/iCloud) or use our managed sync. It feels more like Lightroom for your life/work plan than another calendar.

## Who writes code, or does other technical work on your product.md

I (Alex Sudakov) am the sole founder and primary engineer. I write the architecture, UX, and production code myself, using AI collaborators—Codex CLI, Claude CLI, and Google’s Gemini 2.5 Pro—as accelerators for boilerplate, refactors, and brainstorming. Aside from open-source libraries and those AI tools, no non-founders have contributed code.

## Why did you pick this idea to work on.md

For 20+ years I’ve built actuarial workflow software inside reinsurance companies while juggling family life, tennis leagues, and professional exams. Enterprise tools handle one layer at a time (project plans, calendars, CRMs), but they never reconcile prep work, travel, and social commitments into a single picture. I’ve watched underwriters, actuaries, and even tennis captains drown in spreadsheets trying to coordinate “who/where/when,” so I built the tool I’ve wanted for years: a living timeline that fuses structured data with templates and collaboration. Early conversations with coworkers and community organizers surfaced the same pain—people spend more time reconciling tools than moving work forward.

## Demo & Video Scripts

### demo-script.md

Demo Video Script (2 minutes)
---------------------------------

1. Intro (10s)
   - “Hi, this is Alex showing WhoWhe2Wha—the living timeline for life + work.”

2. Timeline + Zoom (30s)
   - Start on timeline view.
   - Pan left/right, use mouse wheel to zoom in/out.
   - Call out the today marker and smooth zoom keeping context.

3. Projects/Tiers (20s)
   - Point to categories/tiers on left sidebar.
   - Show a Period bar to highlight how multi-day work blocks look.

4. Location Finder (25s)
   - Open Add Location modal.
   - Type “Concordia Clubhouse” (or similar) using Google Places autocomplete.
   - Show the map preview and manual entry fields.

5. Language Switch (15s)
   - Open Settings → change language (e.g., English → Español → Français) to show i18n.

6. Outro (10s)
   - “That’s WhoWhe2Wha—timeline-first planning with rich event types and global-ready UI. Thanks!”

Recording tips:
- Use iMac screen recorder (QuickTime: File → New Screen Recording) at 1080p.
- Narrate live with headset mic.
- Keep total length <3 minutes / 100 MB.

### founder-video-script.md

Founder Video Script (60 seconds)
---------------------------------

Hi, I’m Alex Sudakov, founder of WhoWhe2Wha.
I’ve spent 20+ years building workflow software inside reinsurance companies while juggling family logistics, tennis leagues, and actuarial exams.
Traditional tools silo everything—calendars, kanban boards, spreadsheets—so one life event like a Hartford reunion means juggling travel, prep, and social threads across five apps.
WhoWhe2Wha is a living timeline that unifies projects, prep work, travel, and collaboration. You drag templates—travel, exam prep, product launches—onto a zoomable rail and instantly see workload density, prep windows, conversations, even location suggestions in one place.
I started this build on November 3rd. AI collaborators like Grok, Gemini, Codex CLI, and Claude let me ship a polished timeline, templates, and Google Places integration in a week. YC is where I want to pressure-test distribution and build the managed sync layer beyond the current GitHub Pages demo.
Thanks for your time—I’d love to show you WhoWhe2Wha live.
