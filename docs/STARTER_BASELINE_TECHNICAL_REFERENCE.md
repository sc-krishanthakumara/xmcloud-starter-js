# Starter baseline — technical reference (file locations & line evidence)

**Version:** 1.0  
**Audit snapshot:** April 30, 2026 (line numbers refer to this revision; they may shift after edits.)

**Starters (paths from repository root):**

| Folder | Codename |
|--------|----------|
| `examples/kit-nextjs-article-starter/` | Solterra & Co. |
| `examples/kit-nextjs-location-finder/` | Alaris |
| `examples/kit-nextjs-product-listing/` | SYNC |

**Related docs:** [STARTER_BASELINE_AUDIT.md](./STARTER_BASELINE_AUDIT.md), [STARTER_BASELINE_NEW_ISSUES.md](./STARTER_BASELINE_NEW_ISSUES.md), [STARTER_BASELINE_AUDIT_COMPREHENSIVE.md](../STARTER_BASELINE_AUDIT_COMPREHENSIVE.md)

---

## Table of contents

1. [Shared types: `ComponentProps`](#1-shared-types-componentprops)
2. [Field shape and typing contracts](#2-field-shape-and-typing-contracts)
3. [Bootstrap: `getComponentData`, `Providers`, nested trees](#3-bootstrap-getcomponentdata-providers-nested-trees)
4. [Next.js config: headers, images, compression, source maps, rewrites](#4-nextjs-config-headers-images-compression-source-maps-rewrites)
5. [`package.json`: metadata, versions, scripts](#5-packagejson-metadata-versions-scripts)
6. [`sitecore.config.ts`](#6-sitecoreconfigts)
7. [SEO: `SiteMetadata`, `generateMetadata`, `next/head`](#7-seo-sitemetadata-generatemetadata-nexthead)
8. [Import path aliases](#8-import-path-aliases)
9. [Theming (`next-themes`)](#9-theming-next-themes)
10. [SYNC: tokens, fonts, BYOC, search classNames](#10-sync-tokens-fonts-byoc-search-classnames)
11. [Alaris: Tailwind legacy glob, healthz, Jest layout](#11-alaris-tailwind-legacy-glob-healthz-jest-layout)
12. [Testing: Jest differences](#12-testing-jest-differences)
13. [Lint: ESLint deltas](#13-lint-eslint-deltas)
14. [Middleware / proxy: healthz matcher](#14-middleware--proxy-healthz-matcher)

---

## 1. Shared types: `ComponentProps`

**Issue:** Same exported name, incompatible shapes; blocks copy-paste of components across starters.

| Starter | File | Lines | What differs |
|---------|------|-------|----------------|
| Solterra | `examples/kit-nextjs-article-starter/src/lib/component-props/index.ts` | 6–10 | `params: ComponentParams` only; no `componentMap` on props type. |
| Alaris | `examples/kit-nextjs-location-finder/src/lib/component-props/index.ts` | 3–12 | `params` extended with `RenderingIdentifier`, `styles`, `EnabledPlaceholders`; **requires** `componentMap: Map<string, NextjsContentSdkComponent>`. |
| SYNC | `examples/kit-nextjs-product-listing/src/lib/component-props/index.ts` | 3–11 | Same extended `params` as Alaris; **no** `componentMap` on the type. |

---

## 2. Field shape and typing contracts

### 2.1 Flat layout fields vs `fields.data.datasource` (Solterra)

**Issue:** Within one starter, Hero uses top-level `fields` entries with `.value`; ArticleHeader uses graph `fields.data.datasource` + `jsonValue`.

| File | Lines | Evidence |
|------|-------|-----------|
| `examples/kit-nextjs-article-starter/src/components/hero/Hero.tsx` | 31–46, 72–76 | Destructures `titleRequired`, … from `fields \|\| {}`; uses `titleRequired?.value` and passes `field={titleRequired}` to `Text`. |
| `examples/kit-nextjs-article-starter/src/components/article-header/ArticleHeader.tsx` | 65–72, 84–86 | `fields: { data: { datasource, externalFields } } };` then `fields?.data?.datasource`, `fields?.data?.externalFields`. |

### 2.2 Alaris Hero: delegate pattern and boundary comment

**Issue:** Wrapper explicitly defers datasource validation to children (differs from boundary-validation guidance used elsewhere).

| File | Lines | Evidence |
|------|-------|-----------|
| `examples/kit-nextjs-location-finder/src/components/hero/Hero.tsx` | 12, 15–26 | Comment: `// Data source checks are done in the child components`; `Default` only injects `dictionary` and renders `HeroDefault`. |

### 2.3 SYNC: `IGQL*` stack vs SDK fields

**Issue:** Parallel type wrappers for Graph-shaped fields; used by `site-three` components (separate contract from main kit).

| File | Lines | Evidence |
|------|-------|-----------|
| `examples/kit-nextjs-product-listing/src/types/igql.ts` | 1–14 | Defines `IGQLTextField`, `IGQLImageField`, etc., each with `jsonValue` wrapping SDK field types. |

*(Individual `site-three/*.tsx` imports vary; grep `types/igql` or `IGQL` under `examples/kit-nextjs-product-listing/src/components/site-three/` for a full list.)*

### 2.4 SYNC: dead BYOC hybrid placeholder

| File | Lines | Issue |
|------|-------|--------|
| `examples/kit-nextjs-product-listing/src/byoc/index.hybrid.ts` | 1–2 | Empty `export default {}`; placeholder only. |

### 2.5 SYNC: legacy BEM-style class segment

| File | Lines | Issue |
|------|-------|--------|
| `examples/kit-nextjs-product-listing/src/components/search-experience/SearchExperience.tsx` | 84 | `className={\`component search-indexing ${styles}\`}` — `search-indexing` naming legacy. |
| `examples/kit-nextjs-product-listing/src/components/search-experience/SearchExperience.LoadMore.tsx` | 85 | Same pattern. |

---

## 3. Bootstrap: `getComponentData`, `Providers`, nested trees

### 3.1 `getComponentData` usage

| Starter | File | Lines | Behavior |
|---------|------|-------|----------|
| Solterra | `.../article-starter/src/app/[site]/[locale]/[[...path]]/page.tsx` | 54–59, 84–86 | Comment “Likely will be deprecated”; calls `client.getComponentData`; passes `componentProps` into `<Providers>`. |
| Alaris | `.../location-finder/src/app/[site]/[locale]/[[...path]]/page.tsx` | 64–136 | **No** `getComponentData`; only `<Providers page={page}>`. |
| SYNC | `.../product-listing/src/app/[site]/[locale]/[[...path]]/page.tsx` | 53–61 | Same deprecated comment pattern; passes `componentProps` into `<Providers>` inside `<Suspense>`. |

### 3.2 Nested `<Providers>` (Solterra & SYNC)

**Issue:** Outer `Providers` receives `componentProps`; inner `Layout` wraps again with `Providers` **without** `componentProps` → inner `ComponentPropsContext` defaults to `{}`.

| Starter | Outer | Inner |
|---------|-------|-------|
| Solterra | `page.tsx` 84–86 | `Layout.tsx` 60–115 |
| SYNC | `page.tsx` 58–61 | `Layout.tsx` 107–… (opens at 107) |

### 3.3 Nested `<Providers>` (Alaris)

| File | Lines | Issue |
|------|-------|--------|
| `.../location-finder/src/app/[site]/[locale]/[[...path]]/page.tsx` | 127–134 | `<Providers page={page}>` wrapping `Layout`. |
| `.../location-finder/src/Layout.tsx` | 78–131 | Second `<Providers page={page}>` around main shell. |

### 3.4 `Providers` implementation differences

| Starter | File | Lines | Notes |
|---------|------|-------|--------|
| Solterra | `.../article-starter/src/Providers.tsx` | 15–37 | `ComponentPropsContext` + `ThemeProvider` (`attribute="class"`, no forced theme). |
| Alaris | `.../location-finder/src/Providers.tsx` | 11–38 | **No** `ComponentPropsContext`; `ThemeProvider` `defaultTheme="system"`. |
| SYNC | `.../product-listing/src/Providers.tsx` | 14–42 | `ComponentPropsContext` + `ThemeProvider` **forced light** (see §9). |

---

## 4. Next.js config: headers, images, compression, source maps, rewrites

### 4.1 Security headers (non-CSP)

| Starter | File | Lines | Issue |
|---------|------|-------|--------|
| Alaris | `examples/kit-nextjs-location-finder/next.config.ts` | 15–31 | `headers()` sets `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`. |
| Solterra | `examples/kit-nextjs-article-starter/next.config.ts` | — | **No** equivalent `headers()` block in the opened portion (starts with `poweredByHeader`, then source maps / images). |
| SYNC | `examples/kit-nextjs-product-listing/next.config.ts` | — | Same: no `headers()` in opened portion. |

### 4.2 `images` configuration depth

| Starter | File | Lines (approx.) | Issue |
|---------|------|-----------------|--------|
| Solterra | `.../article-starter/next.config.ts` | 22–53 | `formats`, `deviceSizes`, `imageSizes`, `minimumCacheTTL`, four `remotePatterns` entries. |
| Alaris | `.../location-finder/next.config.ts` | 37–51 | Two `remotePatterns`; no extra sizes/TTL block in snippet. |
| SYNC | `.../product-listing/next.config.ts` | 22–41 | Two `remotePatterns` + `deviceSizes` / `imageSizes` / `formats`; no `minimumCacheTTL` in snippet. |

### 4.3 `productionBrowserSourceMaps`

| Starter | File | Lines |
|---------|------|-------|
| Solterra | `.../article-starter/next.config.ts` | 14–17 (with comment block) |
| SYNC | `.../product-listing/next.config.ts` | 8 |
| Alaris | `.../location-finder/next.config.ts` | *(not present in first 55 lines — verify full file if aligning)* |

### 4.4 Compression

| Starter | File | Lines | Issue |
|---------|------|-------|--------|
| SYNC | `.../product-listing/next.config.ts` | 16–17 | `compress: true` explicit. |
| Solterra / Alaris | respective `next.config.ts` | — | Not set in the reviewed sections (rely on defaults). |

### 4.5 AI / crawler rewrites (aligned across kits)

| File | Lines | Fact |
|------|-------|------|
| `.../article-starter/next.config.ts` | 87–110 | Same pattern: `/ai/summary.json`, `/ai/faq.json`, `/ai/service.json`, `/ai/markdown/:path*`, `/.well-known/ai.txt`. |
| `.../location-finder/next.config.ts` | ~same indices | Equivalent `rewrites` entries (see file `rewrites` return). |
| `.../product-listing/next.config.ts` | 75–99 | Same rewrite block as Solterra in reviewed range. |

**Note:** All three ship matching `src/app/api/ai/*` route handlers (markdown, summary, faq, service); this is **not** a starter-vs-starter drift item.

### 4.6 Bundle analyzer (Alaris only wired)

| File | Lines | Fact |
|------|-------|------|
| `.../location-finder/next.config.ts` | 3, 129–132 | `withBundleAnalyzer` imported and composed: `export default analyzeBundles(withNextIntl(nextConfig));` — **is** used when `ANALYZE=true`. |
| `.../article-starter/next.config.ts`, `.../product-listing/next.config.ts` | — | `@next/bundle-analyzer` appears in each `package.json` but **no** `withBundleAnalyzer` usage in `next.config` (see ticket **N-10** in [STARTER_BASELINE_NEW_ISSUES.md](./STARTER_BASELINE_NEW_ISSUES.md)). |

---

## 5. `package.json`: metadata, versions, scripts

### 5.1 `repository` / `bugs` URL

| File | Lines | Issue |
|------|-------|--------|
| `.../article-starter/package.json` | 15–20 | `"url": "git+https://github.com/sitecore/content-sdk.git"` (not xmcloud-starter-js). |
| `.../location-finder/package.json` | 15–20 | Same. |
| `.../product-listing/package.json` | *(same pattern in repository block)* | Verify and align. |

### 5.2 Malformed `@sitecore-content-sdk/events` version (leading space)

| File | Lines |
|------|-------|
| `.../article-starter/package.json` | 63 |
| `.../location-finder/package.json` | 63 |

String value: `" ^2.0.0"` (space before caret). SYNC uses `"^2.0.0"` without the space.

### 5.3 Suspicious / duplicate dependencies (Solterra)

| File | Lines | Issue |
|------|-------|--------|
| `.../article-starter/package.json` | 79, 85 | Legacy `font-awesome` ^4.7.0 alongside `@fortawesome/*`; `"install": "^0.13.0"` in `dependencies`. |

### 5.4 `fast-xml-parser` placement

| File | Lines | Issue |
|------|-------|--------|
| `.../location-finder/package.json` | 76 | Under **dependencies**. |
| Solterra / SYNC | devDependencies sections | Listed as dev dependency (verify exact line in each file when fixing). |

### 5.5 `next-intl` version drift

| Starter | File | Line (approx.) | Value |
|---------|------|----------------|--------|
| Solterra | article `package.json` | 89 | `"next-intl": "^4.9.1"` |
| Alaris | location `package.json` | 86 | `"next-intl": "4.9.1"` (pinned) |
| SYNC | product `package.json` | 89 | `"next-intl": "^4.3.5"` |

### 5.6 Production `build` script: `generate-map` omission (Solterra)

| File | Lines | Issue |
|------|-------|--------|
| `.../article-starter/package.json` | 160 | `"build": "... sitecore-tools:build next:build"` — **no** `sitecore-tools:generate-map` before `sitecore-tools:build`. |
| `.../location-finder/package.json` | 151 | Includes `sitecore-tools:generate-map` before `sitecore-tools:build`. |
| `.../product-listing/package.json` | 170 | Same as Alaris. |

### 5.7 Dev server: Turbopack

| File | Lines | Issue |
|------|-------|--------|
| `.../article-starter/package.json` | 165 | `next dev --turbopack`. |
| `.../location-finder/package.json` | 155 | `next dev` (no Turbopack). |
| `.../product-listing/package.json` | 173 | `next dev` (no Turbopack). |

### 5.8 `description` field

| Starter | Issue |
|---------|--------|
| SYNC | Has top-level `"description"` in `package.json` (see file start). |
| Solterra / Alaris | No equivalent marketing description line next to `"name"`. |

---

## 6. `sitecore.config.ts`

| Starter | File | Lines | Issue |
|---------|------|-------|--------|
| Solterra | `examples/kit-nextjs-article-starter/sitecore.config.ts` | 1–7 | `export default defineConfig({});` — empty object; env merge only. |
| Alaris / SYNC | `examples/kit-nextjs-location-finder/sitecore.config.ts`, `.../product-listing/sitecore.config.ts` | Same pattern expected | Confirm in each; align documentation/example explicit config per blueprint. |

---

## 7. SEO: `SiteMetadata`, `generateMetadata`, `next/head`

### 7.1 `next/head` in App Router components

| File | Lines | Issue |
|------|-------|--------|
| `.../article-starter/src/components/site-metadata/SiteMetadata.tsx` | 2, 15–24 | `import Head from 'next/head'`; renders `<Head>` with `<title>`, meta tags. |
| `.../product-listing/src/components/site-metadata/SiteMetadata.tsx` | 1–2+ | Same Pages Router head pattern (see file). |

### 7.2 Alaris `SiteMetadata` (no `next/head` in reviewed implementation)

| File | Lines | Behavior |
|------|-------|----------|
| `.../location-finder/src/components/site-metadata/SiteMetadata.tsx` | 22–40 | Comments state SEO is owned by `generateMetadata()` in `page.tsx`; component adds e.g. `preconnect` only. |

### 7.3 `generateMetadata`: `robots` / `googleBot` (Alaris vs others)

| File | Lines | Issue |
|------|-------|--------|
| `.../location-finder/src/app/[site]/[locale]/[[...path]]/page.tsx` | 252–262 | Returns `robots: { index, follow, googleBot: { ... } }`. |
| Solterra / SYNC | `.../page.tsx` in each | No `robots:` key in `generateMetadata` return object (grep `robots:` returns no matches in those files). |

### 7.4 LCP preload pattern (Alaris-only)

| File | Lines | Issue |
|------|-------|--------|
| `.../location-finder/src/app/[site]/[locale]/[[...path]]/page.tsx` | 22–51, 88–90 | `findHeroImageSrc` walks layout placeholders; `preload(heroImageSrc, { as: 'image', fetchPriority: 'high' })`. |

---

## 8. Import path aliases

### 8.1 Mixed `lib/` vs `@/lib/` (Solterra)

| File | Line | Issue |
|------|------|--------|
| `.../article-starter/src/app/[site]/[locale]/[[...path]]/page.tsx` | 16 | `import { getBaseUrl } from 'lib/utils';` (no `@/`). |
| `.../article-starter/src/components/sxa/Container.tsx` | 8 | `import { ComponentProps } from 'lib/component-props';` |
| Same folder | `PageContent.tsx` L6, `ColumnSplitter.tsx` L2, `RowSplitter.tsx` L6, `ContentBlock.tsx` L4, `Navigation.tsx` L9, `PartialDesignDynamicPlaceholder.tsx` L7 | Same bare `lib/component-props` import style. |

### 8.2 SYNC: `tsconfig` path typo

| File | Lines | Issue |
|------|-------|--------|
| `.../product-listing/tsconfig.json` | 8–10 | `"shadcd/*": ["shadcn//*"]` — typo `shadcd` and double slash in target. |

---

## 9. Theming (`next-themes`)

| Starter | File | Lines | Configuration |
|---------|------|-------|-----------------|
| Solterra | `.../article-starter/src/Providers.tsx` | 33–34 | `ThemeProvider attribute="class" disableTransitionOnChange` (system-capable defaults). |
| Alaris | `.../location-finder/src/Providers.tsx` | 27–31 | `defaultTheme="system"`, `enableSystem`. |
| SYNC | `.../product-listing/src/Providers.tsx` | 32–37 | `defaultTheme="light"`, `forcedTheme="light"`, `enableSystem={false}` — dark tokens in CSS remain unused. |

---

## 10. SYNC: tokens, fonts, BYOC, search classNames

### 10.1 Auto-generated theme token errors

| File | Lines | Issue |
|------|-------|--------|
| `.../product-listing/src/assets/styles/globals.css` | 1–2 | Banner: “Do not edit directly, this file was auto-generated.” |
| Same | 31–32 | Duplicate `--color-background`. |
| Same | 64 | Invalid `--disabled: [object Object];` — token pipeline emitted a non-CSS value. |

### 10.2 Duplicate font wiring (SYNC)

| File | Lines | Issue |
|------|-------|--------|
| `.../product-listing/src/Layout.tsx` | 16–43, 86 | `localFont` / `IBM_Plex_Sans` / `IBM_Plex_Mono` on layout shell. |
| `.../product-listing/src/app/layout.tsx` | 3–37 | Same font families applied on `<html className={...}>`. |

Risk: redundant font preload / variable registration; verify computed output.

---

## 11. Alaris: Tailwind legacy glob, healthz, Jest layout

### 11.1 Stale `./src/pages/**/*` in secondary Tailwind config

| File | Lines | Issue |
|------|-------|--------|
| `.../location-finder/src/assets/tailwind.config.cjs` | 25–28 | `content` includes `'./src/pages/**/*.{js,ts,jsx,tsx,mdx}'` — Pages Router-era path. |

*(Root `examples/kit-nextjs-location-finder/tailwind.config.js` uses a different, smaller `content` array — both exist.)*

### 11.2 Health check route present (Alaris only)

| File | Lines | Behavior |
|------|-------|----------|
| `.../location-finder/src/app/api/healthz/route.ts` | 7–9 | `GET` returns JSON `{ status: 'healthy' }`. |

Solterra and SYNC: no matching `src/app/api/healthz/route.ts` in repo snapshot.

---

## 12. Testing: Jest differences

| Concern | Solterra `jest.config.js` | Alaris `jest.config.js` | SYNC `jest.config.js` |
|---------|---------------------------|-------------------------|-------------------------|
| **Cache** | `cache: true`, `cacheDirectory` (L21–25) | Not set in excerpt | `cache: true` (L39–40) |
| **`testMatch`** | Narrower component test glob (see file L56+) | `src/_tests_/**/*.test...` and `src/**/*.test...` (L40–43) | `src/__tests__/**/*.test.[jt]s?(x)` (L21–23) |
| **`moduleNameMapper`** | Shorter (see remainder of file) | Long block incl. `shadcd`, CSS/image mocks (L13–31) | Includes `shadcn` + `shadcd` + `__mocks__/component-map` (L11–19) |
| **`collectCoverageFrom`** | Components-focused, excludes `.dev` variants (L34–42) | All `src/**/*` minus mocks / `_tests_` (L44–48) | Similar to Solterra but no `.dev` exclusion (L27–32) |

**Solterra** excerpt lines 21–42 shown above in read output. **Alaris** lines 9–49. **SYNC** lines 7–41.

---

## 13. Lint: ESLint deltas

| File | Lines | Rule |
|------|-------|------|
| `examples/kit-nextjs-location-finder/eslint.config.mjs` | 18 | `"no-console": ["warn", { allow: ["error"] }]` |

Solterra / SYNC: no matching `no-console` entry in the same grep pass — align policy explicitly.

---

## 14. Middleware / proxy: healthz matcher

| File | Lines | Issue |
|------|-------|--------|
| `examples/kit-nextjs-article-starter/src/proxy.ts` | 75–87 | `matcher` excludes `healthz` from proxy chain; comment lists “5. /healthz (Health check)”. |

Solterra has **no** `src/app/api/healthz` route in tree; either add route or document that health is satisfied outside Next.

---

## Maintenance

When fixing issues, update **line numbers** in this doc or replace them with **stable anchors** (commit SHA + path) so the reference stays trustworthy.

---

*End of technical reference.*
