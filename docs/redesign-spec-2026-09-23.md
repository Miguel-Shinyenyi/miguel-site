# Amwayi Portfolio: Design Spec

Build notes for the personal site. The canvas mockups (desktop 1440 px, phone 390 px) are the visual source of truth. This file maps each section to daisyUI 5 components so the site stays interactive while it ships as static HTML from a markdown-driven static site generator.

## 1. Concept

Umwayi means shepherd. The site follows four aims:

1. Understand myself (journaling)
2. Understand current technology
3. Understand people and the world
4. Use what I learn to reach my goals

The journal is the hub. Philosophy, tech, people and projects are the spokes.

## 2. Stack

- Tailwind CSS 4 + daisyUI 5
- Static site generator that reads markdown (Astro, Eleventy or Hugo all work)
- No framework runtime needed. Most interactions below are CSS only. Two need about 20 lines of vanilla JS: the shepherd's thoughts and the email check.

Install:

```bash
npm i -D tailwindcss@latest @tailwindcss/cli@latest daisyui@latest
```

`src/app.css`:

```css
@import "tailwindcss";
@plugin "daisyui" {
  themes: pasture --default, nightwatch --prefersdark;
}
```

## 3. Themes (design tokens)

Two custom daisyUI themes. Add both to `app.css` below the plugin line.

```css
@plugin "daisyui/theme" {
  name: "pasture";
  default: true;
  color-scheme: light;
  --color-base-100: #F3EEE3;  /* page */
  --color-base-200: #FBF8F1;  /* raised sections, panels */
  --color-base-300: #E6DECD;  /* chips, tab track */
  --color-base-content: #1D2420;
  --color-primary: #9A5B1E;   /* ochre accent */
  --color-primary-content: #FBF8F1;
  --color-secondary: #3F5A3C; /* pasture green */
  --color-secondary-content: #F3EEE3;
  --color-accent: #E0A965;    /* light ochre, used on dark bands */
  --color-accent-content: #1D2420;
  --color-neutral: #1D2420;   /* dark bands, footer */
  --color-neutral-content: #F3EEE3;
  --color-success: #3F5A3C;
  --color-error: #B23A2E;
  --radius-box: 1.25rem;
  --radius-field: 999px;
  --radius-selector: 999px;
}

@plugin "daisyui/theme" {
  name: "nightwatch";
  color-scheme: dark;
  --color-base-100: #141A17;
  --color-base-200: #1B221E;
  --color-base-300: #2E3732;
  --color-base-content: #EEE8DB;
  --color-primary: #E0A965;
  --color-primary-content: #141A17;
  --color-secondary: #9CC39A;
  --color-secondary-content: #141A17;
  --color-accent: #E0A965;
  --color-accent-content: #141A17;
  --color-neutral: #0E1310;
  --color-neutral-content: #F3EEE3;
  --color-success: #9CC39A;
  --color-error: #E07A6F;
  --radius-box: 1.25rem;
  --radius-field: 999px;
  --radius-selector: 999px;
}
```

Why the dark primary changes: #9A5B1E on #141A17 fails 4.5:1 contrast. #E0A965 passes.

### Type

- Display: Fraunces (400, 600, italic 400)
- Body: Karla (400, 500, 700)

```css
@theme {
  --font-display: "Fraunces", Georgia, serif;
  --font-sans: "Karla", "Helvetica Neue", sans-serif;
}
```

| Role | Desktop | Phone | Class |
|---|---|---|---|
| H1 hero | 76px / 1.02 | 44px / 1.05 | `font-display text-[44px] md:text-[76px] leading-none tracking-tight` |
| H2 section | 52px | 34px | `font-display text-[34px] md:text-[52px]` |
| H3 card | 26 to 30px | 22 to 26px | `font-display text-2xl font-semibold` |
| Eyebrow | 14px, 700, 0.14em, caps | 13px | `text-sm font-bold uppercase tracking-[0.14em] text-primary` |
| Body | 17 to 21px | 16 to 18px | `text-lg leading-relaxed` |

### Spacing

- Page gutter: 96px desktop, 20px phone (`px-5 md:px-24`)
- Section padding: 110px desktop, 64px phone (`py-16 md:py-28`)
- Card gap: 24px desktop, 12px phone
- Touch targets: 44px minimum on every button and link

## 4. Sections and components

### 4.1 Navbar

daisyUI: `navbar`, `menu menu-horizontal`, `swap` + `theme-controller`, `dropdown` on phone.

```html
<header class="navbar border-b border-base-300 px-5 md:px-24">
  <div class="navbar-start">
    <a href="/" class="flex items-center gap-3 font-display text-2xl font-semibold">
      <!-- crook icon SVG -->
      Amwayi
    </a>
  </div>
  <div class="navbar-end gap-2">
    <ul class="menu menu-horizontal hidden md:flex text-base font-medium">
      <li><a href="#philosophy">Philosophy</a></li>
      <li><a href="#writing">Writing</a></li>
      <li><a href="#projects">Projects</a></li>
      <li><a href="#now">Now</a></li>
    </ul>

    <!-- Theme toggle, CSS only -->
    <label class="swap swap-rotate btn btn-circle btn-outline" aria-label="Toggle dark theme">
      <input type="checkbox" class="theme-controller" value="nightwatch" />
      <svg class="swap-off size-5"><!-- moon --></svg>
      <svg class="swap-on size-5"><!-- sun --></svg>
    </label>

    <!-- Phone menu -->
    <details class="dropdown dropdown-end md:hidden">
      <summary class="btn btn-circle btn-outline" aria-label="Open menu"><!-- hamburger --></summary>
      <ul class="menu dropdown-content bg-base-200 rounded-box w-[calc(100vw-2rem)] p-2 shadow-lg text-lg font-bold">
        <li><a href="#philosophy">Philosophy</a></li>
        <li><a href="#writing">Writing</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#now">Now</a></li>
      </ul>
    </details>
  </div>
</header>
```

### 4.2 Hero with the shepherd mascot

Layout: 2 columns on desktop, stacked on phone. Text left, illustration right.

Mascot: inline SVG of a shepherd leaning on his crook, hand on chin, eyes up, red shuka over a green robe, a sheep at his feet. Keep the SVG in `src/components/Shepherd.svg` and inline it so it follows the theme. The panel and hills use `fill="var(--color-base-200)"` and similar, so they switch with the theme. The shepherd and sheep keep fixed colors.

Thought bubble: a `btn`-free button styled as a bubble, positioned over the SVG. Three small circles in the SVG lead from his head to the bubble.

```html
<div class="relative w-full max-w-[600px] aspect-[600/560]">
  <!-- Shepherd SVG, absolute inset-0 -->
  <button id="thought" type="button"
    class="absolute left-[3%] top-[4%] w-[56%] rounded-[64px] border-2 border-neutral bg-white text-neutral text-left px-5 py-4 md:px-8 md:py-6"
    aria-live="polite">
    <span id="thought-text" class="font-display italic text-base md:text-2xl leading-tight">Who shepherds the shepherd?</span>
    <span class="block mt-2 text-xs md:text-sm font-bold text-[#5B615B]">Tap for another thought</span>
  </button>
</div>
```

```js
// src/scripts/thoughts.js
const thoughts = [
  "Who shepherds the shepherd?",
  "Did I learn it, or just read it?",
  "Which habit is leading me today?",
  "If I can't explain it, do I know it?",
  "Am I following the path, or making it?",
  "What did today teach me?"
];
let i = 0;
const btn = document.getElementById("thought");
const text = document.getElementById("thought-text");
btn.addEventListener("click", () => {
  i = (i + 1) % thoughts.length;
  text.textContent = thoughts[i];
});
```

Rule for new thoughts: under 8 words, ends in a question mark, one idea.

CTAs: `btn btn-neutral rounded-full` (Read the journal) and `btn btn-outline rounded-full` (See the projects). Full width on phone.

### 4.3 Four things I try to understand

daisyUI: `collapse` in a radio group, so only one pillar is open. CSS only.

Desktop shows 4 cards in a row plus an "In practice" line under them. On phone the same markup stacks. Use the radio pattern so the open card also gets the dark style.

```html
<div class="grid gap-3 md:grid-cols-4 md:gap-6">
  <div class="collapse bg-base-100 has-[:checked]:bg-neutral has-[:checked]:text-neutral-content rounded-box">
    <input type="radio" name="pillar" checked aria-label="Myself" />
    <div class="collapse-title">
      <span class="font-display text-4xl text-primary">01</span>
      <h3 class="font-display text-2xl font-semibold">Myself</h3>
      <p class="opacity-80">I journal daily. Writing shows me my habits, my choices and the reasons behind them.</p>
    </div>
    <div class="collapse-content">
      <p class="font-display text-xl">In practice: a daily entry. What I did, what I felt, what I learned.</p>
    </div>
  </div>
  <!-- 02 My tools, 03 People and the world, 04 Putting it to use -->
</div>
```

Copy for each pillar:

| # | Title | Body | In practice |
|---|---|---|---|
| 01 | Myself | I journal daily. Writing shows me my habits, my choices and the reasons behind them. | A daily entry. What I did, what I felt, what I learned. |
| 02 | My tools | I study the technology that shapes my work: backend systems, data and AI. I learn it by building it. | Build it, break it, then write down why it broke. |
| 03 | People and the world | I read history and philosophy to see why people think and act as they do. I aim to understand, not to judge. | Read one idea, then ask who it helps and who it leaves out. |
| 04 | Putting it to use | Knowledge counts when it changes what I do. I turn lessons into routines, projects and goals. | Every lesson ends with one change to tomorrow's routine. |

### 4.4 How it fits together (hub)

Dark band: `bg-neutral text-neutral-content`.

- Loop: daisyUI `steps` for Observe, Write, Connect, Apply.
- Hub explorer: daisyUI `tabs tabs-box` with radio inputs. Each tab shows one line. CSS only.
- Diagram: inline SVG. Journal circle in the center, four spokes. Highlight the node that matches the checked tab with `:has()`.

```html
<ul class="steps steps-horizontal w-full">
  <li class="step step-accent">Observe</li>
  <li class="step step-accent">Write</li>
  <li class="step step-accent">Connect</li>
  <li class="step step-accent">Apply</li>
</ul>

<div role="tablist" class="tabs tabs-box bg-transparent gap-2" id="hub">
  <input type="radio" name="hub" class="tab rounded-full" aria-label="Journal" checked />
  <div class="tab-content font-display text-xl">The source of truth. Every day starts or ends here.</div>
  <input type="radio" name="hub" class="tab rounded-full" aria-label="Philosophy" />
  <div class="tab-content font-display text-xl">Questions from the journal become articles on how to think and live.</div>
  <input type="radio" name="hub" class="tab rounded-full" aria-label="Tech" />
  <div class="tab-content font-display text-xl">Problems I hit at work become notes on systems, data and AI.</div>
  <input type="radio" name="hub" class="tab rounded-full" aria-label="People" />
  <div class="tab-content font-display text-xl">Conversations and reading become notes on how others see the world.</div>
  <input type="radio" name="hub" class="tab rounded-full" aria-label="Projects" />
  <div class="tab-content font-display text-xl">Lessons become code, routines and tools I use every day.</div>
</div>
```

```css
/* Light up the matching SVG node */
section:has(#hub input[aria-label="Tech"]:checked) #node-tech circle { fill: var(--color-accent); }
section:has(#hub input[aria-label="Tech"]:checked) #node-tech text { fill: var(--color-accent-content); }
/* repeat for journal, philosophy, people, projects */
```

### 4.5 Writing

daisyUI: `tabs tabs-box` for Philosophy, Tech, Journal. Each tab panel is a list of 3 latest posts pulled from markdown front matter by the generator.

```html
<div role="tablist" class="tabs tabs-box rounded-full w-full md:w-auto">
  <input type="radio" name="writing" class="tab rounded-full" aria-label="Philosophy" checked />
  <div class="tab-content pt-6">
    <p class="text-base-content/80 mb-4">Articles on how to think and live.</p>
    <ul class="list">
      <li class="list-row"><a href="/philosophy/slug" class="font-display text-2xl">Post title</a><span class="text-sm opacity-70">Date · Read time</span></li>
    </ul>
  </div>
  <!-- Tech: "Notes on backend systems, data and AI." -->
  <!-- Journal: "Short, edited excerpts from daily entries." Titles in italic. -->
</div>
```

Front matter the template expects:

```yaml
---
title: Why I journal
section: philosophy   # philosophy | tech | journal
date: 2026-09-23
readTime: 6 min
excerpt: One line for cards.
crossPost: [hashnode, devto, medium, linkedin]
---
```

### 4.6 Projects

daisyUI: `card`, `card-body`, `card-title`, `badge`, `card-actions`.

```html
<article class="card bg-base-100 rounded-box">
  <div class="card-body gap-4">
    <div class="flex justify-between items-center">
      <span class="badge badge-outline badge-success">Deployed to staging</span>
      <span class="text-sm opacity-70">Fintech backend</span>
    </div>
    <h3 class="card-title font-display text-3xl">Settlement engine</h3>
    <p>An idempotent settlement and reconciliation engine, with invoice financing on top. All nine phases are built and verified end to end.</p>
    <div class="flex flex-wrap gap-2">
      <span class="badge bg-base-300 border-0">Spring Boot</span>
      <!-- PostgreSQL, Kafka, FastAPI, Next.js, Kubernetes, OpenTelemetry -->
    </div>
    <div class="card-actions mt-auto">
      <a class="link link-primary font-bold" href="/projects/settlement-engine">Read the case study</a>
    </div>
  </div>
</article>
```

| Project | Badge | Label | Stack | Link |
|---|---|---|---|---|
| Settlement engine | `badge-success` Deployed to staging | Fintech backend | Spring Boot, PostgreSQL, Kafka, FastAPI, Next.js, Kubernetes, OpenTelemetry | Case study page (repo is private) |
| Routine Machine | `badge-primary` In progress | AI project | Spring Boot, FastAPI, Python | Build log |
| UMWAYI | `badge-success` Live | Knowledge system | Markdown, Git | github.com/Miguel-Shinyenyi/UMWAYI |

Grid: `grid gap-3 md:grid-cols-3 md:gap-6`.

### 4.7 Now

Plain definition list. 2 columns desktop, 1 column phone. Update monthly from a `now.md` file.

| Label | Value |
|---|---|
| Working | Backend engineer at Global Link+, a logistics ERP startup |
| Reading | Sapiens by Yuval Noah Harari |
| Building | Routine Machine and this website |
| Based in | Nairobi, Kenya |

### 4.8 Footer and subscribe

daisyUI: `footer`, `join`, `input`, `btn`, `alert`.

```html
<footer class="footer bg-neutral text-neutral-content px-5 md:px-24 py-16">
  <form id="subscribe" class="w-full max-w-md" novalidate>
    <label for="email" class="label font-bold">Email address</label>
    <div class="join w-full flex-col md:flex-row gap-2 md:gap-0">
      <input id="email" type="email" required class="input join-item w-full rounded-full text-neutral" placeholder="you@example.com" />
      <button class="btn btn-accent join-item rounded-full">Subscribe</button>
    </div>
    <div id="ok" role="status" class="alert alert-success mt-3 hidden">Thanks. You'll get the next article.</div>
    <div id="err" role="alert" class="alert alert-error mt-3 hidden">That email doesn't look right. Check it and try again.</div>
  </form>
  <nav class="flex flex-wrap gap-6 font-bold">
    <a class="link link-accent" href="#">Hashnode</a>
    <a class="link link-accent" href="https://github.com/Miguel-Shinyenyi">GitHub</a>
    <a class="link link-accent" href="#">LinkedIn</a>
    <a class="link link-accent" href="#">dev.to</a>
    <a class="link link-accent" href="#">Medium</a>
  </nav>
</footer>
```

```js
// src/scripts/subscribe.js
const form = document.getElementById("subscribe");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const ok = form.email.checkValidity();
  document.getElementById("ok").classList.toggle("hidden", !ok);
  document.getElementById("err").classList.toggle("hidden", ok);
  // When ok, post to your newsletter provider's form endpoint.
});
```

### 4.9 Article page

One template for every article. Desktop: table of contents on the left (3 of 12 columns), body on the right (7 columns). Phone: the contents list folds into a toggle above the body.

Illustration style: bold 3px black outlines, flat fills, cream panels and a hard offset shadow (`shadow-[6px_6px_0_#1D2420]`). Each article gets one scene with the shepherd or his sheep. The sample shows a gate: one sheep tagged #42 has settled, a second #42 asks "Me again?" and the shepherd holds up his hand.

| Part | daisyUI |
|---|---|
| Breadcrumb | `breadcrumbs` |
| Tags | `badge` |
| Contents (desktop) | `menu` with `menu-active` on the current item |
| Contents (phone) | `collapse collapse-arrow` |
| Text size | `join` of three `btn btn-sm` (15, 17, 19 px phone; 17, 19, 21 px desktop) |
| Code sample | `mockup-code` plus a Copy `btn btn-xs` |
| Callout | `alert alert-success` with the offset shadow |
| Pull quote | plain `blockquote`, top and bottom rules |
| Takeaways | ordered list with numbered `badge badge-accent` circles |
| This helped | `btn` that toggles `btn-active` |
| Author box, Keep reading | `card` with the offset shadow |

Front matter adds:

```yaml
illustration: gate-42.svg
illustrationAlt: A shepherd stops a second sheep tagged 42 at the gate.
tags: [Spring Boot, Kafka, PostgreSQL]
```

## 5. Interaction summary

| Interaction | daisyUI | Needs JS |
|---|---|---|
| Light and dark theme | `swap` + `theme-controller` | No |
| Phone menu | `dropdown` on `details` | No |
| Shepherd thoughts | none, custom button | Yes, 12 lines |
| Pillar cards | `collapse` with radio inputs | No |
| Hub explorer | `tabs tabs-box` + `:has()` on SVG | No |
| Writing tabs | `tabs tabs-box` | No |
| Subscribe check | `join`, `alert` | Yes, 8 lines |
| Article text size, copy link, copy code | `join`, `btn` | Yes, a few lines each |
| Article contents on phone | `collapse` | No |

## 6. Accessibility checklist

- Every control is a real `button`, `a`, `input` or `label`.
- Icon-only buttons carry `aria-label`.
- Thought bubble uses `aria-live="polite"` so screen readers hear the new question.
- Text contrast meets 4.5:1 in both themes. Check #5B615B captions if you change backgrounds.
- The shepherd SVG has `role="img"` and an `aria-label` describing the scene.
- Respect `prefers-reduced-motion`: turn off the swap rotation with `motion-reduce:transition-none`.

## 7. Placeholders to fill

- Real article titles, dates and read times (the canvas shows samples)
- Your email in the contact line if you want one
- Hashnode, LinkedIn, dev.to and Medium profile URLs
- Case study page for the settlement engine
- Full display name if you want more than "Amwayi"

## 8. Suggested file layout

```
site/
  src/
    app.css
    components/Shepherd.svg
    scripts/thoughts.js
    scripts/subscribe.js
  content/
    philosophy/*.md
    tech/*.md
    journal/*.md
    projects/*.md
    now.md
```