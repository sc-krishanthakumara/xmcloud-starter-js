# Starter baseline - net-new issues (ticket format)

**Version:** 1.1  
**Date:** April 30, 2026  
**Sources:** [docs/STARTER_BASELINE_AUDIT.md](./STARTER_BASELINE_AUDIT.md), [STARTER_BASELINE_AUDIT_COMPREHENSIVE.md](../STARTER_BASELINE_AUDIT_COMPREHENSIVE.md)

---

## Document scope

These items are **incremental** backlog entries (IDs **N-01–N-22**) derived from the two audit documents. They intentionally **do not** duplicate themes already owned elsewhere (epic narrative, CSP story, `ComponentProps` / field-shape split, `.dev.tsx` variant strategy, double `Providers`, `SiteMetadata` / `next/head`, empty `sitecore.config`, events version spacing, `_tests_` folder, FEaaS gap, `site-three`, `shadcd` typo, forced light theme, `search-indexing` className, etc.). Copy each block below into your tracker as **Title** + **Description**.

---

## N-01 - Align baseline security headers across Solterra and SYNC

**Priority:** P1  
**Area:** Next.js config (`next.config`)

**Description**

Alaris (`kit-nextjs-location-finder`) configures standard hardening headers in `next.config` (for example `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`). Solterra and SYNC do not expose the same set. This is separate from a full Content-Security-Policy initiative but still affects security posture and automated scanner results. Align all three starters on a documented header baseline (values may vary slightly by deployment), or document why two kits intentionally omit them.

---

## N-02 - Standardize `next/image` configuration across the three starters

**Priority:** P1  
**Area:** Next.js config

**Description**

`images` configuration differs materially: Solterra includes richer `remotePatterns`, `deviceSizes`, `imageSizes`, cache TTL, and formats; Alaris is minimal; SYNC sits between. Partners comparing starters see inconsistent guidance for XM Cloud media hosts and performance. Define one recommended `images` block (including staging / Edge host patterns), apply it to all three kits, and note any brand-specific exceptions in the blueprint.

---

## N-03 - Standardize production browser source maps policy

**Priority:** P1  
**Area:** Next.js config

**Description**

Solterra and SYNC configure `productionBrowserSourceMaps` with narrative comments; Alaris does not match the same approach. Inconsistent source map behavior complicates debugging, release hygiene, and comparison against PageSpeed or security tooling expectations. Choose one policy for XM Cloud rendering hosts and apply consistently (including whether maps are omitted, hidden, or uploaded only to CI artifacts).

---

## N-04 - Decide explicit `compress` strategy in Next config

**Priority:** P1  
**Area:** Next.js config

**Description**

SYNC sets `compress: true` in `next.config`; the other kits rely on implicit defaults. This is low risk but unclear for maintainers (“was SYNC special on purpose?”). Verify Next.js default for the supported version, then either set `compress` explicitly everywhere with a one-line comment or document that only SYNC requires it.

---

## N-05 - Reconcile `getComponentData` usage: Alaris vs Solterra/SYNC

**Priority:** P1  
**Area:** App Router page bootstrap, `Providers`, Content SDK

**Description**

Solterra and SYNC call `client.getComponentData` in the catch-all `page.tsx` and pass the result into `Providers` as `componentProps`. Alaris does not call `getComponentData` at all; `Providers` only receives `page`. That yields different behavior for any code path relying on `ComponentPropsContext` being populated from the server. Confirm with Content SDK guidance whether Alaris omission is intentional. If intentional, document it prominently in the starter README and blueprint; if not, add the same loading path as the other kits (or remove it everywhere behind a single documented pattern).

---

## N-06 - Align production build script: `sitecore-tools:generate-map` on Solterra

**Priority:** P2  
**Area:** npm scripts, CI

**Description**

Solterra’s `npm run build` runs `sitecore-tools:build` then `next:build` without a preceding `sitecore-tools:generate-map`. Alaris, SYNC, and skate-park run `generate-map` before `sitecore-tools:build`. If `sitecore-tools:build` does not always regenerate the component map, clean CI clones or fresh checkouts may produce stale or missing maps. Align Solterra’s build sequence with the other starters or document why `generate-map` is redundant and enforce that invariant in tooling.

---

## N-07 - Standardize Turbopack usage for `next dev`

**Priority:** P2  
**Area:** npm scripts, developer experience

**Description**

Solterra uses `next dev --turbopack`; Alaris and SYNC use plain `next dev`. That creates different dev performance characteristics and occasional behavior deltas when reproducing bugs across verticals. Decide on a repo-wide default (all Turbopack, all webpack dev, or feature-flaged) and update scripts accordingly, with a short note in contributor docs.

---

## N-08 - Fix `package.json` repository URL to point at xmcloud-starter-js

**Priority:** P2  
**Area:** Package metadata

**Description**

Kit `package.json` files still declare `repository.url` targeting the Content SDK git repository instead of **Sitecore/xmcloud-starter-js** (or your fork canonical URL). That misleads `npm` metadata, issue links, and new contributors. Update `repository` (and optionally `bugs` / `homepage`) to the correct GitHub coordinates for each starter, consistent with where the code actually lives.

---

## N-09 - Harmonize npm scripts across the three starters

**Priority:** P2  
**Area:** npm scripts, lint/format DX

**Description**

Script names and ordering differ: for example SYNC exposes `fix`, `lint:fix`, and a write-mode Prettier script; others differ in availability and ordering relative to `build` / `test`. `AGENTS.md` already lists a canonical set; align each starter’s `package.json` scripts to that minimum bar (`dev`, `build`, `start`, `lint`, `lint:fix` or agreed equivalent, `format:check`, `type-check`, `test`, plus Sitecore tool scripts) so automation and onboarding stay predictable.

---

## N-10 - Document or replicate AI / crawler rewrites (SYNC-only today)

**Priority:** P2  
**Area:** Next.js rewrites, API routes

**Description**

SYNC’s `next.config` includes rewrites such as `/ai/markdown/:path*` and `/.well-known/ai.txt` routing into app API handlers. The other starters do not. Either treat this as an optional SYNC vertical feature and document it clearly in README and blueprint, or promote the same endpoints to all kits if they are part of the baseline “XM Cloud starter” contract.

---

## N-11 - Align `generateMetadata` robots / crawler directives across starters

**Priority:** P2  
**Area:** SEO, App Router metadata

**Description**

Alaris `generateMetadata` returns a richer `robots` / `googleBot` block than Solterra and SYNC in comparable form. Crawling and preview behavior may differ without authors realizing it. Pick a shared SEO baseline for multisite kits (or explicitly per-brand tables) and implement the same structure across starters, with content-appropriate defaults.

---

## N-12 - Decide blueprint for hero image discovery and `preload` (Alaris-only today)

**Priority:** P2  
**Area:** Performance, LCP, `page.tsx`

**Description**

Alaris implements `findHeroImageSrc` on layout data and calls `react-dom` `preload` for the hero image in `page.tsx`. The other starters do not use this pattern. Evaluate whether this should become a shared best practice (with a small shared helper) or remain an Alaris-specific optimization, and document the decision so partners do not assume parity.

---

## N-13 - Remove legacy `font-awesome` v4 where redundant with `@fortawesome/*`

**Priority:** P2  
**Area:** Dependencies, bundle size

**Description**

Solterra and SYNC depend on both `@fortawesome/*` (scoped, modern) and legacy `font-awesome` ^4.7.0. Alaris uses only the scoped packages. Duplicate icon stacks increase bundle size and confusion. Audit imports; remove `font-awesome` v4 if unused, or document a single supported icon path per starter.

---

## N-14 - Align `fast-xml-parser` as dependency vs devDependency

**Priority:** P2  
**Area:** Dependencies

**Description**

`fast-xml-parser` is listed under **dependencies** on Alaris and under **devDependencies** on Solterra and SYNC. Placement affects production install graphs and compliance reviews. Determine whether runtime needs the package; align all three `package.json` files to the same classification with a short comment if non-obvious.

---

## N-15 - Remove erroneous `install` package from Solterra dependencies

**Priority:** P2  
**Area:** Dependencies, supply chain hygiene

**Description**

Solterra lists `"install": "^0.13.0"` in `dependencies`. The `install` package on npm is widely regarded as accidental noise and is not a normal Next.js app dependency. Confirm it is unused, remove it, and add a lightweight PR checklist item to catch similar additions.

---

## N-16 - Add consistent `description` field to Solterra and Alaris package.json

**Priority:** P3  
**Area:** Package metadata

**Description**

Only SYNC includes a top-level `description` in `package.json`. Adding concise, accurate descriptions to Solterra and Alaris improves npm metadata, workspace tooling, and onboarding. Wording should reflect each starter’s purpose (editorial, location, product) without referencing deprecated JSS framing unless still accurate.

---

## N-17 - Align ESLint `no-console` rule across starters

**Priority:** P2  
**Area:** ESLint config

**Description**

Alaris enables `no-console` as a warning with an allowlist for `error`; Solterra and SYNC do not configure the same rule. Logging discipline then differs when copying components or tests between kits. Decide on a single ESLint policy for console usage and apply the same `eslint.config` fragment to all three starters.

---

## N-18 - Document or align TypeScript path alias baseline (excluding known typos)

**Priority:** P2  
**Area:** `tsconfig.json`

**Description**

Alaris and SYNC expose additional path aliases (`enumerations/*`, `types/*`, etc.) that Solterra does not. SYNC’s `shadcd` typo is tracked elsewhere; this ticket covers **parity and documentation** of intentional alias sets so imports resolve the same way when patterns are copied between starters. Either extend Solterra with documented aliases or shrink the others to a documented minimum set.

---

## N-19 - Standardize Jest configuration across the three starters

**Priority:** P2  
**Area:** Testing, Jest

**Description**

`testMatch`, `moduleNameMapper` complexity (heaviest on Alaris), cache directory usage, `collectCoverageFrom` scopes, and presence of `src/__mocks__/` (SYNC only) all differ. That makes coverage reports incomparable and increases friction when porting tests. Extract a shared partial config or document a single canonical Jest baseline and migrate each starter toward it (without re-opening the `_tests_` rename ticket, which stays separate).

---

## N-20 - Align `/api/healthz` (or document platform health) for Solterra and SYNC

**Priority:** P3  
**Area:** API routes, operations

**Description**

Alaris ships `src/app/api/healthz`. Solterra and SYNC do not include an in-repo health route; Solterra’s `proxy` matcher still excludes `healthz`, implying something external answers health checks. For operational consistency across XM Cloud demos, either add a minimal health route to all kits with the same JSON contract or document which environments inject health and remove misleading exclusions.

---

## N-21 - Document or consolidate Alaris-only `src/config/` directory

**Priority:** P3  
**Area:** Project structure

**Description**

Alaris includes a `src/config/` area without a parallel in other starters. New contributors may not know whether this is a required pattern for Sitecore apps or Alaris-specific configuration. Add README or blueprint documentation for its role, or merge its contents into an established folder such as `src/lib/` if that better matches the unified structure.

---

## N-22 - Audit cross-starter utility overlap (optional hygiene)

**Priority:** P3  
**Area:** Utilities, documentation

**Description**

Some utilities are starter-specific by design, but others overlap in purpose (for example date/link helpers on Solterra vs locale/framer helpers on Alaris). Per starter independence, do not introduce shared packages; instead produce a short audit appendix listing “could copy if needed” utilities and link from the blueprint so partners know where to look when aligning behavior.

---

## Appendix A - Audit doc corrections (metadata only; not product tickets)

**Title:** Correct factual errors in `STARTER_BASELINE_AUDIT_COMPREHENSIVE.md` §3.6 and §3.10

**Description**

Section 3.6 claims Alaris imports `withBundleAnalyzer` but does not use it. The current `next.config.ts` wraps the export with `analyzeBundles(withNextIntl(nextConfig))`, so the analyzer is active when `ANALYZE=true`. Section 3.10 implies Tailwind `content` no longer references `./src/pages`; Alaris root `tailwind.config.js` is minimal, but `src/assets/tailwind.config.cjs` still includes `./src/pages/**/*`. Update the comprehensive audit so future work is not planned on false premises.

---

## Appendix B - Relationship to other audit artifacts

| Artifact | Role |
|----------|------|
| [STARTER_BASELINE_AUDIT_COMPREHENSIVE.md](../STARTER_BASELINE_AUDIT_COMPREHENSIVE.md) | Broad catalog; update per Appendix A where wrong. |
| [STARTER_BASELINE_AUDIT.md](./STARTER_BASELINE_AUDIT.md) | Condensed audit and early “additional findings.” |
| **This file** | Ready-to-copy **Title** + **Description** blocks for N-01–N-22. |

---

*End of document.*
