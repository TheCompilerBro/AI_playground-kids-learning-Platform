# Design System — AI Playground

**Purpose:** Visual and interaction design specification for the React website.  
**Audience:** Product designer, frontend developer, and AI coding agent.

---

## 1. Design Direction

Create a warm, playful, modern learning environment that feels like a creative science playground—not a babyish toy and not a dense school portal.

The experience should feel:
- Friendly and reassuring for children aged 5–10.
- Clear and trustworthy for parents.
- Colorful but controlled.
- Visual-first, with one main task per screen.
- Encouraging, with mistakes framed as part of learning.

Use original illustrations, simple geometric shapes, rounded cards, expressive but restrained icons, and subtle motion. Avoid overusing gradients, glassmorphism, excessive shadows, or emoji as the only icon system.

## 2. Brand Personality

- Curious
- Encouraging
- Creative
- Safe
- Honest about AI limitations

Suggested tagline: **“Big ideas. Little experiments.”**

Suggested supporting copy: **“Discover how AI learns—one fun experiment at a time.”**

The working name is AI Playground. Keep the name and logo easy to replace later.

---

## 3. Color Tokens

Use CSS variables/design tokens rather than scattering raw values through components.

| Token | Hex | Usage |
|---|---|---|
| `--color-ink` | `#17233C` | Main text and headings |
| `--color-muted` | `#64748B` | Secondary text |
| `--color-background` | `#FFFDF8` | Main page background |
| `--color-surface` | `#FFFFFF` | Cards and panels |
| `--color-primary` | `#6558E8` | Primary actions and brand |
| `--color-primary-hover` | `#5145CF` | Hover/focus treatment |
| `--color-sky` | `#DDF3FF` | Informational surfaces |
| `--color-mint` | `#DDF7E8` | Success and activity surfaces |
| `--color-yellow` | `#FFE9A8` | Highlights and rewards |
| `--color-coral` | `#FFB7A8` | Warm accents |
| `--color-border` | `#E8E8F0` | Borders and dividers |
| `--color-danger` | `#B42318` | Error text and destructive actions |

Guidelines:
- Primary purple is for actions and selected states, not every surface.
- Pastel colors are backgrounds for small content areas.
- Ensure text contrast meets WCAG AA where applicable.
- Never communicate status using color alone; include text or an icon.

---

## 4. Typography

Recommended fonts:
- **Headings:** Nunito Sans or Nunito, with a rounded friendly feel.
- **Body/UI:** Inter or a system sans-serif stack.

Type scale:
- Hero heading: `clamp(2.5rem, 5vw, 4.5rem)`, bold, compact line-height.
- Page heading: `2rem–2.5rem`.
- Section heading: `1.25rem–1.5rem`.
- Card title: `1.05rem–1.25rem`, semibold.
- Body: `1rem–1.125rem`, line-height around `1.6`.
- Helper text: minimum `0.875rem`; do not make key child instructions tiny.

Keep paragraphs short. For ages 5–6, use one sentence per instruction where possible.

---

## 5. Layout and Spacing

- Use a centered content container, maximum width around `1200px`.
- Desktop page gutters: `32–48px`; tablet: `24px`; mobile: `16–20px`.
- Use a spacing scale based on 4px or 8px increments.
- Card radius: `20–24px`.
- Button radius: `14–16px` or fully pill-shaped for primary child actions.
- Input radius: `12–14px`.
- Card border: `1px solid var(--color-border)`.
- Use soft shadows sparingly; borders should carry most of the structure.
- Desktop grids: 2–3 columns depending on card content.
- Mobile: single column; avoid horizontal overflow.

---

## 6. Iconography and Illustration

- Use Lucide icons or a consistent equivalent.
- Use original/simple illustrations for the robot guide, learning bands, and activity cards.
- A friendly robot may be a mascot, but do not imply it is a real person or has feelings.
- Use icons with visible text labels for important actions.
- Avoid random icon styles mixed together.
- If remote images are unavailable, use local SVG/CSS illustrations or accessible placeholders rather than broken image URLs.

---

## 7. Navigation

### Desktop
- Top navigation with logo, “Explore”, “AI Lab”, “How it works”, and a prominent “Start learning” action.
- Keep parent-related navigation visually separate and clearly labeled.
- Header can be sticky only if it does not reduce useful screen space.

### Mobile
- Compact header with logo and a simple menu.
- Main CTA should remain easy to reach.
- Use large touch targets, ideally around 44×44 CSS pixels or larger.
- Avoid dense dropdowns and multi-level navigation.

---

## 8. Page Designs

### 8.1 Landing page `/`
**Purpose:** Explain the product quickly and guide users into the first activity.

Sections:
1. Header/navigation.
2. Hero: short headline, concise supporting text, primary CTA, secondary CTA, friendly visual of a robot exploring patterns.
3. Three-step explainer: Explore → Experiment → Create.
4. Learning-band cards: AI Explorer (5–6), AI Detective (7–8), AI Creator (9–10).
5. Featured activity cards.
6. “What children will learn” section.
7. Safety and parent-trust section.
8. Final CTA.
9. Footer with About, Safety, Privacy, and Parent information.

Do not add invented user counts, awards, testimonials, or claims of proven learning outcomes.

### 8.2 Learning-band selection `/learn`
- Welcome message.
- Three large selectable cards, each with age range, illustration, and short description.
- Selection state must be obvious and accessible.
- CTA: “Continue”.
- Include a short privacy note: no full name is needed to try the demo.

### 8.3 Child dashboard `/dashboard`
- Friendly greeting without requiring a real name.
- One featured “Continue learning” card.
- Progress summary with accessible labels.
- “Your learning path” section.
- Badge collection.
- Recommended activity based on local progress.
- Avoid charts that require complex interpretation for young children.

### 8.4 Lesson library `/lessons`
- Filter by learning band and concept.
- Card fields: illustration/icon, title, short description, estimated duration, completion status.
- Provide a clear empty state if filters return no lessons.
- Use a consistent card height where practical.

### 8.5 Lesson player `/lessons/:lessonId`
- Progress indicator (e.g. “Step 2 of 4”).
- One instruction or concept per panel.
- Large interaction area.
- Primary CTA at the bottom: “Next”, “Check answer”, or “Finish”.
- Secondary “Back” or “Try again”.
- Feedback panel for correct/incorrect responses.
- Do not use red as the only signal of an incorrect answer.
- Avoid time pressure and punitive countdowns.

### 8.6 AI Lab `/lab`
- Title: “Train a tiny AI”.
- Explain the goal in a single short paragraph.
- Use three stages: Choose examples → Train → Test.
- Use bundled sample images/cards.
- Clearly label training examples and test examples.
- Show the prediction and a child-friendly explanation.
- Include a “Why might it be wrong?” prompt.
- If using simulated predictions, disclose that this is a demonstration, not a trained model.

### 8.7 Progress `/progress`
- Display completed lessons, concepts explored, and badges.
- Show improvement as personal progress, never a public ranking.
- Use plain-language summaries.
- Make “start another activity” the primary next action.

### 8.8 Parent area `/parent`
- Visually calmer than the child area while retaining brand colors.
- Show progress, settings, data explanation, and safety controls.
- Explain any prototype limitations.
- Do not rely on a client-side PIN as secure production authentication.
- Parent settings should be accessible and clearly labeled.

### 8.9 Safety page `/safety`
- Explain what AI can and cannot do.
- Encourage children to ask a trusted adult about important or confusing answers.
- Explain what information is stored.
- Explain that the product does not guarantee every AI output is correct.
- Include contact/reporting information only when real details are configured.

---

## 9. Components

Build reusable components with consistent props and states:

- `SiteHeader`
- `SiteFooter`
- `PrimaryButton`, `SecondaryButton`
- `LearningBandCard`
- `ActivityCard`
- `ProgressBar`
- `BadgeCard`
- `LessonStep`
- `MultipleChoiceQuestion`
- `FeedbackPanel`
- `IllustrationPlaceholder`
- `ParentGate`
- `EmptyState`
- `LoadingState`
- `ErrorState`
- `SafetyNotice`
- `Modal` or accessible dialog when needed

Each interactive component must support keyboard navigation, visible focus, disabled states, and clear labels.

---

## 10. Interaction and Motion

- Use brief transitions (roughly 150–250ms) for hover, selection, and panel changes.
- Use subtle completion celebrations; do not block the next action.
- Respect `prefers-reduced-motion`.
- Avoid parallax, flashing, constant floating animations, or motion that distracts from instructions.
- Buttons must have hover, focus-visible, active, and disabled states.
- Provide immediate feedback after answers.
- Ensure state changes are also announced to assistive technology where appropriate.

---

## 11. Responsive Behavior

### Mobile (320–767px)
- Single-column content.
- Stack hero text and illustration.
- Use full-width primary buttons when useful.
- Keep lesson controls near the bottom but never obscure content.
- No hover-only information.

### Tablet (768–1023px)
- Two-column layouts where space allows.
- Keep card copy short and controls large.

### Desktop (1024px+)
- Use a centered max-width layout.
- Hero may use text/illustration columns.
- Activity cards can use two or three columns.

Test at 320px, 375px, 768px, 1024px, and 1440px.

---

## 12. Accessibility

- Semantic HTML and logical heading hierarchy.
- Keyboard-operable controls.
- Visible focus states.
- Proper form labels and accessible names.
- WCAG AA color contrast where applicable.
- Alternative text for meaningful images; empty alt for decorative images.
- Do not rely on color alone.
- Support reduced motion.
- Use captions or transcripts for instructional audio/video.
- Ensure quizzes can be completed without drag-and-drop only; provide click/tap alternatives.

---

## 13. Content and Microcopy

Voice: warm, clear, short, respectful, and honest.

Good examples:
- “Let’s try an experiment!”
- “Great thinking. Want to test another example?”
- “This time, the AI guessed incorrectly. What could help it learn?”
- “AI can make mistakes. Let’s check the result together.”

Avoid:
- “The AI knows everything.”
- “You failed.”
- “This AI is always right.”
- Overly technical definitions without an example.

---

## 14. Design Acceptance Checklist

- [ ] Looks coherent at mobile, tablet, and desktop sizes.
- [ ] Uses design tokens and reusable components.
- [ ] Primary CTA is obvious on every main page.
- [ ] No dead or decorative controls.
- [ ] Focus states are visible.
- [ ] Text remains readable over colored surfaces.
- [ ] Empty, error, loading, and completion states are designed.
- [ ] Reduced-motion preference is respected.
- [ ] Lesson UI minimizes reading for the youngest age band.
- [ ] AI Lab discloses simulation vs real model behavior.
- [ ] Parent and safety information is easy to find.
- [ ] No fake claims, testimonials, or metrics.
