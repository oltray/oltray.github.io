# oltray.github.io — Claude context

This repo is the **published GitHub Pages site** (`oltray.github.io`, served at
`reming.to`). It contains **build output only**, not source. The portfolio pages
live under `n/`, and the FinVis app lives at `n/finvis/` as a compiled Vite/React
bundle.

- App logic bundle: `n/finvis/assets/index-*.js` (single minified line)
- Vendors: `react-vendor-*.js`, `chart-vendor-*.js`, `db-vendor-*.js`
- Styles: `n/finvis/assets/index-*.css`

Asset filenames are content-hashed and change on every rebuild — never hardcode
them anywhere; the built `index.html` and `sw.js` reference them automatically.

> **Important:** The FinVis *source project* (Vite + React + TypeScript) is **not**
> in this repo. It lives at **`/Volumes/Lilith/brain/finvis/`** (working copy used
> when on the external drive), mirrored from `~/Projects/finvis` on the main Mac,
> and is backed by the private GitHub repo **`oltray/finvis`** (branch `main`).
> Fixes are applied in that **source project**, then rebuilt, with the resulting
> `dist/` copied back into `n/finvis/`. Do **not** rebuild FinVis from scratch, and
> do **not** edit the minified bundles here — they are build output.
>
> `~/Projects/finvis` predates the private repo and has no remote; if you work
> there, add `origin` and pull first or the two copies will diverge.

---

# Working on this repo from Lilith (exFAT)

The external drive is exFAT, which stores neither Unix permissions nor symlinks.
Two consequences that will otherwise waste a session:

1. **Every file looks modified.** exFAT reports mode 0755 for everything, so git
   sees spurious `100644 → 100755` changes. Both repos here already have
   `git config core.fileMode false`; set it on any new clone on this drive.
2. **Editors rewrite line endings.** Much of the working tree can show as modified
   with equal insertion/deletion counts and *zero* real content change. Check with
   `git diff --ignore-cr-at-eol --name-only` before committing, and `git checkout --`
   the noise. Do not commit CRLF churn — it buries the real diff.
3. **`node_modules` cannot live on exFAT** (npm needs symlinks for `.bin`). Build
   from `~/Projects/finvis`, or copy the source to an APFS scratch dir, clone
   `node_modules` into it with `cp -Rc`, and build there.

---

# FinVis deploy loop

1. Edit source in `/Volumes/Lilith/brain/finvis/`.
2. Sync to an APFS scratch dir (see above) and run `npx vitest run` and
   `npx tsc --noEmit`.
3. `npm run build`, then verify the built output with `npx vite preview`
   — the app is served under `/n/finvis/`, so check `http://localhost:<port>/n/finvis/`.
4. `rsync -rt --delete dist/ <site>/n/finvis/`. Keep `base: '/n/finvis/'` in
   `vite.config.ts` and the PWA config so service-worker paths stay valid.
5. Check `git diff --ignore-cr-at-eol --name-only` before committing.
6. Commit both repos: the source to `oltray/finvis`, the build to this one.

---

# FinVis fix plan — COMPLETED 2026-07-23

All five issues below were fixed in the source, verified, rebuilt and deployed
(site commit `effe64d`, source commit `8630165`). Kept as a record of what
changed and where, in case of regressions.

## 1. Recurring bills showed as one inflated monthly event — FIXED
A $70/weekly bill rendered as a single ~$303 event, because the calendar placed
bills with `dueDay === dayOfMonth` and ran the amount through the monthly
normalizer.

Fixed by `src/core/engine/recurrence.ts`, which expands each bill into real
occurrences carrying the **raw per-payment amount**. `getHeatmapData`,
`getBillsDueInMonth` and the dashboard's "Due This Week" all consume it.
The monthly normalizer (`getMonthlyEquivalent`) is still correct for
summary/budget totals and is deliberately left in place there.

Added `Bill.startDate` as a recurrence anchor (weekly/biweekly step from it) and
a `semi-monthly` frequency. Bills without a `startDate` fall back to `dueDay` in
their `createdAt` month, so existing data keeps working. Covered by 16 tests in
`recurrence.test.ts` — **run these before touching the engine.**

## 2. CSV export gave a single line / dropped files — FIXED
Two separate bugs: the object URL was revoked immediately after `a.click()`, so
mobile browsers truncated the file mid-read; and two downloads fired back to back,
so browsers dropped the second.

Fixed in `src/core/utils/csv.ts`: revoke is deferred, the anchor is appended to
the DOM, multi-file exports go through `navigator.share` when available (one
gesture, all files) and otherwise space downloads out. Output is RFC 4180 CRLF
with a UTF-8 BOM. Bills, debts and incomes now export as three separate files.
`parseCSV` tolerates CRLF/LF and a BOM — the deployed `sample_bills.csv` is CRLF.

## 3. Installments UI missing — FIXED
The model supported installments but the form never rendered inputs. `BillForm`
(shared by the Bills *and* Debt pages — fixing it once covers both) now renders an
Installment Plan block when `type === 'installment'`: count, payments remaining,
first payment date and plan total. Plan total and per-payment amount derive from
each other rather than being stored twice. Added `installmentCount` and
`firstPaymentDate` to the model.

## 4. More spending categories — FIXED
Went from 9 to 22 categories. `BILL_CATEGORIES` in `src/core/models/bill.ts` is
now the single source of truth, derived from `CATEGORY_LABELS`. **Adding a
category means updating `CATEGORY_LABELS` and `CATEGORY_COLORS` only** — the
selectors, CSV validation and budget page all read the shared list. The one
deliberate subset left is `FIXED_CATEGORIES`/`VARIABLE_CATEGORIES` in
`pattern-detector.ts`, which classifies rather than enumerates; add new
categories there too or they're excluded from the fixed-vs-variable ratio.

## 5. Font picker in Settings — FIXED
EB Garamond (default), Roboto, IBM Plex Serif, Tektur. Selection persists to
`localStorage` under `finvis-font` and applies via the `--font-body` CSS variable
on `:root`; Tailwind's `font-sans`/`font-display` both point at it. `.font-mono`
stays JetBrains Mono so numeric columns keep aligning. Note this changed the
default body font from DM Sans to EB Garamond for everyone.
