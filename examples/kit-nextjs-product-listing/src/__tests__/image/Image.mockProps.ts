/**
 * Test fixtures and mock data for Image component
 */

import type { ImageField, Field, Page, ComponentRendering } from '@sitecore-content-sdk/nextjs';
import type { ImageProps } from '@/components/image/image.props';
import { mockPage as sharedMockPage } from '../test-utils/mockPage';

export const mockImageData: ImageField = {
  value: {
    src: '/-/media/image.jpg',
    alt: 'Sample image',
    width: 800,
    height: 600,
  },
};

export const mockImageCaption: Field<string> = {
  value: 'Sample image caption',
};

const mockRendering: ComponentRendering = {
  componentName: 'Image',
  dataSource: '',
  uid: 'image-uid',
  placeholders: {},
};

export const mockPage: Page = sharedMockPage;

export const defaultImageProps: ImageProps = {
  rendering: mockRendering,
  params: {
    RenderingIdentifier: 'image-1',
    styles: 'image-styles',
  },
  fields: {
    image: mockImageData,
    caption: mockImageCaption,
  },
  page: mockPage,
};

export const imagePropsWithoutCaption: ImageProps = {
  ...defaultImageProps,
  fields: {
    image: mockImageData,
  },
};

export const imagePropsNullFields: ImageProps = {
  ...defaultImageProps,
  fields: undefined as unknown as ImageProps['fields'],
};

export const bannerImageProps: ImageProps = {
  rendering: mockRendering,
  params: {
    RenderingIdentifier: 'banner-1',
    styles: 'hero-banner-styles',
  },
  fields: {
    image: mockImageData,
    caption: mockImageCaption,
  },
  page: mockPage,
};
