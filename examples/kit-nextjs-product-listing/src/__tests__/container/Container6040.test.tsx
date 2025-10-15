import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as Container6040 } from '../../components/container/container-6040/Container6040';
import {
  defaultContainer6040Props,
  container6040WithStyles,
  container6040NoTopMargin,
  container6040WithContent,
} from './Container6040.mockProps';

// Mock Sitecore Content SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Placeholder: ({ name, rendering }: { name: string; rendering: unknown }) => (
    <div data-testid="placeholder" data-name={name} data-rendering={JSON.stringify(rendering)}>
      Placeholder: {name}
    </div>
  ),
  useSitecore: () => ({
    page: {
      mode: {
        isEditing: false,
      },
    },
  }),
}));

// Mock Flex components
jest.mock('@/components/flex/Flex.dev', () => ({
  Flex: ({ children, wrap }: { children: React.ReactNode; wrap: string }) => (
    <div data-testid="flex" data-wrap={wrap}>
      {children}
    </div>
  ),
  FlexItem: ({ children, as, basis }: { children: React.ReactNode; as: string; basis: string }) => (
    <div data-testid="flex-item" data-as={as} data-basis={basis}>
      {children}
    </div>
  ),
}));

// Mock cn utility
jest.mock('@/lib/utils', () => ({
  cn: jest.fn((...classes) => {
    return classes
      .filter(Boolean)
      .map((c) => {
        if (typeof c === 'string') return c;
        if (typeof c === 'object' && c !== null) {
          return Object.keys(c)
            .filter((k) => c[k])
            .join(' ');
        }
        return '';
      })
      .filter(Boolean)
      .join(' ');
  }),
}));

// Mock container utility functions
jest.mock('@/components/container/container.util', () => ({
  getContainerPlaceholderProps: (key: string, params: Record<string, string>) => ({
    dynamicKey: `${key}-dynamic`,
    genericKey: key,
    fragment: params.fragment || 'default',
  }),
  isContainerPlaceholderEmpty: (
    rendering: unknown,
    _placeholderProps: unknown,
    content: unknown
  ) => {
    return (
      !content &&
      (!rendering || !(rendering as { placeholders?: Record<string, unknown[]> }).placeholders)
    );
  },
}));

describe('Container6040', () => {
  it('renders with default props', () => {
    const { container } = render(<Container6040 {...defaultContainer6040Props} />);

    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass('container--6040');
  });

  it('renders two placeholders with correct names', () => {
    render(<Container6040 {...defaultContainer6040Props} />);

    const placeholders = screen.getAllByTestId('placeholder');
    expect(placeholders).toHaveLength(2);
    expect(placeholders[0]).toHaveAttribute('data-name', 'container-sixty-left-dynamic');
    expect(placeholders[1]).toHaveAttribute('data-name', 'container-forty-right-dynamic');
  });

  it('applies custom styles from params', () => {
    const { container } = render(<Container6040 {...container6040WithStyles} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-container-class');
  });

  it('excludes top margin when specified', () => {
    const { container } = render(<Container6040 {...container6040NoTopMargin} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('mt-0');
  });

  it('includes top margin by default', () => {
    const { container } = render(<Container6040 {...defaultContainer6040Props} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('mt-4');
  });

  it('renders Flex component with correct props', () => {
    render(<Container6040 {...defaultContainer6040Props} />);

    const flex = screen.getByTestId('flex');
    expect(flex).toHaveAttribute('data-wrap', 'nowrap');
  });

  it('renders two FlexItems with 6/10 and 4/10 basis (60/40 split)', () => {
    render(<Container6040 {...defaultContainer6040Props} />);

    const flexItems = screen.getAllByTestId('flex-item');
    expect(flexItems).toHaveLength(2);
    expect(flexItems[0]).toHaveAttribute('data-basis', '6/10');
    expect(flexItems[1]).toHaveAttribute('data-basis', '4/10');
  });

  it('renders with content in placeholders', () => {
    render(<Container6040 {...container6040WithContent} />);

    const placeholders = screen.getAllByTestId('placeholder');
    expect(placeholders).toHaveLength(2);
  });

  it('applies correct container class name', () => {
    const { container } = render(<Container6040 {...defaultContainer6040Props} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('container--6040');
  });
});
