# Testing Setup for kit-nextjs-product-listing

## Overview
This document describes the testing architecture and best practices for the `kit-nextjs-product-listing` project.

## Test Framework & Tools
- **Jest** - Primary testing framework for unit and integration tests
- **React Testing Library** - React component testing utilities
- **@testing-library/jest-dom** - Custom Jest matchers for DOM assertions
- **jest-axe** (optional) - Automated accessibility testing

### Why Jest (Not Mocha/Chai/Sinon)?
This project uses **Jest** as the primary testing framework because:
- ✅ Native Next.js integration via `next/jest`
- ✅ Built-in coverage, mocking, and snapshot support
- ✅ jsdom environment configured out-of-the-box
- ✅ TypeScript support with minimal configuration
- ✅ Faster execution with parallel test runs

**When to consider Mocha/Chai/Sinon:**
- Only if adding a distinct Node.js backend service layer
- Must align with existing backend team standards
- Need fine-grained control over test lifecycle

**Current decision: Jest for all frontend tests. No dual framework setup.**

## Test Architecture & Layering

### Directory Structure
```
src/
  components/
    product-listing/
      __tests__/              # Colocated unit tests
        ProductListing.test.tsx
  test/
    factories/                # Data builders (minimal, override-friendly)
      product.factory.ts
    fixtures/                 # Canonical rich datasets
      product/
        productListing.fixture.ts
    mocks/                    # Environment & API mocks
      sitecoreContext.mock.ts
    utils/                    # Shared test helpers
      renderWithSitecore.tsx
    contracts/                # Schema validation tests
      product.contract.test.ts
    a11y/                     # Accessibility tests
      product-listing.a11y.test.tsx
    integration/              # Cross-component tests (future)
```

### Test Layers

#### 1. Unit Tests (Colocated)
**Location:** `src/components/**/__tests__/`  
**Purpose:** Test individual components in isolation  
**Coverage Target:** 80%+ for critical rendering logic

```typescript
// Example: Component unit test
import { renderWithSitecore } from '@/test/utils/renderWithSitecore';
import { buildProductListingProps } from '@/test/factories/product.factory';

it('renders product title', () => {
  const props = buildProductListingProps();
  renderWithSitecore(<ProductListing {...props} />);
  expect(screen.getByText('Our Featured Products')).toBeInTheDocument();
});
```

#### 2. Contract Tests
**Location:** `src/test/contracts/`  
**Purpose:** Validate Sitecore field schemas and data structures  
**Why:** Catch breaking changes in XM Cloud field definitions early

```typescript
// Example: Contract test
it('validates all products have required fields', () => {
  const items = productListingSingle.data.datasource.products?.targetItems || [];
  items.forEach((item) => {
    expect(item.productName?.jsonValue?.value).toBeDefined();
    expect(item.url?.url).toMatch(/^\/products\//);
  });
});
```

#### 3. Accessibility Tests
**Location:** `src/test/a11y/`  
**Purpose:** Prevent accessibility regressions  
**Tools:** Basic semantic checks + jest-axe (optional)

```typescript
// Example: Accessibility test
it('renders images with alt text', () => {
  const { container } = renderWithSitecore(<ProductListing {...props} />);
  const images = container.querySelectorAll('img');
  images.forEach((img) => expect(img).toHaveAttribute('alt'));
});
```

#### 4. Integration Tests (Future)
**Location:** `src/test/integration/`  
**Purpose:** Test page-level composition with routing and data fetching

## Configuration Files

## Configuration Files

### 1. jest.config.js
Configures Jest to work with Next.js and TypeScript:
- Uses `next/jest` preset
- Maps `@/` imports to `src/` directory
- Maps `@/test/` imports to `src/test/` directory (for shared test utilities)
- Mocks for `lucide-react` and `framer-motion`
- Excludes `.dev.tsx` files from coverage
- Transforms ESM modules in node_modules

### 2. jest.setup.js
Global test setup and mocks:
- **change-case** - String case transformation utilities
- **next-localization** - i18n translation hooks
- **@sitecore-content-sdk/nextjs** - Sitecore field components (Text, Image, Link, RichText)
- **window.matchMedia** - Media query support
- **IntersectionObserver** - Viewport intersection detection

### 3. tsconfig.json
Updated to include Jest and Testing Library types:
```json
"types": ["node", "jest", "@testing-library/jest-dom"]
```

### 4. __mocks__ Directory
Contains manual mocks for problematic ESM modules:
- `lucide-react.js` - Mock SVG icons
- `framer-motion.js` - Mock animation library

## Shared Test Utilities

### Factories (`src/test/factories/`)
**Purpose:** Build minimal valid objects with override-friendly API

```typescript
// Build a single product
const product = buildProduct({
  productName: { jsonValue: { value: 'Custom Name' } }
});

// Build product listing fields with N products
const fields = buildProductListingFields(3); // 3 products

// Build complete component props
const props = buildProductListingProps({
  fields: customFields,
  isPageEditing: true
});

// Reset sequence for predictable test data
resetProductSequence();
```

### Fixtures (`src/test/fixtures/`)
**Purpose:** Canonical rich datasets for common scenarios

```typescript
import { 
  productListingSingle,      // 1 product
  productListingMultiple,    // 3 products
  emptyProductListing,       // 0 products
  featuredProductListing     // Rich custom data
} from '@/test/fixtures/product/productListing.fixture';
```

### Mocks (`src/test/mocks/`)
**Purpose:** Centralized environment mocks

```typescript
import { 
  mockSitecoreContext,
  mockSitecoreEditingContext,
  mockSitecorePreviewContext 
} from '@/test/mocks/sitecoreContext.mock';
```

### Utilities (`src/test/utils/`)
**Purpose:** Render helpers and assertion utilities

```typescript
// Render with Sitecore context
renderWithSitecore(<Component />, {
  sitecore: { page: { mode: { isEditing: true } } }
});
```

## Running Tests

```powershell
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- ProductListing.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="renders product title"

# Run only contract tests
npm test -- src/test/contracts

# Run only accessibility tests
npm test -- src/test/a11y
```

## Writing Tests

### Best Practices

#### 1. Use Semantic Queries
**Prefer:** `screen.getByRole()`, `screen.getByLabelText()`  
**Avoid:** `container.querySelector('.className')`

```typescript
// ✅ Good - queries by accessible role
expect(screen.getByRole('heading', { name: /products/i })).toBeInTheDocument();

// ❌ Bad - queries by implementation detail
expect(container.querySelector('h2.title')).toBeInTheDocument();
```

#### 2. Use Factories for Dynamic Data
**Prefer:** Factories with overrides  
**Avoid:** Copy-pasting large fixture objects

```typescript
// ✅ Good - minimal and clear
const props = buildProductListingProps({
  fields: buildProductListingFields(5) // 5 products
});

// ❌ Bad - verbose and hard to maintain
const props = {
  fields: {
    data: {
      datasource: {
        title: { /* 50 lines of nested objects */ },
        // ...
      }
    }
  }
};
```

#### 3. Centralize Mocks
**Prefer:** `renderWithSitecore()` helper  
**Avoid:** Manual mock setup in each test

```typescript
// ✅ Good - uses shared helper
renderWithSitecore(<Component />, {
  sitecore: { page: { mode: { isEditing: true } } }
});

// ❌ Bad - manual mock in every test
useSitecoreMock.mockReturnValue({ page: { mode: { isEditing: true } } });
render(<Component />);
```

#### 4. Test Behavior, Not Implementation
**Focus on:** What the user sees and does  
**Avoid:** Testing internal state or methods

```typescript
// ✅ Good - tests user-visible behavior
expect(screen.getByText('Premium Wireless Headphones')).toBeInTheDocument();
expect(screen.getByRole('link', { name: /view all/i })).toHaveAttribute('href', '/products');

// ❌ Bad - tests implementation details
expect(component.state.products.length).toBe(3);
expect(component.instance().renderProducts).toHaveBeenCalled();
```
} as any);
```

### 3. Testing XM Cloud Components
- Always mock `useSitecore` hook
- Test both **editing** and **preview** modes
- Verify components handle missing/null field data gracefully
- Test variant rendering (Default, ThreeUp, Slider)

### 4. File Naming Conventions
- Place tests in `__tests__` directory next to components
- Name files with `.test.tsx` or `.spec.tsx` suffix
- Example: `ProductListing.test.tsx`

## Common Issues & Solutions

### Issue: ESM Module Errors
**Problem:** `SyntaxError: Cannot use import statement outside a module`

**Solution:** Add the module to `transformIgnorePatterns` in `jest.config.js` or create a mock in `__mocks__/`

### Issue: Sitecore Field Rendering
**Problem:** Cannot destructure Sitecore fields

**Solution:** Mock the field components in `jest.setup.js`:
```javascript
Text: ({ field, tag: Tag = 'span', ...props }) => {
  if (!field?.value) return null;
  return <Tag {...props}>{field.value}</Tag>;
}
```

### Issue: Animation Library Errors
**Problem:** `useMotionTemplate is not a function`

**Solution:** Update `__mocks__/framer-motion.js` with the missing hook

## Next Steps

### Priority Components to Test
1. **Product Listing Variants**
   - ProductListingThreeUp
   - ProductListingSlider
   - ProductListingCard

2. **Custom Hooks**
   - use-zipcode.ts
   - use-match-media.ts
   - use-intersection-observer.ts

3. **Site-Specific Components**
   - Components in `site-three/` directory

4. **Integration Tests**
   - Component interactions
   - Form submissions
   - API endpoints

### Coverage Goals
- **High Priority**: Core product listing components (>80% coverage)
- **Medium Priority**: Supporting utilities and hooks (>70% coverage)
- **Lower Priority**: UI components and animations (>60% coverage)

## Resources
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Sitecore Content SDK](https://doc.sitecore.com/xmc/en/developers/content-sdk/index.html)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
