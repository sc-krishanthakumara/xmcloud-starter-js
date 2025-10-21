import type { HeroProps } from '../../components/hero/hero.props';
import type { Field, LinkField, ImageField } from '@sitecore-content-sdk/nextjs';

// Inline utility functions
const createMockField = <T>(value: T): Field<T> => ({ value }) as unknown as Field<T>;
const createMockLinkField = (href: string, text: string): LinkField =>
  ({
    value: { href, text },
  }) as unknown as LinkField;
const createMockImageField = (src: string, alt: string): ImageField =>
  ({
    value: { src, alt },
  }) as unknown as ImageField;

const mockTitleField = createMockField('Experience Premium Audio');
const mockDescriptionField = createMockField(
  'Discover our premium collection of audio equipment designed for music enthusiasts and professionals.'
);
const mockBannerTextField = createMockField('New Collection Available');

const mockImageField = createMockImageField('/hero-image.jpg', 'Premium Audio Equipment');
const mockEmptyImageField = createMockImageField('', '');
const mockBannerCTAField = createMockLinkField('/products/new', 'Shop Now');
const mockSearchLinkField = createMockLinkField('/search', 'Find Store');

const mockDictionary = {
  SubmitCTALabel: 'Find Store',
  ZipPlaceholder: 'Enter ZIP code',
};

export const defaultHeroProps: HeroProps = {
  rendering: { componentName: 'Hero', params: {} },
  params: { mock_param: '' },
  fields: {
    title: mockTitleField,
    image: mockImageField,
    description: mockDescriptionField,
    bannerText: mockBannerTextField,
    bannerCTA: mockBannerCTAField,
    searchLink: mockSearchLinkField,
    dictionary: mockDictionary,
  },
  isPageEditing: false,
};

export const heroPropsNoFields: HeroProps = {
  rendering: { componentName: 'Hero', params: {} },
  params: { mock_param: '' },
  fields: {
    title: createMockField(''),
    image: createMockImageField('', ''),
    dictionary: mockDictionary,
  },
  isPageEditing: false,
};

export const heroPropsMinimal: HeroProps = {
  rendering: { componentName: 'Hero', params: {} },
  params: { mock_param: '' },
  fields: {
    title: mockTitleField,
    image: mockEmptyImageField, // Use empty image to avoid Next.js validation in tests
    dictionary: mockDictionary,
  },
  isPageEditing: false,
};

export const heroPropsWithoutBanner: HeroProps = {
  rendering: { componentName: 'Hero', params: {} },
  params: { mock_param: '' },
  fields: {
    title: mockTitleField,
    image: mockImageField,
    description: mockDescriptionField,
    dictionary: mockDictionary,
  },
  isPageEditing: false,
};

export const heroPropsEditing: HeroProps = {
  ...defaultHeroProps,
  isPageEditing: true,
};

// Mock useSitecore contexts
export const mockUseSitecoreNormal = {
  page: { mode: { isEditing: false } },
} as unknown;

export const mockUseSitecoreEditing = {
  page: { mode: { isEditing: true } },
} as unknown;
