# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio site for Remington Westbrook, hosted on GitHub Pages at `reming.to`. The root `/index.html` redirects to `/n/` where the actual site lives.

## Architecture

### Portfolio (`n/`)
Single-page site with expandable section-panels (Work, About, Writing, Contact). No build step — plain HTML/CSS/JS served directly.

- `n/index.html` — consolidated single page; sections expand/collapse via JS
- `n/css/style.css` — all portfolio styles; CSS custom properties for theming
- `n/js/main.js` — scrollspy, section expand/collapse, hash navigation

Nav uses anchor links (`#work`, `#about`, `#writing`, `#contact`). URL hash auto-expands the corresponding section on page load.

### Ologiology (`n/projects/ologiology/index.html`)
Self-contained React 18 + D3.js force-directed knowledge graph (~2000 lines, single file). Uses CDN-loaded React, ReactDOM, Babel (in-browser JSX transform), and D3. Has its own font stack (EB Garamond/Cormorant Garamond) and design identity separate from the portfolio.

Key features: Wikipedia API integration (cached in `Map`), search autocomplete, back/forward navigation history, breadcrumbs, shareable `?ology=` URLs, mobile bottom sheet.

The `OLOGIES` array contains 628 entries with `id`, `label`, `category`, `desc`, `parent`, `obscurity`, and optional `wikiTitle` (used when label doesn't match Wikipedia article title).

### FinVis (`n/projects/finvis/`)
Pre-built PWA deployed as static assets (Vite output). Source code lives in a separate repository (`oltray/financevisualizer`). Do not edit files in this directory — they are build artifacts.

### Legacy (`n/projects/finance-visualizer/index.html`)
Standalone single-file React app. Predecessor to FinVis.

## Design System (Portfolio)

CSS variables (defined in `:root` in `style.css`):
- Colors: `--red`, `--amber`, `--blue`, `--cyan`, `--green` (accent colors); `--black` through `--cream` (neutrals)
- Fonts: `--font-display` (Bebas Neue), `--font-tech` (Orbitron), `--font-mono` (Source Code Pro), `--font-serif` (Playfair Display)
- Dark theme only. Noise texture overlay, vignette effect.

## Deployment

Static site on GitHub Pages. Push to `main` branch deploys automatically. Custom domain configured via `CNAME` file (`reming.to`). No build pipeline — everything is pre-built or written as vanilla HTML/CSS/JS.

## Testing

Open `n/index.html` in a browser. Key things to verify:
- Sections expand/collapse; hash URLs work (e.g., load with `#contact`)
- Mobile hamburger menu works; sections expand on mobile
- Ologiology: `?ology=cetology` selects and zooms to node; Wikipedia summaries load; search autocomplete works; back/forward navigation works
- No console errors
