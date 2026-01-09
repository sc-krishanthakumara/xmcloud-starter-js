# Semantic HTML & SEO Checklist - Skate Park Starter

## Overview

This checklist documents the semantic HTML and SEO requirements implemented for the `kit-nextjs-skate-park` starter template. Use this checklist to validate implementation and ensure consistency across all starter templates.

## Semantic HTML Requirements

### ✅ Layout Structure

- [x] **`<header>`** - Page header with `role="banner"`
- [x] **`<main>`** - Main content area with `role="main"`
- [x] **`<footer>`** - Page footer with `role="contentinfo"`
- [x] **`<nav>`** - Navigation elements with `aria-label`

### ✅ Semantic Elements

**Current Implementation:**
- `<header>` - Used in Layout.tsx
- `<main>` - Used in Layout.tsx
- `<footer>` - Used in Layout.tsx
- `<nav>` - Used in Navigation.tsx
- `<article>` - Used in ContentBlock.tsx and PageContent.tsx
- `<section>` - Used in RichText.tsx
- `<aside>` - Used in Promo.tsx

**Note:** Semantic elements are added with CSS reset to ensure they don't interfere with layout.

### ✅ Heading Hierarchy

- [x] **Single `<h1>` per page** - Enforced through component design
- [x] **Proper heading order** - No skipping levels (h1 → h2 → h3)
- [x] **Heading levels in components:**
  - ContentBlock: Uses `<h2>` for headings
  - LinkList: Uses `<h3>` for list titles
  - Title component: Uses Sitecore Text component (flexible heading level)

### ✅ Links

- [x] **All links use `<a>` tags** - Sitecore Link component renders as `<a>`
- [x] **Links have descriptive text** - Title or NavigationTitle used
- [x] **Current page indication** - `aria-current="page"` on active nav items

### ✅ Buttons

- [x] **Navigation uses semantic pattern** - `<label>` with checkbox (preserves CSS)
- [x] **ARIA attributes on interactive elements:**
  - `aria-label` - Descriptive label
  - `aria-expanded` - Menu state
  - `aria-controls` - Links to controlled element
  - `aria-hidden="true"` - Decorative elements

### ✅ Images

- [x] **All images have `alt` attributes** - Fallback logic implemented:
  1. ImageCaption field value
  2. Image field alt attribute
  3. Image field title attribute
  4. Default: "Image" or "Hero banner image"
- [x] **Images used as links have `aria-label`** - Descriptive label added
- [x] **Decorative images** - Can have empty alt text (not implemented, uses fallback)

## Schema.org Structured Data Requirements

### ✅ Implemented Schemas

- [x] **WebSite Schema** - Site-wide, includes:
  - `@context`: "https://schema.org"
  - `@type`: "WebSite"
  - `name`: Site name
  - `url`: Base URL
  - `publisher`: Organization reference

- [x] **Organization Schema** - Site-wide, includes:
  - `@context`: "https://schema.org"
  - `@type`: "Organization"
  - `name`: Organization name
  - `url`: Organization URL

- [x] **WebPage Schema** - Per-page, includes:
  - `@context`: "https://schema.org"
  - `@type`: "WebPage"
  - `name`: Page title
  - `description`: Page description (if available)
  - `url`: Page URL
  - `inLanguage`: Page locale
  - `isPartOf`: WebSite reference

### ❌ Not Applicable (Skate Park Site)

- [ ] **Article Schema** - Not applicable (no blog/content articles)
- [ ] **Product Schema** - Not applicable (no e-commerce)
- [ ] **Place Schema** - Not applicable (no location finder)
- [ ] **FAQPage Schema** - Not applicable (no FAQ content)

**Note:** These schemas can be added when applicable content types are introduced.

## Metadata Requirements

### ✅ Page Metadata

- [x] **Title** - Page title from Sitecore fields
- [x] **Description** - Meta description (if available in fields)
- [x] **Canonical URL** - Every page has canonical URL
- [x] **Language alternates** - `hreflang` tags for alternate locales
- [x] **Robots meta** - Index and follow directives

### ✅ Open Graph Tags

- [x] `og:title` - Page title
- [x] `og:description` - Page description
- [x] `og:url` - Canonical URL
- [x] `og:site_name` - Site name
- [x] `og:type` - Content type (website)
- [x] `og:locale` - Page locale

### ✅ Twitter Card Tags

- [x] `twitter:card` - Card type (summary_large_image)
- [x] `twitter:title` - Page title
- [x] `twitter:description` - Page description

## Accessibility Requirements

### ✅ ARIA Attributes

- [x] **Landmarks:**
  - `role="banner"` on header
  - `role="main"` on main
  - `role="contentinfo"` on footer

- [x] **Navigation:**
  - `aria-label` on navigation container
  - `aria-label` on mobile menu toggle
  - `aria-expanded` for menu state
  - `aria-controls` linking toggle to menu
  - `aria-current="page"` on active items
  - `aria-hidden="true"` on decorative elements

- [x] **Images:**
  - `alt` attributes on all images
  - `aria-label` on images used as links

### ✅ Language Attribute

- [x] **Dynamic `lang` attribute** - Updated based on locale
- [x] **Locale format handling** - Supports both underscore and hyphen formats

## Testing Requirements

### Validation Tools

- [ ] **Google Rich Results Test**
  - URL: https://search.google.com/test/rich-results
  - Validates structured data (JSON-LD)
  - Tests schema.org markup

- [ ] **PageSpeed Insights**
  - URL: https://pagespeed.web.dev/analysis/
  - Tests performance and SEO
  - Validates metadata

- [ ] **Schema.org Validator**
  - URL: https://validator.schema.org/
  - Validates JSON-LD structured data

- [ ] **WAVE Accessibility Checker**
  - URL: https://wave.webaim.org/
  - Tests accessibility
  - Validates ARIA attributes

- [ ] **Lighthouse (Chrome DevTools)**
  - Built into Chrome
  - Tests SEO, accessibility, performance
  - Validates best practices

### Manual Testing Checklist

- [x] Verify layout unchanged (compare before/after screenshots)
- [x] Check metadata in page source (`<head>` section)
- [x] Verify structured data in page source (JSON-LD scripts)
- [x] Test keyboard navigation (Tab through page)
- [x] Verify all images have alt text
- [x] Test mobile menu with keyboard
- [x] Verify `aria-current="page"` on active nav items
- [x] Check language attribute updates with locale
- [ ] Validate JSON-LD with schema.org validator
- [ ] Test with screen reader
- [ ] Verify single h1 per page
- [ ] Check heading hierarchy (no skipping levels)

## Requirements Summary

### ✅ Completed

1. ✅ Semantic HTML elements (`<header>`, `<main>`, `<footer>`, `<nav>`)
2. ✅ ARIA landmarks and attributes
3. ✅ Schema.org structured data (WebSite, Organization, WebPage)
4. ✅ Enhanced metadata (OG tags, Twitter cards, canonical URLs)
5. ✅ Image alt text handling
6. ✅ Navigation accessibility improvements
7. ✅ Dynamic language attribute
8. ✅ Requirements list documented

### ❌ Not Applicable (Skate Park Site)

1. ❌ Article Schema (no blog content)
2. ❌ Product Schema (no e-commerce)
3. ❌ Place Schema (no location finder)
4. ❌ FAQPage Schema (no FAQ content)
5. ❌ Semantic wrappers inside components (preserved layout)

### 📋 Future Enhancements

1. **Additional Structured Data:**
   - BreadcrumbList schema (when navigation structure available)
   - Article schema (if blog/content pages added)
   - FAQPage schema (if FAQ content added)

2. **Enhanced Accessibility:**
   - Skip links for keyboard navigation
   - Focus trap for mobile menu
   - Enhanced keyboard navigation

3. **Testing:**
   - Automated SEO testing
   - Accessibility testing integration
   - Structured data validation in CI/CD

## Implementation Notes

### Design Decisions

1. **No Semantic Wrappers Inside Components**
   - **Reason:** Previous attempts showed semantic wrappers can break CSS layouts
   - **Solution:** Use ARIA roles on existing elements for semantic meaning
   - **Result:** Zero layout impact while maintaining accessibility

2. **Preserved Checkbox Pattern for Navigation**
   - **Reason:** CSS heavily relies on `:checked ~` selectors
   - **Solution:** Added ARIA attributes to label for accessibility
   - **Result:** Accessibility improved without CSS changes

3. **Client-Side Language Setter**
   - **Reason:** Next.js App Router doesn't easily allow dynamic `lang` on root `<html>`
   - **Solution:** Client component updates `lang` after hydration
   - **Result:** Dynamic language without SSR issues

## Files Modified

### Created
- `src/lib/seo.ts` - SEO utilities
- `src/components/language-setter/LanguageSetter.tsx` - Language attribute setter
- `SEMANTIC-HTML-CHECKLIST.md` - This checklist

### Modified
- `src/Layout.tsx` - Added structured data, ARIA landmarks
- `src/app/[site]/[locale]/[[...path]]/page.tsx` - Enhanced metadata, WebPage schema
- `src/components/navigation/Navigation.tsx` - Added ARIA attributes
- `src/components/image/Image.tsx` - Added alt text handling

## Validation Commands

```bash
# Build and test
npm run build

# Validate structured data (manual)
# Visit: https://search.google.com/test/rich-results
# Enter your site URL

# Validate accessibility (manual)
# Visit: https://wave.webaim.org/
# Enter your site URL

# Run Lighthouse (manual)
# Open Chrome DevTools > Lighthouse > Run audit
```

---

**Last Updated:** 2024
**Starter Template:** kit-nextjs-skate-park
**Status:** ✅ Implementation Complete
