import {
  Field,
  ImageField,
  NextImage as ContentSdkImage,
  Text,
} from '@sitecore-content-sdk/nextjs';
import React from 'react';
import { ComponentProps } from 'lib/component-props';

interface ImageFields {
  image?: ImageField;
  caption?: Field<string>;
}

interface ImageProps extends ComponentProps {
  fields?: ImageFields;
}

const DEFAULT_IMAGE_SIZES =
  '(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 90vw, 1200px';
const BANNER_IMAGE_SIZES =
  '(max-width: 640px) 100vw, (max-width: 768px) 768px, (max-width: 1024px) 1024px, (max-width: 1440px) 1280px, 1920px';

const ImageDefault: React.FC<ImageProps> = ({ params }) => (
  <figure className={`component image ${params.styles ?? ''}`.trim()}>
    <div className="component-content">
      <span className="is-empty-hint">Image</span>
    </div>
  </figure>
);

export const Banner: React.FC<ImageProps> = ({ params, fields }) => {
  const { styles, RenderingIdentifier: id } = params;
  const image = fields?.image;

  if (!fields) {
    return <ImageDefault params={params} />;
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
      className={`component hero-banner ${styles ?? ''}`.trim()}
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

export const Default: React.FC<ImageProps> = (props) => {
  const { fields, params } = props;
  const { styles, RenderingIdentifier: id } = params;

  if (!fields) {
    return <ImageDefault {...props} />;
  }

  const { image, caption } = fields;

  return (
    <figure className={`component image ${styles ?? ''}`.trim()} id={typeof id === 'string' ? id : undefined}>
      <div className="component-content">
        <ContentSdkImage
          field={image}
          sizes={DEFAULT_IMAGE_SIZES}
          alt={typeof image?.value?.alt === 'string' ? image.value.alt : ''}
        />
      </div>
      {caption && (
        <figcaption className="image-caption field-imagecaption">
          <Text tag="span" field={caption} />
        </figcaption>
      )}
    </figure>
  );
};
