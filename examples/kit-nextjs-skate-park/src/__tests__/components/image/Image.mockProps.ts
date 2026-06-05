// Mock data for Image component testing

import { mockPage } from '../../mocks/mockPage';

export const mockImagePropsComplete = {
  rendering: {
    componentName: 'Image',
    dataSource: '',
    uid: 'image-complete-uid',
  },
  params: {
    styles: 'image-styles',
    RenderingIdentifier: 'image-test-id',
  },
  fields: {
    image: {
      value: {
        src: '/test-image.jpg',
        alt: 'Test Image Alt Text',
        width: 800,
        height: 600,
      },
    },
    caption: {
      value: 'This is a test image caption',
    },
  },
  page: mockPage,
};

export const mockImagePropsNoCaption = {
  rendering: {
    componentName: 'Image',
    dataSource: '',
    uid: 'image-no-caption-uid',
  },
  params: {
    styles: 'image-no-caption-styles',
    RenderingIdentifier: 'image-no-caption-id',
  },
  fields: {
    image: {
      value: {
        src: '/test-image-no-caption.jpg',
        alt: 'Image without caption',
        width: 800,
        height: 600,
      },
    },
  },
  page: mockPage,
};

export const mockImagePropsNoFields = {
  rendering: {
    componentName: 'Image',
    dataSource: '',
    uid: 'image-no-fields-uid',
  },
  params: {
    styles: 'image-empty-styles',
    RenderingIdentifier: 'image-empty-id',
  },
  fields: null,
  page: mockPage,
};

export const mockBannerProps = {
  rendering: {
    componentName: 'Image',
    dataSource: '',
    uid: 'banner-uid',
  },
  params: {
    styles: 'banner-styles',
    RenderingIdentifier: 'banner-test-id',
  },
  fields: {
    image: {
      value: {
        src: '/banner-background.jpg',
        alt: 'Banner Background',
        width: 1920,
        height: 600,
      },
    },
  },
  page: mockPage,
};
