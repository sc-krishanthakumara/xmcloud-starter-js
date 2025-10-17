/* eslint-disable */
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Default as MediaSectionDefault } from '../../components/media-section/MediaSection.dev';
import {
  defaultMediaSectionProps,
  mediaSectionPropsVideoOnly,
  mediaSectionPropsImageOnly,
  mediaSectionPropsReducedMotion,
  mediaSectionPropsEmpty,
  mediaSectionPropsMinimal,
} from './MediaSection.mockProps';

// Mock the Sitecore Content SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: jest.fn(() => ({
    page: { mode: { isNormal: true, isEditing: false } }
  })),
  getImageProps: jest.fn(() => ({
    props: { src: '/images/video-poster.jpg', width: 800, height: 600 }
  })),
}));

// Mock next/image
jest.mock('next/image', () => ({
  getImageProps: jest.fn(() => ({
    props: { src: '/images/video-poster.jpg', width: 800, height: 600 }
  })),
}));

// Mock ImageWrapper component
jest.mock('../../components/image/ImageWrapper.dev', () => ({
  Default: ({ image, className, alt }: any) => {
    if (!image?.value?.src) return null;
    return (
      <img
        src={image.value.src}
        alt={image.value.alt || alt}
        className={className}
        data-testid="media-image"
      />
    );
  },
}));

// Mock intersection observer hook
jest.mock('../../hooks/use-intersection-observer', () => ({
  useIntersectionObserver: jest.fn(() => [true, { current: null }])
}));

// Mock cn utility
jest.mock('../../lib/utils', () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' '),
}));

// Mock IntersectionObserver for browsers that don't support it
if (typeof global.IntersectionObserver === 'undefined') {
  global.IntersectionObserver = class IntersectionObserver {
    root = null;
    rootMargin = '';
    thresholds = [];
    
    constructor(public callback: any, public options?: any) {}
    
    observe() {
      this.callback([{ isIntersecting: true }], this);
    }
    
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
  } as any;
}

//TODO: Seems like there is a memory leak issue, require further investigation
describe.skip('MediaSection Component', () => {
  const originalLocation = window.location;

  beforeAll(() => {
    // Mock window location for URL generation
    delete (window as any).location;
    window.location = {
      protocol: 'https:',
      hostname: 'localhost',
    } as any;
  });

  afterAll(() => {
    (window as any).location = originalLocation;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Video Rendering', () => {
  it('renders video with correct attributes and classes', () => {
    const { container } = render(<MediaSectionDefault {...defaultMediaSectionProps} />);

    const video = container.querySelector('video'); // video with aria-hidden="true"
    expect(video).toBeInTheDocument();
    expect(video?.tagName.toLowerCase()).toBe('video');
    
    // Check source element for the video src
    const source = video?.querySelector('source');
    expect(source).toHaveAttribute('src', '/videos/demo-video.mp4');
      
    // Accessibility and performance attributes
    expect(video).toHaveAttribute('playsInline');
    expect(video).toHaveProperty('muted', true);  // muted is a boolean property, not attribute
    expect(video).toHaveAttribute('loop');
      expect(video).toHaveAttribute('aria-hidden', 'true');
      expect(video).toHaveAttribute('preload', 'metadata');
      expect(video).toHaveAttribute('loading', 'lazy');
      
      // CSS classes
      expect(video).toHaveClass('inset-0', 'block', 'h-full', 'w-full', 'rounded-md', 'object-cover');
      expect(video).toHaveClass('test-media-section');
      
      // Poster attribute
      expect(video).toHaveAttribute('poster');
    });
  });

  describe('Image Rendering', () => {
    it('renders image with correct attributes when no video is provided', () => {
      render(<MediaSectionDefault {...mediaSectionPropsImageOnly} />);

      const image = screen.getByTestId('media-image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/images/video-poster.jpg');
      expect(image).toHaveAttribute('alt', 'Video Poster');
      
      // CSS classes
      expect(image).toHaveClass('inset-0', 'block', 'h-full', 'w-full', 'rounded-md', 'object-cover');
      expect(image).toHaveClass('image-only-section');
    });

    it('prefers image over video when reduced motion is enabled', () => {
      render(<MediaSectionDefault {...mediaSectionPropsReducedMotion} />);

      const image = screen.getByTestId('media-image');
      expect(image).toBeInTheDocument();
      
      // Video should not render when reduced motion is enabled
      expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
    });
  });

  describe('Container and Layout', () => {
    it('renders container div with correct classes', () => {
      const { container } = render(<MediaSectionDefault {...defaultMediaSectionProps} />);

      const containerDiv = container.firstChild as HTMLElement;
      expect(containerDiv).toHaveClass('relative', 'test-media-section');
    });

    it('applies custom className to container', () => {
      const { container } = render(<MediaSectionDefault {...mediaSectionPropsImageOnly} />);

      const containerDiv = container.firstChild as HTMLElement;
      expect(containerDiv).toHaveClass('image-only-section');
    });
  });

  describe('Empty State Handling', () => {
    it('returns null when no video or image is provided', () => {
      const { container } = render(<MediaSectionDefault {...mediaSectionPropsEmpty} />);

      expect(container.firstChild).toBeNull();
    });

    it('renders when only video is provided (no image)', () => {
      const { container } = render(<MediaSectionDefault {...mediaSectionPropsVideoOnly} />);

      expect(container.querySelector('video')).toBeInTheDocument();
    });

    it('renders when only image is provided (no video)', () => {
      render(<MediaSectionDefault {...mediaSectionPropsImageOnly} />);

      expect(screen.getByTestId('media-image')).toBeInTheDocument();
    });
  });

  describe('Media Source Handling', () => {
    it('includes video source element with correct type', () => {
      const { container } = render(<MediaSectionDefault {...defaultMediaSectionProps} />);

      const video = container.querySelector('video');
      const source = video?.querySelector('source');
      expect(source).toBeInTheDocument();
      expect(source).toHaveAttribute('src', '/videos/demo-video.mp4');
      expect(source).toHaveAttribute('type', 'video/mp4');
    });

    it('handles minimal props with just video', () => {
      const { container } = render(<MediaSectionDefault {...mediaSectionPropsMinimal} />);

    const video = container.querySelector('video');
    expect(video).toBeInTheDocument();
    
    // Check source element for the video src
    const source = video?.querySelector('source');
    expect(source).toHaveAttribute('src', '/videos/demo-video.mp4');
    });
  });

  describe('Intersection Observer Integration', () => {
    it('uses intersection observer for lazy loading', () => {
      const mockUseIntersectionObserver = require('../../hooks/use-intersection-observer').useIntersectionObserver;
      
      render(<MediaSectionDefault {...defaultMediaSectionProps} />);

      expect(mockUseIntersectionObserver).toHaveBeenCalledWith({
        threshold: 0.3,
        unobserveAfterVisible: false,
      });
    });
  });

  describe('Sitecore Integration', () => {
    it('integrates with useSitecore hook', () => {
      const mockUseSitecore = require('@sitecore-content-sdk/nextjs').useSitecore;
      
      render(<MediaSectionDefault {...defaultMediaSectionProps} />);

      expect(mockUseSitecore).toHaveBeenCalled();
    });

    it('handles editing mode correctly', () => {
      const mockUseSitecore = require('@sitecore-content-sdk/nextjs').useSitecore;
      mockUseSitecore.mockReturnValue({
        page: { mode: { isNormal: false, isEditing: true } }
      });

      const { container } = render(<MediaSectionDefault {...defaultMediaSectionProps} />);

      // Should still render in editing mode
      expect(container.querySelector('video')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides proper accessibility attributes', () => {
      render(<MediaSectionDefault {...mediaSectionPropsImageOnly} />);

      const image = screen.getByTestId('media-image');
      expect(image).toHaveAttribute('alt', 'Video Poster');
    });
  });

  describe('Error Handling', () => {
    it('handles malformed video URLs gracefully', () => {
      const propsWithBadVideo = {
        ...defaultMediaSectionProps,
        video: 'invalid-url',
      };

      const { container } = render(<MediaSectionDefault {...propsWithBadVideo} />);

      const video = container.querySelector('video');
      expect(video).toBeInTheDocument();
      
      // Check source element for the video src
      const source = video?.querySelector('source');
    expect(source).toHaveAttribute('src', 'invalid-url');
    });

    it('handles missing image fields gracefully', () => {
      const propsWithoutImage = {
        ...defaultMediaSectionProps,
        image: undefined,
      };

      const { container } = render(<MediaSectionDefault {...propsWithoutImage} />);

      // Should render video but no image
      expect(container.querySelector('video')).toBeInTheDocument();
      expect(screen.queryByTestId('media-image')).not.toBeInTheDocument();
    });
  });
});
