/**
 * Unit tests for Image component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as Image, Banner } from 'components/image/Image';
import type { ImageField } from '@sitecore-content-sdk/nextjs';
import {
  defaultImageProps,
  imagePropsWithoutCaption,
  imagePropsNullFields,
  bannerImageProps,
} from './Image.mockProps';

jest.mock('@/lib/utils', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
}));

jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field }: { field?: { value?: string } }) => <span>{field?.value || ''}</span>,
  NextImage: ({ field, alt }: { field?: ImageField; alt?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      data-testid="next-image"
      src={field?.value?.src as string | undefined}
      alt={(alt ?? field?.value?.alt) as string | undefined}
      width={field?.value?.width as number | undefined}
      height={field?.value?.height as number | undefined}
    />
  ),
}));

jest.mock('@/components/image/ImageWrapper.dev', () => ({
  Default: ({ image, className }: { image?: ImageField; className?: string }) => (
    <div data-testid="image-wrapper" className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image?.value?.src as string | undefined}
        alt={image?.value?.alt as string | undefined}
      />
    </div>
  ),
}));

jest.mock('@/utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: { componentName?: string }) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

describe('Image Component', () => {
  describe('Default Variant', () => {
    it('should render image with basic structure', () => {
      const { container } = render(<Image {...defaultImageProps} />);

      expect(container.querySelector('.component.image')).toBeInTheDocument();
      expect(screen.getByTestId('image-wrapper')).toBeInTheDocument();
      expect(screen.getByText('Sample image caption')).toBeInTheDocument();
    });

    it('should apply custom styles from params', () => {
      const { container } = render(<Image {...defaultImageProps} />);

      expect(container.querySelector('.component.image')).toHaveClass('image-styles');
    });

    it('should render without caption when not provided', () => {
      render(<Image {...imagePropsWithoutCaption} />);

      expect(screen.getByTestId('image-wrapper')).toBeInTheDocument();
      expect(screen.queryByText('Sample image caption')).not.toBeInTheDocument();
    });

    it('should handle undefined fields gracefully', () => {
      render(<Image {...imagePropsNullFields} />);

      expect(screen.getByTestId('no-data-fallback')).toHaveTextContent('Image');
    });
  });

  describe('Banner Variant', () => {
    it('should render banner with hero structure', () => {
      const { container } = render(<Banner {...bannerImageProps} />);

      expect(container.querySelector('.component.hero-banner')).toBeInTheDocument();
      expect(container.querySelector('.sc-sxa-image-hero-banner')).toBeInTheDocument();
      expect(screen.getByTestId('next-image')).toBeInTheDocument();
    });
  });
});
