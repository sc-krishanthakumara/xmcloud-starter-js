/**
 * Test fixtures and mock data for Image component
 */

import type { ImageField, LinkField, Field } from '@sitecore-content-sdk/nextjs';

interface ImageFields {
  Image: ImageField & { metadata?: { [key: string]: unknown } };
  ImageCaption: Field<string>;
  TargetUrl: LinkField;
}

type ImageProps = {
  params: { [key: string]: string };
  fields: ImageFields;
};

/**
 * Base mock data for Image component
 */
export const mockImageData = {
  basicImage: {
    value: {
      src: '/-/media/image.jpg',
      alt: 'Sample image',
      width: 800,
      height: 600,
    },
  },
  imageWithCaption: {
    value: {
      src: '/-/media/image-with-caption.jpg',
      alt: 'Image with caption',
      width: 400,
      height: 300,
    },
  },
  imageWithLink: {
    value: {
      src: '/-/media/clickable-image.jpg',
      alt: 'Clickable image',
      width: 600,
      height: 400,
    },
  },
  emptyImage: {
    value: {
      class: 'scEmptyImage',
      src: '',
      alt: '',
    },
  },
};

/**
 * Mock image caption field
 */
export const mockImageCaption: Field<string> = {
  value: 'Sample image caption',
};

/**
 * Mock empty image caption
 */
export const mockEmptyImageCaption: Field<string> = {
  value: '',
};

/**
 * Mock target URL field
 */
export const mockTargetUrl: LinkField = {
  value: {
    href: '/target-page',
    title: 'Go to target page',
  },
};

/**
 * Mock empty target URL
 */
export const mockEmptyTargetUrl: LinkField = {
  value: {
    href: '',
  },
};

/**
 * Default props for Image component testing
 */
export const defaultImageProps: ImageProps = {
  params: {
    RenderingIdentifier: 'image-1',
    styles: 'image-styles',
  },
  fields: {
    Image: mockImageData.basicImage,
    ImageCaption: mockImageCaption,
    TargetUrl: mockEmptyTargetUrl,
  },
};

/**
 * Props with image caption
 */
export const imagePropsWithCaption: ImageProps = {
  params: {
    RenderingIdentifier: 'image-2',
    styles: 'image-styles',
  },
  fields: {
    Image: mockImageData.imageWithCaption,
    ImageCaption: mockImageCaption,
    TargetUrl: mockEmptyTargetUrl,
  },
};

/**
 * Props with clickable image (target URL)
 */
export const imagePropsWithLink: ImageProps = {
  params: {
    RenderingIdentifier: 'image-3',
    styles: 'image-styles',
  },
  fields: {
    Image: mockImageData.imageWithLink,
    ImageCaption: mockImageCaption,
    TargetUrl: mockTargetUrl,
  },
};

/**
 * Props with empty image (editing placeholder)
 */
export const imagePropsEmptyImage: ImageProps = {
  params: {
    RenderingIdentifier: 'image-4',
    styles: 'image-styles',
  },
  fields: {
    Image: mockImageData.emptyImage,
    ImageCaption: mockEmptyImageCaption,
    TargetUrl: mockEmptyTargetUrl,
  },
};

/**
 * Props with minimal parameters
 */
export const imagePropsMinimal: ImageProps = {
  params: {},
  fields: {
    Image: mockImageData.basicImage,
    ImageCaption: mockEmptyImageCaption,
    TargetUrl: mockEmptyTargetUrl,
  },
};

/**
 * Props with null fields (edge case)
 */
export const imagePropsNullFields: ImageProps = {
  params: {
    RenderingIdentifier: 'image-5',
    styles: 'image-styles',
  },
  fields: null as unknown as ImageFields,
};

/**
 * Props for Banner variant
 */
export const bannerImageProps: ImageProps = {
  params: {
    RenderingIdentifier: 'banner-1',
    styles: 'hero-banner-styles',
  },
  fields: {
    Image: mockImageData.basicImage,
    ImageCaption: mockEmptyImageCaption,
    TargetUrl: mockEmptyTargetUrl,
  },
};

/**
 * Props for Banner variant with background image
 */
export const bannerImagePropsWithBackground: ImageProps = {
  params: {
    RenderingIdentifier: 'banner-2',
    styles: 'hero-banner-styles',
  },
  fields: {
    Image: {
      ...mockImageData.basicImage,
      value: {
        ...mockImageData.basicImage.value,
        class: 'scEmptyImage', // This triggers background image mode
      },
    },
    ImageCaption: mockEmptyImageCaption,
    TargetUrl: mockEmptyTargetUrl,
  },
};
