import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as Image, Banner } from '@/components/image/Image';
import type { ImageProps } from '@/components/image/image.props';
import type { ImageField } from '@sitecore-content-sdk/nextjs';
import {
  defaultProps,
  propsWithoutCaption,
  propsWithEmptyCaption,
  propsWithoutAlt,
  propsWithLargeImage,
  propsWithoutStyles,
  propsWithoutFields,
  bannerProps,
} from './Image.mockProps';

interface MockTextProps {
  field?: { value?: string };
}

interface MockImageWrapperProps {
  image?: ImageField;
  className?: string;
}

interface MockNoDataFallbackProps {
  componentName?: string;
}

jest.mock('@/lib/utils', () => ({
  cn: (...args: Array<string | boolean | Record<string, boolean> | undefined>) => {
    return args
      .flat()
      .filter(Boolean)
      .map((arg) => {
        if (typeof arg === 'string') return arg;
        if (typeof arg === 'object') {
          return Object.keys(arg)
            .filter((key) => arg[key])
            .join(' ');
        }
        return '';
      })
      .join(' ')
      .trim();
  },
}));

jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field }: MockTextProps) => React.createElement('span', {}, field?.value || ''),
  NextImage: ({ field, alt }: { field?: ImageField; alt?: string }) =>
    React.createElement('img', {
      src: field?.value?.src,
      alt: alt ?? field?.value?.alt,
      width: field?.value?.width,
      height: field?.value?.height,
      'data-testid': 'next-image',
    }),
}));

jest.mock('@/components/image/ImageWrapper.dev', () => ({
  Default: ({ image, className }: MockImageWrapperProps) => (
    <div data-testid="image-wrapper" className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image?.value?.src as string | undefined}
        alt={image?.value?.alt as string | undefined}
        width={image?.value?.width as number | undefined}
        height={image?.value?.height as number | undefined}
      />
    </div>
  ),
}));

jest.mock('@/utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: MockNoDataFallbackProps) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

describe('Image Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Default variant', () => {
    it('should render image with caption', () => {
      render(<Image {...defaultProps} />);

      expect(screen.getByTestId('image-wrapper')).toBeInTheDocument();
      expect(screen.getByText('This is a beautiful image caption')).toBeInTheDocument();
    });

    it('should render image element with correct src', () => {
      const { container } = render(<Image {...defaultProps} />);

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('src', '/images/sample-image.jpg');
    });

    it('should apply custom styles from params', () => {
      const { container } = render(<Image {...defaultProps} />);

      const mainDiv = container.querySelector('.component');
      expect(mainDiv).toHaveClass('custom-image-style');
    });

    it('should render without caption field', () => {
      render(<Image {...propsWithoutCaption} />);

      expect(screen.getByTestId('image-wrapper')).toBeInTheDocument();
      expect(screen.queryByText('This is a beautiful image caption')).not.toBeInTheDocument();
    });

    it('should render NoDataFallback when fields is undefined', () => {
      render(<Image {...propsWithoutFields} />);

      const fallback = screen.getByTestId('no-data-fallback');
      expect(fallback).toBeInTheDocument();
      expect(fallback).toHaveTextContent('Image');
    });
  });

  describe('Banner variant', () => {
    it('should render banner with hero structure', () => {
      const { container } = render(<Banner {...bannerProps} />);

      expect(container.querySelector('.component.hero-banner')).toBeInTheDocument();
      expect(container.querySelector('.sc-sxa-image-hero-banner')).toBeInTheDocument();
      expect(screen.getByTestId('next-image')).toBeInTheDocument();
    });

    it('should apply banner-specific styles', () => {
      const { container } = render(<Banner {...bannerProps} />);

      expect(container.querySelector('.hero-banner')).toHaveClass('hero-banner-styles');
    });
  });

  describe('Accessibility', () => {
    it('should provide alt text for images', () => {
      const { container } = render(<Image {...defaultProps} />);

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('alt', 'Sample Image');
    });

    it('should handle images without alt text', () => {
      const { container } = render(<Image {...propsWithoutAlt} />);

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('alt', '');
    });
  });
});
