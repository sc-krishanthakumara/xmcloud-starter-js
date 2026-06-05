import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as Image, Banner } from '@/components/sxa/Image';
import type { ImageField, Page } from '@sitecore-content-sdk/nextjs';

const mockPage = {
  mode: {
    isEditing: false,
    isPreview: false,
    isNormal: true,
    name: 'normal' as const,
    designLibrary: { isVariantGeneration: false },
    isDesignLibrary: false,
  },
  layout: {
    sitecore: {
      context: {},
      route: null,
    },
  },
  locale: 'en',
} as Page;

jest.mock('@/lib/utils', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
}));

jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, className }: { field?: { value?: string }; className?: string }) => (
    <span className={className} data-testid="image-caption">
      {field?.value}
    </span>
  ),
  NextImage: ({ field, alt }: { field?: ImageField; alt?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img data-testid="next-image" src={field?.value?.src} alt={alt ?? field?.value?.alt} />
  ),
}));

jest.mock('@/components/image/ImageWrapper.dev', () => ({
  Default: ({ image, className }: { image?: ImageField; className?: string }) => (
    <div data-testid="image-wrapper" className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image?.value?.src} alt={image?.value?.alt} />
    </div>
  ),
}));

jest.mock('@/utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: { componentName?: string }) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

describe('Image Component', () => {
  const defaultProps = {
    params: { styles: 'image-styles', RenderingIdentifier: 'image-1' },
    fields: {
      image: {
        value: {
          src: '/images/alaris-type-3-ambulance.jpg',
          alt: 'Alaris Type III Ambulance Front View',
        },
      },
      caption: {
        value: 'Front view of the Alaris Type III Ambulance',
      },
    },
    page: mockPage,
    rendering: { componentName: 'Image' },
  };

  it('renders image and caption', () => {
    render(<Image {...defaultProps} />);

    expect(screen.getByTestId('image-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('image-caption')).toHaveTextContent(
      'Front view of the Alaris Type III Ambulance'
    );
  });

  it('renders banner variant', () => {
    const { container } = render(<Banner {...defaultProps} />);

    expect(container.querySelector('.hero-banner')).toBeInTheDocument();
    expect(screen.getByTestId('next-image')).toBeInTheDocument();
  });

  it('renders fallback when fields are undefined', () => {
    render(<Image {...defaultProps} fields={undefined} />);

    expect(screen.getByTestId('no-data-fallback')).toHaveTextContent('Image');
  });
});
