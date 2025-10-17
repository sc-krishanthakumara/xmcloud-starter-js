import type { MediaSectionProps } from '../../components/media-section/media-section.props';
import type { ImageField } from '@sitecore-content-sdk/nextjs';

// Inline utility functions
const createMockImageField = (src: string, alt: string): ImageField =>
  ({
    value: { src, alt, width: '800', height: '600' },
  }) as unknown as ImageField;

const mockVideoFile = '/videos/demo-video.mp4';
const mockImageField = createMockImageField('/images/video-poster.jpg', 'Video Poster');
const mockEmptyImageField = createMockImageField('', '');

export const defaultMediaSectionProps: MediaSectionProps = {
  video: mockVideoFile,
  image: mockImageField,
  priority: false,
  className: 'test-media-section',
  height: 600,
  width: 800,
  pause: false,
  reducedMotion: false,
};

export const mediaSectionPropsVideoOnly: MediaSectionProps = {
  video: mockVideoFile,
  priority: true,
  className: 'video-only-section',
  pause: false,
  reducedMotion: false,
};

export const mediaSectionPropsImageOnly: MediaSectionProps = {
  image: mockImageField,
  priority: true,
  className: 'image-only-section',
  pause: false,
  reducedMotion: false,
};

export const mediaSectionPropsReducedMotion: MediaSectionProps = {
  video: mockVideoFile,
  image: mockImageField,
  priority: false,
  className: 'reduced-motion-section',
  pause: false,
  reducedMotion: true,
};

export const mediaSectionPropsPaused: MediaSectionProps = {
  video: mockVideoFile,
  image: mockImageField,
  priority: false,
  className: 'paused-section',
  pause: true,
  reducedMotion: false,
};

export const mediaSectionPropsEmpty: MediaSectionProps = {
  image: mockEmptyImageField,
  priority: false,
  pause: false,
  reducedMotion: false,
};

export const mediaSectionPropsMinimal: MediaSectionProps = {
  video: mockVideoFile,
  pause: false,
  reducedMotion: false,
};
