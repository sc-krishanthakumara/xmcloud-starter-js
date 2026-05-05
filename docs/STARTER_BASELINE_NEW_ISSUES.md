# Starter baseline — net-new issues (ticket format + evidence)

**Version:** 1.2  
**Date:** April 30, 2026  
**Changelog (v1.2):** Each ticket includes an **Evidence** table (file paths, line numbers, concrete diff). **N-10** was corrected from “AI rewrites SYNC-only” to **bundle analyzer wiring** — AI `rewrites` + `src/app/api/ai/*` are aligned across all three kits.  
**Sources:** [docs/STARTER_BASELINE_AUDIT.md](./STARTER_BASELINE_AUDIT.md), [STARTER_BASELINE_AUDIT_COMPREHENSIVE.md](../STARTER_BASELINE_AUDIT_COMPREHENSIVE.md)  
**Deep dive (paths, extra excerpts):** [docs/STARTER_BASELINE_TECHNICAL_REFERENCE.md](./STARTER_BASELINE_TECHNICAL_REFERENCE.md)

**Line numbers** refer to this repository snapshot; they will shift after edits. Paths are from the repo root unless noted.

---

## Document scope

These items are **incremental** backlog entries (IDs **N-01–N-22**). They intentionally **do not** duplicate themes already owned elsewhere (epic narrative, CSP story, `ComponentProps` / field-shape split, `.dev.tsx` variant strategy, double `Providers`, `SiteMetadata` / `next/head`, empty `sitecore.config`, events version spacing, `_tests_` folder, FEaaS gap, `site-three`, `shadcd` typo, forced light theme, `search-indexing` className, etc.).

Each ticket below has **Title**, **Priority**, **Area**, **Evidence** (files + lines + specific issue), and **Description** (copy into tracker as needed).

---

## N-01 — Align baseline security headers across Solterra and SYNC

**Priority:** P1  
**Area:** Next.js config

**Evidence**

| File | Lines | Specific issue |
|------|-------|----------------|
| `examples/kit-nextjs-location-finder/next.config.ts` | 15–31 | `headers: async () => [{ source: '/(.*)', headers: [...] }]` sets `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`. |
| `examples/kit-nextjs-article-starter/next.config.ts` | — | `rg 'headers:' next.config.ts` → **no** `headers()` block; file begins with `distDir`, `reactStrictMode`, `poweredByHeader`, then `productionBrowserSourceMaps` / `images`. |
| `examples/kit-nextjs-product-listing/next.config.ts` | — | Same: **no** `headers()` entry in config. |

**Description**

Alaris ships HTTP hardening headers; Solterra and SYNC do not. This is separate from a full CSP story but affects scanners and defense-in-depth. Align all three on a documented header baseline or document intentional omission per kit.

---

## N-02 — Standardize `next/image` configuration across the three starters

**Priority:** P1  
**Area:** Next.js config

**Evidence**

| File | Lines | Specific issue |
|------|-------|----------------|
| `examples/kit-nextjs-article-starter/next.config.ts` | 22–53 | `images`: `formats`, `deviceSizes`, `imageSizes`, `minimumCacheTTL: 31536000`, **four** `remotePatterns` (incl. `*.sitecore-staging.cloud`, `*.sitecorecloud.io`). |
| `examples/kit-nextjs-location-finder/next.config.ts` | 37–51 | `images`: **two** `remotePatterns` only; no `formats` / `deviceSizes` / `minimumCacheTTL` in this block. |
| `examples/kit-nextjs-product-listing/next.config.ts` | 22–41 | `images`: **two** `remotePatterns` + `deviceSizes` + `imageSizes` + `formats`; **no** `minimumCacheTTL` in snippet; fewer host patterns than Solterra. |

**Description**

Image optimization and allowed hosts differ materially across kits. Define one recommended `images` configuration (including staging / Edge patterns) and apply or justify deltas per brand.

---

## N-03 — Standardize production browser source maps policy

**Priority:** P1  
**Area:** Next.js config

**Evidence**

| File | Lines | Specific issue |
|------|-------|----------------|
| `examples/kit-nextjs-article-starter/next.config.ts` | 14–17 | `productionBrowserSourceMaps: process.env.GENERATE_SOURCEMAP === 'true'` with multi-line comment on PageSpeed / security. |
| `examples/kit-nextjs-product-listing/next.config.ts` | 8 | Same property, **no** surrounding comment block. |
| `examples/kit-nextjs-location-finder/next.config.ts` | — | `rg 'productionBrowserSourceMaps'` → **property absent** from Alaris config. |

**Description**

Solterra and SYNC gate source maps on `GENERATE_SOURCEMAP`; Alaris does not declare the option at all. Pick one policy for XM Cloud builds and document it.

---

## N-04 — Decide explicit `compress` strategy in Next config

**Priority:** P1  
**Area:** Next.js config

**Evidence**

| File | Lines | Specific issue |
|------|-------|----------------|
| `examples/kit-nextjs-product-listing/next.config.ts` | 16–17 | Comment + `compress: true` explicitly set. |
| `examples/kit-nextjs-article-starter/next.config.ts` | — | No `compress` key in reviewed sections. |
| `examples/kit-nextjs-location-finder/next.config.ts` | — | No `compress` key in reviewed sections. |

**Description**

Only SYNC sets `compress` explicitly. Confirm Next default for your version, then align or document SYNC-only intent.

---

## N-05 — Reconcile `getComponentData` usage: Alaris vs Solterra/SYNC

**Priority:** P1  
**Area:** App Router bootstrap, `Providers`, Content SDK

**Evidence**

| File | Lines | Specific issue |
|------|-------|----------------|
| `examples/kit-nextjs-article-starter/src/app/[site]/[locale]/[[...path]]/page.tsx` | 54–59 | `getComponentData(page.layout, {}, components)` after comment “Likely will be deprecated”. |
| Same | 84–86 | `<Providers page={page} componentProps={componentProps}>`. |
| `examples/kit-nextjs-product-listing/src/app/[site]/[locale]/[[...path]]/page.tsx` | 53–54 | Same API + comment; line 54 calls `getComponentData(page.layout, {}, components)`. |
| Same | 58–61 | `<Providers page={page} componentProps={componentProps}>` inside `<Suspense>`. |
| `examples/kit-nextjs-location-finder/src/app/[site]/[locale]/[[...path]]/page.tsx` | 64–136 | **No** `getComponentData` call anywhere in default `Page` flow. |
| Same | 127 | `<Providers page={page}>` — only `page`, no `componentProps`. |
| `examples/kit-nextjs-location-finder/src/Providers.tsx` | 11–24 | **No** `ComponentPropsContext` / `componentProps` prop — differs structurally from Solterra/SYNC `Providers.tsx`. |

**Description**

Alaris never loads server `componentProps`; Solterra/SYNC do. Confirm SDK guidance and either align Alaris or document the omission so `ComponentPropsContext` behavior is predictable.

---

## N-06 — Align production build script: `sitecore-tools:generate-map` on Solterra

**Priority:** P2  
**Area:** npm scripts, CI

**Evidence**

| File | Lines | Specific issue |
|------|-------|----------------|
| `examples/kit-nextjs-article-starter/package.json` | 160 | `"build": "... sitecore-tools:build next:build"` — **no** `sitecore-tools:generate-map` before `sitecore-tools:build`. |
| `examples/kit-nextjs-location-finder/package.json` | 151 | `"build": "... sitecore-tools:generate-map sitecore-tools:build next:build"`. |
| `examples/kit-nextjs-product-listing/package.json` | 170 | Same sequence as Alaris (`generate-map` then `build` then `next:build`). |

**Description**

Solterra alone omits `generate-map` in the production `build` chain. Align with other kits or prove `sitecore-tools:build` always regenerates the map and document that invariant.

---

## N-07 — Standardize Turbopack usage for `next dev`

**Priority:** P2  
**Area:** npm scripts

**Evidence**

| File | Lines | Specific issue |
|------|-------|----------------|
| `examples/kit-nextjs-article-starter/package.json` | 165 | `"next:dev": "... next dev --turbopack"`. |
| `examples/kit-nextjs-location-finder/package.json` | 155 | `"next:dev": "... next dev"` — no Turbopack flag. |
| `examples/kit-nextjs-product-listing/package.json` | 173 | Same as Alaris — plain `next dev`. |

**Description**

Dev server behavior and performance differ across verticals. Choose an org-wide default and document it.

---

## N-08 — Fix `package.json` repository URL to point at xmcloud-starter-js

**Priority:** P2  
**Area:** Package metadata

**Evidence**

| File | Lines | Specific issue |
|------|-------|----------------|
| `examples/kit-nextjs-article-starter/package.json` | 15–20 | `"repository": { "url": "git+https://github.com/sitecore/content-sdk.git" }`, `bugs.url` → content-sdk issues. |
| `examples/kit-nextjs-location-finder/package.json` | 15–20 | Identical pattern. |
| `examples/kit-nextjs-product-listing/package.json` | 16–21 | Same `repository` / `bugs` URLs. |

**Description**

Metadata points at the wrong GitHub product. Update to **Sitecore/xmcloud-starter-js** (or your canonical fork) for `repository` and `bugs`.

---

## N-09 — Harmonize npm scripts across the three starters

**Priority:** P2  
**Area:** npm scripts, lint/format DX

**Evidence**

| File | Lines | Specific issue |
|------|-------|----------------|
| `examples/kit-nextjs-product-listing/package.json` | 156–179 | Scripts block **starts** with `test` / `fix` / `lint:fix` / `prettier` / `format:check`, then `build` / `dev` — includes **`fix`**, **`lint:fix`**, **`prettier`** (write). |
| `examples/kit-nextjs-article-starter/package.json` | 159–179 | Scripts block **starts** with `build`, `format:check`, `lint`, … — has **`format:check`** but **no** `lint:fix` / `fix` / write Prettier script. |
| `examples/kit-nextjs-location-finder/package.json` | 150–170 | Has `lint`, `type-check`, `build`, `dev`, `test*` — **no** `format:check`, **no** `lint:fix`, **no** `fix`. |

**Description**

Script names, ordering, and formatting workflows differ (SYNC most complete; Alaris missing `format:check`). Align to the bar documented in `AGENTS.md` / team convention.

---

## N-10 — Align `@next/bundle-analyzer` wiring in `next.config` (dependency vs usage)

**Priority:** P2  
**Area:** Next.js config, bundle analysis DX

**Evidence**

| File | Lines | Specific issue |
|------|-------|----------------|
| `examples/kit-nextjs-location-finder/package.json` | 30 | Declares `"@next/bundle-analyzer": "16.2.1"`. |
| `examples/kit-nextjs-article-starter/package.json` | 30 | Same dependency declared. |
| `examples/kit-nextjs-product-listing/package.json` | 31 | Same dependency declared. |
| `examples/kit-nextjs-location-finder/next.config.ts` | 3, 129–132 | **Imports** `withBundleAnalyzer` and **wraps** export: `export default analyzeBundles(withNextIntl(nextConfig))` (use `ANALYZE=true npm run build`). |
| `examples/kit-nextjs-article-starter/next.config.ts` | — | `rg 'bundle-analyzer|withBundleAnalyzer'` → **no** usage in config despite dependency. |
| `examples/kit-nextjs-product-listing/next.config.ts` | — | Same — **no** analyzer wrapper in config. |

**Description**

All three kits depend on `@next/bundle-analyzer`, but only Alaris composes it into `next.config`. Either add the same `analyzeBundles(...)` pattern to Solterra and SYNC (and document `ANALYZE=true`) or remove the unused dependency from kits that will not wire it.

---

## N-11 — Align `generateMetadata` robots / crawler directives across starters

**Priority:** P2  
**Area:** SEO, App Router metadata

**Evidence**

| File | Lines | Specific issue |
|------|-------|----------------|
| `examples/kit-nextjs-location-finder/src/app/[site]/[locale]/[[...path]]/page.tsx` | 252–262 | `generateMetadata` return includes `robots: { index, follow, googleBot: { ... } }`. |
| `examples/kit-nextjs-article-starter/src/app/[site]/[locale]/[[...path]]/page.tsx` | — | `rg 'robots:' page.tsx` → **no** `robots` key in metadata return. |
| `examples/kit-nextjs-product-listing/src/app/[site]/[locale]/[[...path]]/page.tsx` | — | Same — **no** `robots` block in `generateMetadata`. |

**Description**

Crawler directives differ without a clear product reason. Standardize or document per-brand SEO tables.

---

## N-12 — Decide blueprint for hero image discovery and `preload` (Alaris-only today)

**Priority:** P2  
**Area:** Performance, `page.tsx`

**Evidence**

| File | Lines | Specific issue |
|------|-------|----------------|
| `examples/kit-nextjs-location-finder/src/app/[site]/[locale]/[[...path]]/page.tsx` | 22–51 | `findHeroImageSrc(page)` walks `page.layout.sitecore.route.placeholders` for `componentName === 'Hero'`. |
| Same | 88–90 | `preload(heroImageSrc, { as: 'image', fetchPriority: 'high' })`. |
| `examples/kit-nextjs-article-starter/src/app/[site]/[locale]/[[...path]]/page.tsx` | — | **No** `preload` / hero image scan in catch-all page. |
| `examples/kit-nextjs-product-listing/src/app/[site]/[locale]/[[...path]]/page.tsx` | — | Same — no equivalent LCP preload helper. |

**Description**

Optional LCP optimization exists only on Alaris. Promote to blueprint or document as Alaris-only.

---

## N-13 — Remove legacy `font-awesome` v4 where redundant with `@fortawesome/*`

**Priority:** P2  
**Area:** Dependencies, bundle size

**Evidence**

| File | Lines | Specific issue |
|------|-------|----------------|
| `examples/kit-nextjs-article-starter/package.json` | 24–28, 79 | `@fortawesome/*` packages **and** `"font-awesome": "^4.7.0"`. |
| `examples/kit-nextjs-product-listing/package.json` | 25–29, 80 | `@fortawesome/*` plus **`"font-awesome": "^4.7.0"`** at L80. |
| `examples/kit-nextjs-location-finder/package.json` | 24–28 | **Only** `@fortawesome/*` — **no** `font-awesome` v4 line in dependencies opening. |

**Description**

Duplicate icon stacks on Solterra/SYNC vs scoped-only on Alaris. Audit imports and drop v4 if unused.

---

## N-14 — Align `fast-xml-parser` as dependency vs devDependency

**Priority:** P2  
**Area:** Dependencies

**Evidence**

| File | Lines | Specific issue |
|------|-------|----------------|
| `examples/kit-nextjs-location-finder/package.json` | 76 | `"fast-xml-parser": "^5.5.9"` under **`dependencies`**. |
| `examples/kit-nextjs-article-starter/package.json` | 135 | Same package under **`devDependencies`**. |
| `examples/kit-nextjs-product-listing/package.json` | 133 | Same — **`devDependencies`**. |

**Description**

Alaris would install parser in production; other kits treat it as dev-only. Align classification with actual runtime usage.

---

## N-15 — Remove erroneous `install` package from Solterra dependencies

**Priority:** P2  
**Area:** Dependencies, supply chain hygiene

**Evidence**

| File | Lines | Specific issue |
|------|-------|----------------|
| `examples/kit-nextjs-article-starter/package.json` | 85 | `"install": "^0.13.0"` inside **`dependencies`**. |
| `examples/kit-nextjs-location-finder/package.json` | — | **No** `install` package entry. |
| `examples/kit-nextjs-product-listing/package.json` | — | **No** `install` package entry. |

**Description**

The npm `install` package is almost certainly accidental. Remove after confirming no import.

---

## N-16 — Add consistent `description` field to Solterra and Alaris package.json

**Priority:** P3  
**Area:** Package metadata

**Evidence**

| File | Lines | Specific issue |
|------|-------|----------------|
| `examples/kit-nextjs-product-listing/package.json` | 2–3 | `"description": "Application utilizing Sitecore JavaScript Services and Next.js"`. |
| `examples/kit-nextjs-article-starter/package.json` | 2–5 | Starts with `"name"` — **no** top-level `description`. |
| `examples/kit-nextjs-location-finder/package.json` | 2–5 | Same — **no** top-level `description`. |

**Description**

Add accurate descriptions for npm/docs; refresh SYNC wording if “JavaScript Services” is no longer accurate for Content SDK.

---

## N-17 — Align ESLint `no-console` rule across starters

**Priority:** P2  
**Area:** ESLint config

**Evidence**

| File | Lines | Specific issue |
|------|-------|----------------|
| `examples/kit-nextjs-location-finder/eslint.config.mjs` | 18 | `"no-console": ["warn", { allow: ["error"] }]` inside rules. |
| `examples/kit-nextjs-article-starter/eslint.config.mjs` | — | `rg 'no-console'` → **no** match. |
| `examples/kit-nextjs-product-listing/eslint.config.mjs` | — | `rg 'no-console'` → **no** match. |

**Description**

Console usage policy differs. Pick one ESLint fragment and apply to all three configs.

---

## N-18 — Document or align TypeScript path alias baseline (excluding known typos)

**Priority:** P2  
**Area:** `tsconfig.json`

**Evidence**

| File | Lines | Specific issue |
|------|-------|----------------|
| `examples/kit-nextjs-article-starter/tsconfig.json` | 4–25 | `paths`: `components/*`, `lib/*`, `temp/*`, `assets/*`, `.sitecore/*`, `next/*`, `@/*` only — **no** `enumerations/*` or `types/*`. |
| `examples/kit-nextjs-location-finder/tsconfig.json` | 4–34 | Adds **`shadcd/*`**, **`enumerations/*`**, **`types/*`** (same `shadcd`→`shadcn//*` typo as SYNC; fix under separate ticket if desired). |
| `examples/kit-nextjs-product-listing/tsconfig.json` | 4–34 | Same extended aliases as Alaris (incl. `enumerations/*`, `types/*`, `shadcd/*`). |

**Description**

Alias surface differs; copying imports between kits breaks. Document canonical set or align (SYNC `shadcd` typo is **out of scope** for this ticket if tracked separately).

---

## N-19 — Standardize Jest configuration across the three starters

**Priority:** P2  
**Area:** Testing, Jest

**Evidence**

| File | Lines | Specific issue |
|------|-------|----------------|
| `examples/kit-nextjs-article-starter/jest.config.js` | 21–25, 34–42, 182–184 | `cache` + `cacheDirectory`; `collectCoverageFrom` excludes `ui`, `*.dev.tsx`, `*.props.*`; `testMatch` only `src/__tests__/**/*.test.[jt]s?(x)`. |
| `examples/kit-nextjs-location-finder/jest.config.js` | 13–31, 40–48 | Large `moduleNameMapper` (aliases, CSS/image mocks); `testMatch` includes `src/_tests_/**` and `src/**/*.test.*`; `collectCoverageFrom` is broad `src/**/*` minus `_tests_`. |
| `examples/kit-nextjs-product-listing/jest.config.js` | 11–23, 27–40 | `moduleNameMapper` includes `__mocks__/component-map`; `testMatch` `__tests__` only; `cache` + `cacheDirectory`; different `collectCoverageFrom` than Solterra (no `.dev` exclusion). |

**Description**

Jest resolution, discovery, and coverage scope are not comparable across kits. Extract shared config or document one baseline (`_tests_` rename stays a separate ticket).

---

## N-20 — Align `/api/healthz` (or document platform health) for Solterra and SYNC

**Priority:** P3  
**Area:** API routes, proxy, operations

**Evidence**

| File | Lines | Specific issue |
|------|-------|----------------|
| `examples/kit-nextjs-location-finder/src/app/api/healthz/route.ts` | 7–9 | `GET` returns `NextResponse.json({ status: 'healthy' }, { status: 200 })`. |
| `examples/kit-nextjs-article-starter/src/proxy.ts` | 75–87 | `matcher` excludes path segment `healthz` from proxy. |
| `examples/kit-nextjs-article-starter/src/app/api/healthz/` | — | **No** such route directory under `src/app/api/`. |
| `examples/kit-nextjs-product-listing/src/app/api/healthz/` | — | **No** route directory found in tree snapshot. |

**Description**

Alaris implements in-app health; Solterra excludes `healthz` in proxy but may not serve it. Add routes or document external health and align matchers.

---

## N-21 — Document or consolidate Alaris-only `src/config/` directory

**Priority:** P3  
**Area:** Project structure

**Evidence**

| File | Lines | Specific issue |
|------|-------|----------------|
| `examples/kit-nextjs-location-finder/src/config/image-config.ts` | 1–17 | `IMAGE_REMOTE_PATTERNS` duplicated from `next.config.ts` intent (comment L3–4: avoid importing `next.config`). |
| `examples/kit-nextjs-article-starter/src/config/` | — | **No** parallel `src/config/` directory. |
| `examples/kit-nextjs-product-listing/src/config/` | — | **No** parallel `src/config/` directory (verify if empty — grep shows Alaris-only usage above). |

**Description**

Alaris isolates image hostname helpers under `src/config/`. Document why or merge into `src/lib/` for structural consistency across kits.

---

## N-22 — Audit cross-starter utility overlap (optional hygiene)

**Priority:** P3  
**Area:** Utilities, documentation

**Evidence**

| File | Issue |
|------|--------|
| `examples/kit-nextjs-article-starter/src/utils/date-utils.ts` | Solterra-only date helpers (see imports from components e.g. `ArticleHeader.tsx` L27). |
| `examples/kit-nextjs-article-starter/src/utils/link-text.ts` | Solterra-only link helper. |
| `examples/kit-nextjs-location-finder/src/lib/framer-features.ts` | Imported from `Providers.tsx` L9 for `LazyMotion` feature loading. |

**Description**

Per starter independence, do not add a shared npm package; produce a short appendix in the blueprint listing “optional copy sources” for equivalent behavior (dates, motion, image hostname matching, etc.).

---

## Appendix A — Audit doc corrections (metadata only; not product tickets)

**Title:** Correct factual errors in `STARTER_BASELINE_AUDIT_COMPREHENSIVE.md` §3.6 and §3.10

**Evidence**

| Claim in comprehensive doc | Fact in repo |
|----------------------------|----------------|
| §3.6 — Alaris `withBundleAnalyzer` unused | `examples/kit-nextjs-location-finder/next.config.ts` **L129–132**: `analyzeBundles(withNextIntl(nextConfig))` exports wrapped config; `ANALYZE=true` enables analyzer. |
| §3.10 — Tailwind `content` “fixed everywhere” | `examples/kit-nextjs-location-finder/src/assets/tailwind.config.cjs` **L25–28** still lists `./src/pages/**/*.{...}`. |

**Description**

Update the comprehensive audit so planning is not based on incorrect statements.

---

## Appendix B — Relationship to other audit artifacts

| Artifact | Role |
|----------|------|
| [STARTER_BASELINE_AUDIT_COMPREHENSIVE.md](../STARTER_BASELINE_AUDIT_COMPREHENSIVE.md) | Broad catalog; fix Appendix A items inside that file. |
| [STARTER_BASELINE_AUDIT.md](./STARTER_BASELINE_AUDIT.md) | Condensed audit. |
| [STARTER_BASELINE_TECHNICAL_REFERENCE.md](./STARTER_BASELINE_TECHNICAL_REFERENCE.md) | Wider file/line catalog including **excluded** epic themes (ComponentProps, field shapes, etc.). |
| **This file** | Net-new tickets **N-01–N-22** with **Evidence** tables for implementation / Jira paste. |

---

*End of document.*
