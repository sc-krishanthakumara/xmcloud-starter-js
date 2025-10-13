import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// We'll dynamically import ArticleHeader after mocks are set up so mocks apply reliably
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ArticleHeader: React.ComponentType<any>;
import { fullProps, minimalProps, noFieldsProps } from './ArticleHeader.mockProps';

// Mock lucide-react icons (ESM) to avoid transform issues in Jest
jest.mock('lucide-react', () => ({
  Facebook: () => <svg data-testid="icon-facebook" />,
  Linkedin: () => <svg data-testid="icon-linkedin" />,
  Twitter: () => <svg data-testid="icon-twitter" />,
  Link: () => <svg data-testid="icon-link" />,
  Check: () => <svg data-testid="icon-check" />,
  Mail: () => <svg data-testid="icon-mail" />,
}));

// Mock NoDataFallback to avoid loading utility with ESM dependencies
jest.mock('../../utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: { componentName: string }) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

// Mock sitecore components and utilities used inside ArticleHeader
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({
    field,
    tag: Tag = 'span',
    className,
  }: {
    field?: { value?: string };
    tag?: 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
    className?: string;
  }) => {
    if (!field?.value) return null;
    return React.createElement(Tag, { className }, field.value);
  },
}));

// Mock Avatar and Badge and Toaster UI components to avoid complex dependencies
jest.mock('../../components/ui/avatar', () => ({
  Avatar: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="avatar">{children}</div>
  ),
  AvatarImage: ({ src, alt }: { src?: string; alt?: string }) => (
    <img src={src} alt={alt} data-testid="avatar-image" />
  ),
  AvatarFallback: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('../../components/ui/badge', () => ({
  Badge: ({ children }: { children?: React.ReactNode }) => (
    <span data-testid="badge">{children}</span>
  ),
}));

jest.mock('../../components/ui/toaster', () => ({
  Toaster: () => <div data-testid="toaster" />,
}));

jest.mock('../../components/image/ImageWrapper.dev', () => ({
  __esModule: true,
  Default: ({ image, alt }: { image?: { value?: { src?: string } }; alt?: string }) => (
    <img src={image?.value?.src} alt={alt} data-testid="image-wrapper" />
  ),
}));

jest.mock('../../components/floating-dock/floating-dock.dev', () => ({
  FloatingDock: ({
    items,
  }: {
    items?: Array<{
      title?: string;
      ariaLabel?: string;
      onClick?: () => void;
    }>;
  }) => (
    <div data-testid="floating-dock">
      {items?.map((it, idx: number) => (
        <button key={idx} aria-label={it.ariaLabel} onClick={it.onClick}>
          {it.title}
        </button>
      ))}
    </div>
  ),
}));

jest.mock('../../components/button-component/ButtonComponent', () => ({
  ButtonBase: ({
    buttonLink,
    className,
  }: {
    buttonLink?: { value?: { href?: string; text?: string } };
    className?: string;
  }) => (
    <a href={buttonLink?.value?.href} className={className} data-testid="button-base">
      {buttonLink?.value?.text}
    </a>
  ),
}));

// Mock the toast hook
const mockToast = jest.fn();
jest.mock('../../hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
});

// Provide a basic matchMedia implementation for tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    dispatchEvent: jest.fn(),
  }),
});

describe('ArticleHeader', () => {
  beforeAll(async () => {
    // Import ArticleHeader after mocks are registered
    const articleHeaderMod = await import('../../components/article-header/ArticleHeader');
    ArticleHeader = articleHeaderMod.Default;
  });
  it('renders header structure even when field values are empty', () => {
    const { container } = render(<ArticleHeader {...noFieldsProps} />);

    // Component renders the header structure even with empty fields
    // This matches the component's actual behavior (it checks if (fields) which is truthy for {})
    expect(container.querySelector('header')).toBeInTheDocument();
  });

  it('renders title and image when full props provided', () => {
    render(<ArticleHeader {...fullProps} />);

    expect(screen.getByText('Article Title')).toBeInTheDocument();
    // Component renders multiple image wrappers (background + featured); ensure at least one exists
    expect(screen.getAllByTestId('image-wrapper').length).toBeGreaterThanOrEqual(1);
  });

  it('renders minimal content when minimal props provided', () => {
    render(<ArticleHeader {...minimalProps} />);

    expect(screen.getByText('Article Title')).toBeInTheDocument();
  });

  it('handles copy link action and shows toast', async () => {
    render(<ArticleHeader {...fullProps} />);

    // Wait for the Copy link buttons to appear (rendered inside FloatingDock mock)
    // Component renders two FloatingDock instances (mobile + desktop), so get all and click first
    const copyButtons = await screen.findAllByLabelText('Copy link');

    // Click the button and wait for async operations to complete
    fireEvent.click(copyButtons[0]);

    // Wait for the clipboard operation and state updates to complete
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalled();
    });
  });
});
