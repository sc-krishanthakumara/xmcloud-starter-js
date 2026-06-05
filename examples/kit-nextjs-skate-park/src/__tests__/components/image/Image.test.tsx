import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Default as Image, Banner } from '../../../components/image/Image';
import {
  mockImagePropsComplete,
  mockImagePropsNoCaption,
  mockImagePropsNoFields,
  mockBannerProps,
} from './Image.mockProps';

const getImageComponent = (altText: string) => screen.getByAltText(altText).closest('.component');

describe('Image Component should', () => {
  it('render without crashing', () => {
    render(<Image {...mockImagePropsComplete} />);
    expect(screen.getByAltText('Test Image Alt Text')).toBeInTheDocument();
  });

  it('apply correct CSS classes', () => {
    render(<Image {...mockImagePropsComplete} />);
    expect(getImageComponent('Test Image Alt Text')).toHaveClass('component', 'image', 'image-styles');
  });

  it('have correct ID attribute', () => {
    render(<Image {...mockImagePropsComplete} />);
    expect(getImageComponent('Test Image Alt Text')).toHaveAttribute('id', 'image-test-id');
  });

  it('render image with correct src and alt attributes', () => {
    render(<Image {...mockImagePropsComplete} />);
    const imageElement = screen.getByAltText('Test Image Alt Text');
    expect(imageElement).toHaveAttribute('src', '/test-image.jpg');
    expect(imageElement).toHaveAttribute('alt', 'Test Image Alt Text');
  });

  it('render image caption', () => {
    render(<Image {...mockImagePropsComplete} />);
    const captionText = screen.getByText('This is a test image caption');
    expect(captionText).toBeInTheDocument();
    const figcaption = captionText.closest('figcaption');
    expect(figcaption).toHaveClass('image-caption', 'field-imagecaption');
  });

  it('render without caption when caption field is missing', () => {
    render(<Image {...mockImagePropsNoCaption} />);
    expect(screen.getByAltText('Image without caption')).toBeInTheDocument();
    expect(screen.queryByText('This is a test image caption')).not.toBeInTheDocument();
  });

  it('show empty hint when no fields are provided', () => {
    render(<Image {...mockImagePropsNoFields} />);
    const emptyHint = screen.getByText('Image');
    expect(emptyHint).toBeInTheDocument();
    expect(emptyHint).toHaveClass('is-empty-hint');
  });
});

describe('Banner Component should', () => {
  const getBannerDiv = () => document.querySelector('.hero-banner');

  it('render without crashing', () => {
    render(<Banner {...mockBannerProps} />);
    expect(getBannerDiv()).toBeInTheDocument();
  });

  it('apply correct CSS classes for banner', () => {
    render(<Banner {...mockBannerProps} />);
    expect(getBannerDiv()).toHaveClass('component', 'hero-banner', 'banner-styles');
  });

  it('render banner image', () => {
    render(<Banner {...mockBannerProps} />);
    const bannerContent = document.querySelector('.sc-sxa-image-hero-banner');
    expect(bannerContent).toBeInTheDocument();
    const imageElement = screen.getByAltText('Banner Background');
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', '/banner-background.jpg');
  });
});

describe('Image Component Accessibility should', () => {
  it('have alt text for images', () => {
    render(<Image {...mockImagePropsComplete} />);
    const image = screen.getByRole('img', { name: /Test Image Alt Text/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('alt', 'Test Image Alt Text');
  });

  it('provide meaningful alt text', () => {
    render(<Image {...mockImagePropsNoCaption} />);
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Image without caption');
  });
});
