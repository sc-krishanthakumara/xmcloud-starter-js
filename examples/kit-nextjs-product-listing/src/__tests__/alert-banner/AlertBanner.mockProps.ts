import type { AlertBannerProps } from '../../components/alert-banner/alert-banner.props';
import type { Field, LinkField } from '@sitecore-content-sdk/nextjs';

const mockTitleField: Field<string> = { value: 'Site notice' } as unknown as Field<string>;
const mockDescriptionField: Field<string> = {
  value: 'This is an alert banner for site-wide messages.',
} as unknown as Field<string>;
const mockLinkField: LinkField = {
  value: { href: '/learn-more', text: 'Learn more' },
} as unknown as LinkField;

// Add externalFields per AlertBannerData type so test props satisfy AlertBannerProps
const mockExternalFields = { mock_external_data: { value: 'external' } } as unknown as {
  mock_external_data: Field<string>;
};

export const defaultAlertBannerProps: AlertBannerProps = {
  rendering: { componentName: 'AlertBanner', params: {} },
  params: { mock_param: '' },
  fields: {
    title: mockTitleField,
    description: mockDescriptionField,
    link: mockLinkField,
  },
  externalFields: mockExternalFields,
};

export const alertBannerPropsNoFields: AlertBannerProps = {
  rendering: { componentName: 'AlertBanner', params: {} },
  params: { mock_param: '' },
  fields: {} as AlertBannerProps['fields'],
  externalFields: mockExternalFields,
};

export const alertBannerPropsMinimal: AlertBannerProps = {
  rendering: { componentName: 'AlertBanner', params: {} },
  params: { mock_param: '' },
  fields: {
    title: mockTitleField,
    description: { value: '' } as unknown as Field<string>,
  },
  externalFields: mockExternalFields,
};

export const alertBannerPropsWithLink: AlertBannerProps = {
  ...defaultAlertBannerProps,
};

// Mock useSitecore context (only normal needed for these tests)
export const mockUseSitecoreNormal = { page: { mode: { isEditing: false } } } as unknown;
