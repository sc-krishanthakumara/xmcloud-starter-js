# PR Title

```
feat(seo): Add semantic HTML, structured data, and SEO enhancements to skate-park starter
```

# PR Description

```markdown
## Summary

This PR implements comprehensive SEO/GEO optimizations for the `kit-nextjs-skate-park` starter template, adding semantic HTML elements, schema.org structured data, enhanced metadata, and accessibility improvements while preserving the original layout and UI.

## Changes

### Semantic HTML Enhancements
- ✅ Added `<article>` elements to ContentBlock and PageContent components
- ✅ Added `<section>` element to RichText component
- ✅ Added `<aside role="complementary">` element to Promo component
- ✅ Added ARIA roles to existing semantic elements (`role="banner"`, `role="main"`, `role="contentinfo"`)
- ✅ Enhanced navigation with comprehensive ARIA attributes

### Structured Data (Schema.org)
- ✅ Added WebSite schema (site-wide JSON-LD)
- ✅ Added Organization schema (site-wide JSON-LD)
- ✅ Added WebPage schema (per-page JSON-LD)
- ✅ All schemas rendered as `<script type="application/ld+json">` blocks

### Metadata Enhancements
- ✅ Enhanced `generateMetadata()` with:
  - Open Graph tags (title, description, url, siteName, type, locale)
  - Twitter Card tags (card, title, description)
  - Canonical URLs
  - Language alternates (hreflang)
  - Robots meta tags

### Accessibility Improvements
- ✅ Added ARIA landmarks to layout elements
- ✅ Added ARIA attributes to navigation (aria-label, aria-expanded, aria-controls, aria-current)
- ✅ Added current page detection with `aria-current="page"`
- ✅ Added `aria-hidden="true"` to decorative elements

### Image Accessibility
- ✅ Added alt text handling with fallback logic:
  1. ImageCaption field value
  2. Image field alt attribute
  3. Image field title attribute
  4. Default fallback
- ✅ Added `aria-label` to images used as links

### CSS Updates
- ✅ Added CSS reset for semantic elements to ensure they don't interfere with layout

## Files Changed

### New Files
- `src/lib/seo.ts` - SEO utilities for structured data and metadata generation

### Modified Files
- `src/Layout.tsx` - Added structured data schemas, ARIA roles
- `src/app/[site]/[locale]/[[...path]]/page.tsx` - Enhanced metadata generation, WebPage schema
- `src/components/navigation/Navigation.tsx` - Added ARIA attributes, current page detection
- `src/components/image/Image.tsx` - Added alt text handling with fallback logic
- `src/components/content-block/ContentBlock.tsx` - Added `<article>` wrapper
- `src/components/page-content/PageContent.tsx` - Added `<article>` wrapper
- `src/components/rich-text/RichText.tsx` - Added `<section>` wrapper
- `src/components/promo/Promo.tsx` - Added `<aside>` wrapper, alt text for PromoIcon
- `src/assets/base/components-common.css` - Added CSS reset for semantic elements

## Impact

- ✅ **Zero layout impact** - All changes preserve original CSS structure
- ✅ **Backward compatible** - No breaking changes
- ✅ **SEO optimized** - Enhanced search engine visibility
- ✅ **Accessibility improved** - Better screen reader support
- ✅ **Semantic HTML** - Proper HTML5 semantic structure

## Testing

- ✅ TypeScript compilation passes
- ✅ ESLint passes
- ✅ Build successful
- ⏳ Manual validation recommended:
  - Google Rich Results Test: https://search.google.com/test/rich-results
  - PageSpeed Insights: https://pagespeed.web.dev/analysis/
  - Schema.org Validator: https://validator.schema.org/

## Related

Part of the SEO/GEO optimization initiative for all starter templates.
```
