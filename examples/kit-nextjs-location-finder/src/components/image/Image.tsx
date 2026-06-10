import type React from 'react';
import { NextImage as ContentSdkImage, Text } from '@sitecore-content-sdk/nextjs';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { ImageProps } from '@/components/image/image.props';
import { cn } from '@/lib/utils';
import { NoDataFallback } from '@/utils/NoDataFallback';

const DEFAULT_IMAGE_SIZES = '(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 1200px';
const BANNER_IMAGE_SIZES =
  '(max-width: 640px) 100vw, (max-width: 768px) 768px, (max-width: 1024px) 1024px, (max-width: 1440px) 1280px, 1920px';

const getStyles = (params: ImageProps['params']) => params?.styles ?? params?.Styles ?? '';

// BREAKING CHANGE (SCB-1201): This component now uses the project Image datasource schema
// (fields: image, caption). The legacy SXA schema fields Image, ImageCaption, and TargetUrl
// are no longer read. Existing datasource items that had TargetUrl populated will no longer
// render as clickable links. Run the "Fix Duplicate Image Available Renderings" SPE script
// on existing sites to clean up legacy rendering registrations.

export const Default: React.FC<ImageProps> = (props) => {
  const fields = props.fields ?? props.rendering?.fields;
  const { image, caption } = fields ?? {};

  if (fields === undefined) {
    return <NoDataFallback componentName="Image" />;
  }

  return (
    <figure className={cn('component', 'image', getStyles(props.params))}>
      <ImageWrapper
        image={image}
        className="mb-[24px] h-full w-full object-cover"
        sizes={DEFAULT_IMAGE_SIZES}
      />
      {caption && (
        <figcaption className="image-caption field-imagecaption">
          <Text field={caption} />
        </figcaption>
      )}
    </figure>
  );
};

export const Banner: React.FC<ImageProps> = (props) => {
  const fields = props.fields ?? props.rendering?.fields;
  const { image } = fields ?? {};
  const id = props.params?.RenderingIdentifier;

  if (fields === undefined) {
    return <NoDataFallback componentName="Image" />;
  }

  const imageField = image && {
    ...image,
    value: {
      ...image.value,
      style: { objectFit: 'cover', width: '100%', height: '100%' },
    },
  };

  const altText = typeof image?.value?.alt === 'string' ? image.value.alt : 'Hero banner';

  return (
    <figure
      className={cn('component hero-banner', getStyles(props.params))}
      id={typeof id === 'string' ? id : undefined}
    >
      <div className="component-content sc-sxa-image-hero-banner">
        <ContentSdkImage
          field={imageField}
          loading="eager"
          fetchPriority="high"
          sizes={BANNER_IMAGE_SIZES}
          alt={altText}
        />
      </div>
    </figure>
  );
};
