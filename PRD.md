# Product Requirements Document (PRD)
## AI Playground — AI Learning Platform for Children Aged 5–10

**Document status:** MVP specification  
**Version:** 1.0  
**Date:** 10 October 2026  
**Product type:** Web-first educational platform  
**Working product name:** AI Playground

---

## 1. Product Summary

AI Playground is a child-friendly, browser-based learning platform that introduces children aged 5–10 to artificial intelligence through stories, games, guided experiments, and simple machine-learning projects. It combines an age-adaptive AI learning companion with a hands-on AI laboratory.

The product should help children understand what AI is, how models learn from examples, why predictions can be wrong, and how to use AI responsibly. It should prioritize learning-by-doing rather than long explanations or unrestricted chatbot conversations.

### Product vision
Make AI understandable and creative for every child by turning abstract concepts into safe, playful, hands-on experiences.

### Product positioning
A guided AI-learning playground—not a general-purpose chatbot and not a replacement for teachers or parents.

---

## 2. Problem Statement

AI is becoming part of everyday life, but children often encounter it as a mysterious tool that gives answers. Many learning resources are too technical, text-heavy, or designed for older students. Young learners need concrete activities, simple explanations, age-appropriate feedback, and opportunities to experiment.

AI Playground addresses this gap with short lessons, visual games, controlled experiments, and progress feedback.

---

## 3. Goals and Non-Goals

### Goals
1. Explain foundational AI concepts using age-appropriate language and visuals.
2. Teach through interactive activities, not only reading or watching.
3. Let children experiment with a simple classification model.
4. Adjust explanations and activity difficulty to broad age bands.
5. Reinforce concepts with short quizzes, stars, badges, and progress indicators.
6. Give parents/guardians a simple view of learning progress and safety settings.
7. Build a responsive React website that can later support additional languages and mobile experiences.
8. Minimize collection of children’s personal information.

### Non-goals for the MVP
- Training a large language model from scratch.
- An unrestricted open-ended chatbot.
- Public child profiles, messaging, social feeds, or leaderboards.
- Collecting precise location, advertising identifiers, or unnecessary personal data.
- Claiming AI predictions are always correct.
- Replacing a school curriculum or professional educator.
- A native iOS/Android app in the first release.
- Uploading or storing children’s photos or voice recordings by default.

---

## 4. Target Users

### Primary users
Children aged 5–10, grouped into three learning bands:

- **AI Explorer (5–6):** visual recognition, sorting, matching, simple cause and effect; minimal reading.
- **AI Detective (7–8):** patterns, labeled examples, classification, testing predictions, basic data concepts.
- **AI Creator (9–10):** training/testing concepts, model limitations, simple visual-block projects, fairness and responsible use.

Age bands are starting points. Activities should remain accessible and allow an adult to choose a suitable level.

### Secondary users
- Parents/guardians who configure access and review progress.
- Teachers or facilitators who may guide activities in a classroom in a later phase.

---

## 5. Core User Stories

### Child
- As a child, I want a friendly guide to explain AI in simple words.
- As a child, I want to learn by playing short games.
- As a child, I want to give examples to a model and see what it predicts.
- As a child, I want encouraging feedback when I make a mistake.
- As a child, I want to earn badges and see what I have learned.
- As a child, I want to be able to use large buttons and visual instructions.

### Parent/guardian
- As a parent, I want to choose the child’s learning band.
- As a parent, I want to see lessons completed and quiz progress.
- As a parent, I want clear controls for AI features and data collection.
- As a parent, I want to understand what information is saved and why.

---

## 6. MVP Scope and Features

### P0 — required for first usable release

#### 6.1 Landing page
- Clear headline describing AI learning through play.
- Primary CTA: “Start Learning”.
- Secondary CTA: “Explore Activities”.
- Show age bands, sample activities, learning outcomes, and safety commitments.
- Responsive layout for laptop, tablet, and mobile browsers.
- No fake testimonials, fake usage statistics, or unsupported claims.

#### 6.2 Child onboarding
- Let the user choose a learning band: 5–6, 7–8, or 9–10.
- Use a friendly avatar selection only if it does not require personal photos.
- Ask for a nickname only if necessary; provide a skip option.
- Do not ask children for full name, birth date, address, school, phone number, or email.
- Include a parent/guardian gate before settings or external links.

#### 6.3 Child learning dashboard
- Show the child’s current learning band.
- Show a “Continue learning” card.
- Show lesson progress, earned badges, and recommended next activity.
- Use clear visual hierarchy and limited information per screen.
- Avoid competitive public rankings.

#### 6.4 Guided lessons
Include at least these five starter lessons:
1. **What Is AI?** — AI is technology that finds patterns or performs tasks using examples and rules.
2. **Teach a Robot** — sort and label example objects.
3. **Pattern Detective** — find repeated patterns and make predictions.
4. **Train Your First AI** — learn the idea of examples, labels, training, and testing.
5. **AI Can Make Mistakes** — test a model and discuss why it can be wrong.

Each lesson should include:
- Learning objective.
- Short story or explanation.
- One interactive activity.
- One to three knowledge-check questions.
- Feedback for correct and incorrect answers.
- Completion state and a small reward.
- A “Try again” option.
- An optional parent/teacher explanation.

#### 6.5 AI Lab: image classification demo
- Start with bundled, curated sample images; do not require child uploads.
- Let the child select labeled examples (e.g., cats vs dogs, fruit vs not fruit, recyclable vs non-recyclable).
- Provide a simulated training step or a real in-browser classifier if technically ready.
- Let the child test an unseen sample and see the model’s prediction.
- Explain that more varied, accurate examples can improve results but do not guarantee correctness.
- Show confidence carefully as an estimate, not as certainty.
- If real model training is unavailable, label the experience honestly as a guided simulation.

#### 6.6 Quiz and reward system
- Short, low-pressure quizzes.
- Stars or badges for participation and mastery.
- Encouraging feedback, not punishment.
- Store only progress data needed for the experience.
- Allow replay without penalty.

#### 6.7 Parent area
- Protected by a simple parent gate appropriate for the prototype.
- Show learning band, completed lessons, quiz performance, and badges.
- Include clear controls for disabling AI-generated responses.
- Explain saved data, deletion options, and limitations.
- Do not represent a simple client-side gate as production-grade authentication.

#### 6.8 Safety and content boundaries
- Prefer curated lesson content for the first release.
- If an LLM is integrated, send only the minimum context required.
- Use a server-side API; never expose provider API keys in the browser.
- Apply age-appropriate system instructions, output filtering, topic boundaries, and rate limits.
- Avoid collecting personal information in chat.
- Do not invite children to share secrets, contact details, photos, or location.
- Provide a clear “Ask a parent or teacher” fallback.
- Provide reporting/feedback access for the parent.
- Do not claim a filter makes the system perfectly safe.

### P1 — after validating the MVP
- Text-to-speech and optional speech input, only after privacy and consent review.
- English/Bengali localization and additional languages.
- Teacher/classroom mode.
- More classification datasets and visual coding activities.
- Offline-friendly lesson caching.
- Adaptive recommendations based on lesson performance.
- Exportable parent progress report.

### P2 — later
- A dedicated mobile app.
- More advanced model-building projects.
- Teacher assignment and classroom management.
- Fine-tuned or specialized model only if product evaluation demonstrates a clear need.

---

## 7. Learning Design

### Principles
- One new concept at a time.
- Concrete examples before abstract terms.
- Short sessions, ideally 3–8 minutes per activity.
- Large tap targets, audio/visual support, and minimal reading for ages 5–6.
- Encourage curiosity and experimentation.
- Treat mistakes as useful feedback.
- Explain uncertainty and model limitations.
- Avoid anthropomorphizing the AI as a person with feelings or intentions.

### Example learning outcomes
By the end of the first set of lessons, a child should be able to:
- Describe AI as a kind of technology.
- Explain that examples can help a model find patterns.
- Identify training examples and test examples in a simple activity.
- Give one reason an AI prediction may be wrong.
- Explain that people should check important AI answers.

---

## 8. UX and Accessibility Requirements

- Responsive from 320px mobile width through desktop.
- Large buttons and readable text.
- Keyboard navigation and visible focus states.
- Semantic headings, labels, and form controls.
- Strong color contrast; do not use color alone to communicate success/error.
- Reduced-motion support.
- Avoid flashing animations and distracting effects.
- Clear loading, empty, error, and completion states.
- Friendly illustrations and icons, but never sacrifice usability.
- Support screen readers for essential instructions.
- Keep each screen focused on one primary task.

---

## 9. Technical Architecture

### Recommended MVP stack
- **Frontend:** React + Vite + TypeScript.
- **Styling:** Tailwind CSS; reusable accessible components.
- **Motion:** Framer Motion or CSS transitions, respecting reduced-motion settings.
- **Routing:** React Router.
- **Charts/progress:** simple CSS/SVG or a lightweight chart library only if needed.
- **Backend:** Python + FastAPI when persistent APIs or model inference are introduced.
- **ML demo:** TensorFlow.js in the browser or a clearly labeled guided simulation.
- **Database:** Firebase or PostgreSQL; choose one based on authentication and hosting needs.
- **Testing:** Vitest + React Testing Library; Playwright for core user flows.
- **Deployment:** static frontend hosting and managed backend hosting.

### Architecture principles
- Build the initial UI with local sample data so it works without credentials.
- Keep AI-provider calls behind a backend endpoint.
- Separate lesson content from UI components.
- Use typed data models for lessons, questions, progress, and badges.
- Add environment variable examples without real secrets.
- Include error handling and loading states.
- Keep the model demo modular so it can be replaced without rewriting the learning UI.

### Suggested core entities
- `LearningBand`: `explorer | detective | creator`
- `Lesson`: `id`, `title`, `summary`, `learningBand`, `durationMinutes`, `objectives`, `steps`, `questions`, `badgeId`
- `Question`: `id`, `prompt`, `options`, `correctOptionId`, `explanation`
- `LessonProgress`: `lessonId`, `status`, `score`, `completedAt`
- `Badge`: `id`, `name`, `description`, `icon`
- `ParentSettings`: `aiAssistantEnabled`, `selectedLearningBand`, `dataPreferences`

Do not put sensitive child information in analytics or logs.

---

## 10. Information Architecture

1. `/` — landing page
2. `/learn` — choose learning band / onboarding
3. `/dashboard` — child learning dashboard
4. `/lessons` — lesson library
5. `/lessons/:lessonId` — lesson experience
6. `/lab` — AI Lab
7. `/progress` — child progress and badges
8. `/parent` — parent area and settings
9. `/safety` — privacy and AI safety explanation
10. `*` — helpful not-found page

For a prototype, routes may use local state and seeded data. Clearly document that real accounts, server-side parent authentication, and persistence are not production-ready until implemented.

---

## 11. Success Metrics

Measure learning and usability, not screen time.

### MVP usability metrics
- Percentage of test users who can start a lesson without assistance.
- Lesson completion rate.
- Correct answers before and after a lesson.
- Percentage who can explain one new concept in their own words.
- Task success for the AI Lab.
- Parent/teacher usability feedback.
- Accessibility issues found and resolved.
- Number and type of safety incidents or inappropriate outputs during controlled testing.

Set numeric targets only after baseline testing with a small, consented pilot group.

---

## 12. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| AI gives inaccurate or unsuitable answers | Curated content first, server-side model calls, filters, rate limits, parent controls, ongoing tests |
| Product is too text-heavy for younger children | Visual-first design, short narration, large controls, minimal reading |
| Child data is collected unnecessarily | Data minimization, no public profiles, deletion path, parent-managed access |
| Model demo feels fake | State clearly whether it is a simulation or a real classifier |
| Scope grows too quickly | Ship five lessons and one lab activity before adding more |
| External AI service is costly or unavailable | Local sample content and deterministic fallback |
| UI looks attractive but is hard to use | Test with children under adult supervision and accessibility checks |

---

## 13. Acceptance Criteria

The MVP is acceptable when:
- A visitor can understand the product and begin learning from the landing page.
- A child can choose a learning band without submitting personal details.
- The dashboard displays a coherent next activity and progress state.
- At least five lessons are navigable and each has an activity and knowledge check.
- The AI Lab demonstrates examples, training/testing concepts, and prediction limitations.
- Quizzes provide clear feedback and can be retried.
- Parent area exposes progress and AI-related settings.
- The website works on mobile, tablet, and desktop layouts.
- Core controls work; there are no decorative buttons pretending to be functional.
- Loading, error, empty, and completion states exist.
- No secret API key is bundled in frontend code.
- Safety and privacy copy is available.
- Automated tests cover the main lesson and quiz flows.

---

## 14. Delivery Plan

1. **Foundation:** project setup, routes, design tokens, responsive shell.
2. **Learning experience:** onboarding, dashboard, lesson library, lesson player.
3. **Interactions:** quiz engine, progress, badges.
4. **AI Lab:** sample-based classification activity and model-limit explanation.
5. **Parent and safety:** parent area, data explanations, controls.
6. **Quality:** accessibility, tests, responsive checks, error states.
7. **Pilot:** supervised usability testing and revision.

---

## 15. Open Decisions

- Final brand name and visual identity.
- Initial language(s); keep architecture localization-ready.
- Whether the first AI Lab uses TensorFlow.js or a guided simulation.
- Backend and database provider.
- Whether AI-generated tutoring is enabled in the first public release.
- Consent, retention, deletion, and parental-verification process for the intended launch jurisdictions.

These decisions should be made before production launch. The first prototype can use local data and curated lessons while keeping integration points modular.
