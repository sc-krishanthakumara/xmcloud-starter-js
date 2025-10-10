// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Configure jest-axe for accessibility testing
import { toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

// Mock change-case
jest.mock('change-case', () => ({
  kebabCase: (str) => str?.toLowerCase().replace(/\s+/g, '-'),
  camelCase: (str) => str,
  pascalCase: (str) => str,
  snakeCase: (str) => str?.toLowerCase().replace(/\s+/g, '_'),
}));

// Mock next-localization
jest.mock('next-localization', () => ({
  useI18n: () => ({
    t: (key) => key,
    locale: () => 'en',
  }),
  I18nProvider: ({ children }) => children,
}));

// Mock Sitecore Content SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: jest.fn(),
  Text: ({ field, tag: Tag = 'span', className, ...props }) => {
    if (!field?.value) return null;
    return <Tag className={className} {...props}>{field.value}</Tag>;
  },
  Image: ({ field, ...props }) => {
    if (!field?.value?.src) return null;
    return (
      <img
        src={field.value.src}
        alt={field.value.alt || ''}
        width={field.value.width}
        height={field.value.height}
        {...props}
      />
    );
  },
  RichText: ({ field, tag: Tag = 'div', ...props }) => {
    if (!field?.value) return null;
    return <Tag dangerouslySetInnerHTML={{ __html: field.value }} {...props} />;
  },
  Link: ({ field, children, ...props }) => {
    if (!field?.value?.href) return <>{children}</>;
    
    // Use field.value.text if available, otherwise fall back to children
    const linkText = field?.value?.text || children;
    
    return <a href={field.value.href} {...props}>{linkText}</a>;
  },
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

// Mock ResizeObserver (required for embla-carousel)
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};
