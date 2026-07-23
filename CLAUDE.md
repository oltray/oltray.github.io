# oltray.github.io — Claude context

This repo is the **published GitHub Pages site** (`oltray.github.io`). It contains
**build output only**, not source. The portfolio pages live under `n/`, and the
FinVis app lives at `n/finvis/` as a compiled Vite/React bundle.

- App logic bundle: `n/finvis/assets/index-BsWdoi_T.js` (single minified line)
- Vendors: `react-vendor-*.js`, `chart-vendor-*.js`, `db-vendor-*.js`
- Styles: `n/finvis/assets/index-nnfXGXhk.css`

> **Important:** The FinVis *source project* (Vite + React + TypeScript) is **not**
> in this repo and was not found elsewhere on this machine during the last session.
> The fixes below are meant to be applied in that **source project**, then rebuilt,
> with the resulting `dist/` copied back into `n/finvis/`. Do **not** rebuild FinVis
> from scratch — locate the original source first. The bundle references below are
> diagnostic evidence to help you find the corresponding source, not edit targets.

---

# FinVis fix plan (deferred)

Six issues to fix in the FinVis source, then rebuild and redeploy to `n/finvis/`.
Ordered roughly easy → hard.

## Deploy loop (do this once source is located)
1. `npm install` in the FinVis source project.
2. `npm run dev` — verify each fix against a real dev server (the whole point of
   using source instead of patching the bundle).
3. `npm run build`.
4. Copy the built `dist/*` over `n/finvis/` (keep the `/n/finvis/` base path — the
   built `index.html` uses absolute `/n/finvis/assets/...` URLs and a PWA manifest;
   preserve that base in `vite.config` `base: '/n/finvis/'`).
5. Commit.

---

## 1. Recurring bills show as one inflated monthly event on the calendar
**Symptom:** A $70/weekly bill appears as a single ~$280 event instead of one event
per weekly occurrence. Affects all non-monthly schedule types.

**Root cause (confirmed from bundle):**
- The Payment Calendar renders a month grid and places bills with
  `bills.filter(b => b.dueDay === dayOfMonth)` — i.e. every bill is pinned to a
  single day-of-month (`dueDay`).
- The amount shown is run through a monthly normalizer
  `Lt(amount, frequency) = amount * Rt[frequency]` (weekly factor ≈ 4.33), so
  `$70 weekly → ~$303/mo` collapses into one event on one day.

**Fix (source level):**
- In the calendar event builder, **expand each recurring bill into one event per
  occurrence within the visible month**, carrying the **raw per-occurrence amount**
  (not the monthly-normalized amount). Occurrence rules:
  - `weekly` → every 7 days from an anchor date
  - `biweekly` → every 14 days from an anchor date
  - `semi-monthly` → two fixed days (e.g. 1st & 15th, or two configured days)
  - `monthly` → the single `dueDay`
  - `annually` → once/year (only in its due month)
- This means recurring items need an **anchor/start date** (not just `dueDay`); add
  one to the bill model if missing, defaulting sensibly for existing data.
- Keep the monthly normalizer (`Lt`) for the *summary/budget totals*, but do **not**
  use it for individual calendar events.

## 2. CSV export gives a single line / only the first job (esp. mobile)
**Symptom:** Exported CSV contains one data line and only the first income/job.

**Evidence from bundle:**
- Row escaper `p`, row joiner `f = rows => rows.map(p).join(",")`, download helper
  `y = (text, name) => { Blob([text],{type:"text/csv"}); a.href = URL.createObjectURL; a.download; a.click() }`.
- Income export builds rows then calls `y(t.join("\n"), "finvis-incomes-<date>.csv")`
  — so a newline join exists on that path.

**Likely causes to check in source:**
1. **Row generation** — confirm it `.map`s over *all* incomes/jobs, not
   `incomes[0]` / a `find`. "Only the first job" points at a single-item source.
2. **Mobile download path** — `a.click()` on a `blob:` URL is unreliable on iOS
   Safari / some Android browsers; it can save an empty or truncated file. Add a
   **mobile-safe fallback**: try `navigator.share({ files: [File] })` when
   available, else open the blob in a new tab / use a `data:` URI, and ensure the
   anchor is appended to `document.body` before `.click()` and removed after.
3. **Newline handling** — verify the same `join("\n")` path is used for *every*
   export (bills, debts, incomes), not a comma-only join somewhere.

## 3. Installments UI missing — no input fields in Bills or Debts
**Symptom:** Choosing an installment schedule/type offers no fields to enter
installment data, in either the Bills or Debts forms.

**Evidence from bundle (data model already supports it):**
- Debt types: `["ongoing","contract","installment","one-time"]`, label map
  `{ installment: "Installment", ... }`.
- Filtering logic reads `debt.paymentsRemaining` for `type === "installment"`.
- So the **model has installment fields but the form UI never renders the inputs**.

**Fix (source level):**
- In the **Debt form**, when `type === "installment"`, conditionally render inputs
  for: total/principal amount, number of installments, payments remaining,
  per-installment amount, first-payment date. Wire them into the saved debt object
  (`paymentsRemaining`, etc.).
- In the **Bill form**, if an installment schedule is intended for bills, add the
  matching schedule option and the same conditional fields; otherwise remove
  "installment" from the bill schedule choices so it isn't a dead option.
- Derive any redundant field (e.g. per-installment amount = total / count) rather
  than storing conflicting values.

## 4. More spending categories
**Current set (bundle):**
`["housing","utilities","transportation","insurance","debt","subscriptions","lifestyle","savings","other"]`
with a color map (e.g. `savings:"#00bfff"`, `other:"#888888"`, neon palette) and a
label map.

**Fix:** Add categories in the source's single categories config/constants and
update **all three** places that reference them:
1. the category array/enum,
2. the label map,
3. the color map (give each new category a color consistent with the neon palette).
Suggested additions: `groceries`, `dining`, `healthcare`, `entertainment`,
`education`, `personal-care`, `childcare`, `pets`, `gifts-donations`, `travel`,
`taxes`, `clothing`, `home-improvement`. Confirm every category dropdown/selector
reads from the shared list (no hardcoded subsets — the bundle shows at least one
short subset array like `["lifestyle","subscriptions","other","transportation"]`
that may need updating too).

## 5. Font selection option in Settings
**Requirements:**
- Add a **font picker** to Settings.
- **Default: Garamond** — use **EB Garamond** from Google Fonts (plain "Garamond"
  isn't reliably available cross-platform).
- Additional options: **Roboto**, **IBM Plex Serif**, **Tektur** (all Google Fonts).

**Fix (source level):**
- Add the font families to font loading. Current `index.html` preloads Inter +
  JetBrains Mono via Google Fonts `<link>`; add EB Garamond, Roboto, IBM Plex Serif,
  Tektur (or inject the stylesheet dynamically when a font is selected to avoid
  loading all four upfront).
- Persist the chosen font with the rest of app settings (localStorage / IndexedDB —
  FinVis uses a `db-vendor` bundle, likely Dexie/IndexedDB).
- Apply via a CSS variable on `:root` (e.g. `--font-body`) or a class on `<html>`,
  so it themes the whole app. Make EB Garamond the default value.

---

## Notes for whoever picks this up
- Prefer TDD / a dev server for #1, #2, #3 — they're logic/UX changes that are easy
  to get subtly wrong and were impossible to verify in the minified bundle.
- After rebuild, asset filenames get new content hashes; the built `index.html`
  updates its `<script>`/`<link>` refs automatically — just copy the whole `dist`.
- Keep `base: '/n/finvis/'` and the PWA config so service-worker paths stay valid.
