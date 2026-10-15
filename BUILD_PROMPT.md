# Complete Website-Build Prompt — AI Playground (React)

Copy the prompt below into your AI coding tool (for example, your preferred coding agent) to build the first version of the website.

---

You are a senior product designer, React/TypeScript engineer, accessibility specialist, and educational UX designer. Build a polished, responsive, functional website called **AI Playground**, a playful and safe AI-learning platform for children aged 5–10.

Read and follow the accompanying `PRD.md` and `design.md` as the product and design source of truth. If they are unavailable in the coding environment, use the requirements in this prompt.

## Product goal

Teach children how artificial intelligence works through short lessons, games, guided experiments, and a simple AI Lab. The MVP includes both an age-appropriate learning companion experience and hands-on machine-learning concepts. It is not an unrestricted chatbot and must not claim that AI is always correct.

## Required technology

- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Framer Motion or restrained CSS transitions
- Lucide React icons
- Use local, typed sample data for the first version
- Do not require paid API keys to run the basic website
- Keep AI and database integrations behind modular service interfaces so they can be added later

If you need to choose package versions, choose compatible stable versions. Provide all necessary setup/configuration files.

## Design requirements

Create a warm, modern, colorful educational product—not a generic SaaS dashboard and not a babyish cartoon site.

Design tokens:
- Ink: #17233C
- Muted text: #64748B
- Background: #FFFDF8
- Surface: #FFFFFF
- Primary: #6558E8
- Primary hover: #5145CF
- Sky: #DDF3FF
- Mint: #DDF7E8
- Yellow: #FFE9A8
- Coral: #FFB7A8
- Border: #E8E8F0
- Danger: #B42318

Use rounded cards (20–24px), friendly typography, ample whitespace, large touch targets, subtle borders, restrained shadows, and consistent Lucide icons. Use CSS variables or a central token file. Do not rely on emoji as the only iconography. Use local CSS/SVG illustrations or tasteful placeholders; do not create broken remote image dependencies.

The site must work at 320px, 375px, 768px, 1024px, and 1440px. Use mobile-first responsive layouts. Respect `prefers-reduced-motion`, support keyboard navigation, show visible focus states, and keep contrast accessible.

## Pages and routes

Implement these routes:
1. `/` — landing page
2. `/learn` — choose learning band
3. `/dashboard` — child dashboard
4. `/lessons` — lesson library
5. `/lessons/:lessonId` — lesson player
6. `/lab` — AI Lab
7. `/progress` — progress and badges
8. `/parent` — parent area/settings prototype
9. `/safety` — child safety and AI limitations
10. `*` — friendly not-found page

Create a shared header, footer, reusable page container, and consistent navigation. The primary CTA should lead to `/learn` or the next relevant step. Make navigation functional; do not leave dead links or buttons.

## Landing page content

Hero headline: **“Big ideas. Little experiments.”**

Supporting copy: “Discover how AI learns—one fun experiment at a time.”

Primary CTA: “Start learning”  
Secondary CTA: “Explore activities”

Include:
- Hero illustration of a friendly robot exploring patterns, built locally with CSS/SVG or a placeholder component.
- Three-step section: Explore → Experiment → Create.
- Three learning-band cards:
  - AI Explorer, ages 5–6
  - AI Detective, ages 7–8
  - AI Creator, ages 9–10
- Featured activities.
- Learning outcomes.
- Safety/parent-trust section.
- Footer with links to Safety, Parent information, and Privacy.
Do not invent testimonials, user counts, awards, or educational efficacy statistics.

## Onboarding

On `/learn`, show three selectable learning-band cards:
- Explorer (5–6): colors, shapes, sorting, patterns.
- Detective (7–8): data, examples, classification, predictions.
- Creator (9–10): training/testing, model limitations, visual coding concepts.

Store the selected band in local state and, for the prototype, persist non-sensitive preferences/progress to localStorage behind a small storage utility. Do not ask for full name, exact birth date, school, address, phone, email, photos, or location. Let the child continue without a nickname.

## Child dashboard

Create a welcoming dashboard with:
- Friendly greeting that does not require a real name.
- Continue-learning card.
- Learning path and recommended next lesson.
- Progress bar and earned badges.
- Quick links to Lessons, AI Lab, and Progress.
- Short labels and clear hierarchy.
Use seeded progress data for a new learner and reflect actual completed activities after interaction.

## Lesson library and player

Provide at least five fully working starter lessons:
1. What Is AI?
2. Teach a Robot
3. Pattern Detective
4. Train Your First AI
5. AI Can Make Mistakes

Each lesson object should include:
- id, title, summary, learning band, duration, objective, steps, question(s), correct answer, explanation, and badge/reward.
- Lesson cards show duration and completion state.
- The lesson player has a step indicator, short instructions, one main activity at a time, back/next controls, a knowledge check, clear answer feedback, retry behavior, and a completion state.
- Questions must be interactive, not static mockups.
- Update progress and badge state when a lesson is completed.
- Give encouraging feedback for wrong answers and let the learner try again.
- Avoid timers and punitive language.
- Adapt copy and reading complexity to the selected learning band where practical.

## AI Lab

Build a functional guided image-classification activity with three stages:
1. Choose examples
2. Train
3. Test

For the MVP, use curated bundled example cards and deterministic demo predictions if a real model is not integrated. If predictions are simulated, clearly label the experience as a demonstration—not a trained model. Do not falsely claim to have trained a real ML model.

Show:
- Two categories such as “Fruit” and “Not fruit” or “Cat” and “Dog”.
- Example cards that the learner can select and label.
- A training action with a brief progress/transition state.
- A test example and the demo model’s prediction.
- An explanation that models learn patterns from examples and can make mistakes.
- A reflection prompt: “Why might the AI guess incorrectly?”
- A retry/reset action.

Keep the classifier logic isolated in a module so it can later be replaced with TensorFlow.js. Do not require uploads of a child’s personal images.

## Quiz, progress, and rewards

- Use local typed state and a storage abstraction.
- Track completed lesson IDs, scores, and earned badges.
- Use stars/badges as positive reinforcement.
- No public leaderboards or social sharing.
- Include empty states and a reset/demo progress option with confirmation.
- Progress should update immediately when the user completes a lesson.

## Parent area and safety

Build a parent area that demonstrates:
- Learning band selection.
- Learning progress summary.
- Toggle for enabling/disabling the optional AI assistant (the UI may be a prototype setting).
- Plain-language data and safety information.
- Clear notice that prototype settings are local and are not secure production authentication.

Safety requirements:
- Use curated lesson content by default.
- Do not include unrestricted AI chat in this MVP.
- Do not ask children to submit personal information.
- Add a visible reminder that AI can make mistakes and important answers should be checked with a parent/teacher.
- Never place provider API keys in frontend code.
- If an AI API is added later, call it through a backend endpoint with server-side secrets, age-appropriate prompts, output moderation, rate limits, and minimal context.
- Avoid storing raw child chat, photos, voice, or sensitive profile data.
- Do not claim the product is perfectly safe or compliant by default.

## Architecture and code quality

Use a clean structure similar to:

src/
  app/
    App.tsx
    router.tsx
  components/
    layout/
    ui/
    learning/
    lesson/
    lab/
    progress/
  pages/
  data/
    lessons.ts
    badges.ts
  hooks/
  services/
    storage.ts
    progressService.ts
    classifierDemo.ts
  types/
  styles/
  main.tsx

Adjust this structure if needed, but keep components modular and readable.

Requirements:
- Strict TypeScript types for lessons, questions, progress, badges, and learning bands.
- Avoid one giant component.
- Use reusable buttons, cards, progress bars, badges, feedback panels, and empty/error states.
- Add a README with prerequisites, installation, development command, build command, test command, architecture overview, and current limitations.
- Add `.env.example` only if environment variables are required; never add secrets.
- Add tests for lesson completion, quiz feedback, progress persistence, and AI Lab flow where practical.
- Use semantic HTML and accessible form labels.
- Handle invalid route IDs and empty data gracefully.
- Do not suppress TypeScript errors or use `any` as a shortcut.
- No dead controls, broken links, placeholder lorem ipsum, or buttons that only look functional.
- Do not over-engineer the MVP with a database or login system before the core learning flow works.

## Completion criteria

The implementation is complete only when:
1. The project installs and starts with documented commands.
2. All listed routes render correctly.
3. Landing-page CTAs navigate correctly.
4. A child can select a learning band and reach the dashboard.
5. The five lessons are available and their activities/quizzes work.
6. Completion and badges update the dashboard and progress page.
7. The AI Lab supports the full choose/train/test flow and honestly labels simulated behavior.
8. Parent and Safety pages are accessible.
9. Responsive layouts work without horizontal overflow.
10. Loading, empty, error, selected, disabled, and completion states are implemented where relevant.
11. No API secret is exposed in frontend code.
12. A README and practical tests are included.

## Working method

1. Inspect the existing repository before changing files.
2. If it is empty, scaffold the project.
3. Implement the design system and shared layout first.
4. Build routes and typed sample data.
5. Implement onboarding, lessons, quizzes, progress, and the AI Lab.
6. Add parent/safety content and responsive/accessibility polish.
7. Run the available type-check, tests, and production build.
8. Fix errors rather than merely reporting them.
9. Finish with a concise summary of what works, exact commands to run it, and any remaining limitations.

Prioritize a coherent, usable, functioning MVP over adding many unfinished features.
