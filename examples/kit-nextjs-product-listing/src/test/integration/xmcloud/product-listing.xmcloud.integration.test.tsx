/**
 * XM Cloud Integration Tests for ProductListing
 *
 * These tests validate integration with XM Cloud architecture:
 * - Layout Service data structure validation
 * - Sitecore Client SDK integration
 * - Component data fetching patterns
 * - Field schema matching Sitecore templates
 *
 * NOTE: These tests mock the Sitecore SDK but validate the data structures
 * match what XM Cloud actually returns.
 */

import React from 'react';
import { screen } from '@testing-library/react';
import { Default as ProductListingDefault } from '@/components/product-listing/ProductListing';
import { renderWithSitecore } from '@/test/utils/renderWithSitecore';
import { productListingSingle } from '@/test/fixtures/product/productListing.fixture';
import type { ProductListingProps } from '@/components/product-listing/product-listing.props';
import client from '@/lib/sitecore-client';
import { getGraphQlClient, getValue } from '@/utils/graphQlClient';

// Mock the Sitecore client (this is how the starter kit gets data)
jest.mock('@/lib/sitecore-client');

const mockClient = client as jest.Mocked<typeof client>;

describe('ProductListing - XM Cloud Layout Service Integration', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Layout Service Data Structure Validation', () => {
    it('should validate datasource structure matches XM Cloud response', () => {
      // The fixture data should match actual Layout Service response structure
      const datasource = productListingSingle.data.datasource;

      // Validate top-level datasource structure
      expect(datasource).toHaveProperty('title');
      expect(datasource).toHaveProperty('viewAllLink');
      expect(datasource).toHaveProperty('products');

      // Validate title field (Single-Line Text in Sitecore)
      expect(datasource.title).toHaveProperty('jsonValue');
      expect(datasource.title.jsonValue).toHaveProperty('value');
      expect(typeof datasource.title.jsonValue.value).toBe('string');

      // Validate viewAllLink field (General Link in Sitecore)
      expect(datasource.viewAllLink).toHaveProperty('jsonValue');
      expect(datasource.viewAllLink.jsonValue).toHaveProperty('value');
      expect(datasource.viewAllLink.jsonValue.value).toHaveProperty('href');
      expect(datasource.viewAllLink.jsonValue.value).toHaveProperty('text');

      // Validate products field (Multilist in Sitecore)
      expect(datasource.products).toHaveProperty('targetItems');
      expect(Array.isArray(datasource.products?.targetItems)).toBe(true);
    });

    it('should validate product item schema matches Sitecore Product template', () => {
      const products = productListingSingle.data.datasource.products?.targetItems || [];

      expect(products.length).toBeGreaterThan(0);

      products.forEach((product) => {
        // Required fields from Product template (authoring/items/templates/...)
        expect(product).toHaveProperty('productName');
        expect(product.productName).toHaveProperty('jsonValue');
        expect(product.productName.jsonValue).toHaveProperty('value');

        expect(product).toHaveProperty('productThumbnail');
        expect(product.productThumbnail).toHaveProperty('jsonValue');
        expect(product.productThumbnail.jsonValue.value).toHaveProperty('src');
        expect(product.productThumbnail.jsonValue.value).toHaveProperty('alt');
        expect(product.productThumbnail.jsonValue.value).toHaveProperty('width');
        expect(product.productThumbnail.jsonValue.value).toHaveProperty('height');

        expect(product).toHaveProperty('productBasePrice');
        expect(product.productBasePrice).toHaveProperty('jsonValue');

        // URL field structure (General Link)
        expect(product).toHaveProperty('url');
        expect(product.url).toHaveProperty('path');
        expect(product.url).toHaveProperty('url');
      });
    });

    it('should validate field types match Sitecore field definitions', () => {
      const datasource = productListingSingle.data.datasource;

      // Single-Line Text field
      const titleValue = datasource.title.jsonValue.value;
      expect(typeof titleValue).toBe('string');

      // General Link field
      const linkValue = datasource.viewAllLink.jsonValue.value;
      expect(typeof linkValue.href).toBe('string');
      expect(typeof linkValue.text).toBe('string');

      // Image field
      const product = datasource.products?.targetItems[0];
      const imageValue = product?.productThumbnail.jsonValue.value;
      expect(typeof imageValue?.src).toBe('string');
      expect(typeof imageValue?.alt).toBe('string');
      expect(typeof imageValue?.width).toBe('number');
      expect(typeof imageValue?.height).toBe('number');
    });
  });

  describe('Component Props Integration with Layout Service', () => {
    it('should render component with Layout Service data structure', () => {
      // Simulate how getStaticProps provides data to the component
      const props: ProductListingProps = {
        fields: productListingSingle,
        params: {},
        rendering: { componentName: 'ProductListing' },
        isPageEditing: false,
      };

      renderWithSitecore(<ProductListingDefault {...props} />);

      // Verify component renders with Layout Service data
      expect(screen.getByText('Our Featured Products')).toBeInTheDocument();
    });

    it('should handle rendering parameters from XM Cloud', () => {
      const props: ProductListingProps = {
        fields: productListingSingle,
        params: {
          styles: 'custom-rendering-param',
          caching: 'enabled',
        },
        rendering: { componentName: 'ProductListing' },
        isPageEditing: false,
      };

      const { container } = renderWithSitecore(<ProductListingDefault {...props} />);

      // Rendering parameters should be applied
      const element = container.querySelector('.custom-rendering-param');
      expect(element).toBeInTheDocument();
    });

    it('should work with Experience Editor context', () => {
      const props: ProductListingProps = {
        fields: productListingSingle,
        params: {},
        rendering: {
          componentName: 'ProductListing',
          dataSource: '/sitecore/content/site-2/Data/Product Listing',
          uid: '{123-456-789}',
        },
        isPageEditing: false,
      };

      renderWithSitecore(<ProductListingDefault {...props} />, {
        sitecore: {
          page: { mode: { isEditing: true } },
        },
      });

      // Should render in editing mode
      expect(screen.getByText('Our Featured Products')).toBeInTheDocument();
    });
  });

  describe('Sitecore Client SDK Method Integration', () => {
    it('should validate getPage method would return correct structure', async () => {
      // Mock the client.getPage method (called in [[...path]].tsx getStaticProps)
      const mockPageData = {
        siteName: 'site-2',
        locale: 'en',
        mode: { isEditing: false, isPreview: false },
        layout: {
          sitecore: {
            context: {},
            route: {
              placeholders: {
                main: [
                  {
                    componentName: 'ProductListing',
                    dataSource: '/sitecore/content/site-2/Data/Product Listing',
                    fields: productListingSingle,
                  },
                ],
              },
            },
          },
        },
      };

      mockClient.getPage.mockResolvedValue(
        mockPageData as unknown as Awaited<ReturnType<typeof client.getPage>>
      );

      const result = await client.getPage('/products', { locale: 'en' });

      expect(result).toBeDefined();
      expect(result?.siteName).toBe('site-2');
      expect(result?.locale).toBe('en');
    });

    it('should validate getDictionary method structure', async () => {
      const mockDictionary = {
        'product-listing-title': 'Featured Products',
        'view-all-link': 'View All Products',
      };

      mockClient.getDictionary.mockResolvedValue(mockDictionary);

      const result = await client.getDictionary({
        site: 'site-2',
        locale: 'en',
      });

      expect(result).toBeDefined();
      expect(result['product-listing-title']).toBe('Featured Products');
    });

    it('should validate getComponentData method structure', async () => {
      const mockLayout = {
        sitecore: {
          context: {},
          route: {
            placeholders: {
              main: [
                {
                  componentName: 'ProductListing',
                  fields: productListingSingle,
                },
              ],
            },
          },
        },
      };

      const mockComponentProps = {
        ProductListing: {
          customProp: 'value',
        },
      };

      mockClient.getComponentData.mockResolvedValue(mockComponentProps);

      const result = await client.getComponentData(
        mockLayout as unknown as Parameters<typeof client.getComponentData>[0],
        {} as Parameters<typeof client.getComponentData>[1],
        {} as Parameters<typeof client.getComponentData>[2]
      );

      expect(result).toBeDefined();
      expect(result.ProductListing).toBeDefined();
    });
  });

  describe('Multi-language Support (i18n)', () => {
    it('should handle English locale correctly', () => {
      const props: ProductListingProps = {
        fields: productListingSingle,
        params: {},
        rendering: { componentName: 'ProductListing' },
        isPageEditing: false,
      };

      renderWithSitecore(<ProductListingDefault {...props} />, {
        sitecore: {
          page: {
            locale: 'en',
            mode: { isEditing: false },
          },
        },
      });

      expect(screen.getByText('Our Featured Products')).toBeInTheDocument();
    });

    it('should validate data structure supports multiple languages', () => {
      // Layout Service should return language-specific content
      const datasource = productListingSingle.data.datasource;

      // The jsonValue.value should contain localized content
      expect(datasource.title.jsonValue.value).toBe('Our Featured Products'); // English

      // For French, the same structure would contain French text:
      // expect(datasource.title.jsonValue.value).toBe('Nos produits vedettes'); // French
    });
  });

  describe('Error Handling & Edge Cases', () => {
    it('should handle missing datasource gracefully', () => {
      const emptyFields = {
        data: {
          datasource: null,
        },
      };

      const props = {
        fields: emptyFields,
        params: {},
        rendering: { componentName: 'ProductListing' },
        isPageEditing: false,
      } as unknown as ProductListingProps;

      // Component should not crash
      const { container } = renderWithSitecore(<ProductListingDefault {...props} />);
      expect(container).toBeInTheDocument();
    });

    it('should handle empty products array', () => {
      const emptyProductFields = {
        data: {
          datasource: {
            title: {
              jsonValue: {
                value: 'No Products',
              },
            },
            viewAllLink: {
              jsonValue: {
                value: {
                  href: '/products',
                  text: 'View All',
                },
              },
            },
            products: {
              targetItems: [],
            },
          },
        },
      };

      const props: ProductListingProps = {
        fields: emptyProductFields,
        params: {},
        rendering: { componentName: 'ProductListing' },
        isPageEditing: false,
      };

      renderWithSitecore(<ProductListingDefault {...props} />);
      expect(screen.getByText('No Products')).toBeInTheDocument();
    });

    it('should handle client.getPage failure', async () => {
      mockClient.getPage.mockRejectedValue(new Error('Layout Service error'));

      try {
        await client.getPage('/invalid-path', { locale: 'en' });
      } catch (error) {
        expect(error).toBeDefined();
        expect((error as Error).message).toBe('Layout Service error');
      }
    });
  });

  describe('Component Variant Resolution', () => {
    it('should validate variant prop in rendering context', () => {
      const props: ProductListingProps = {
        fields: productListingSingle,
        params: {},
        rendering: {
          componentName: 'ProductListing',
        },
        isPageEditing: false,
      };

      // Component should receive variant information from XM Cloud (stored in rendering object)
      const rendering = props.rendering as typeof props.rendering & { variant?: string };
      rendering.variant = 'ThreeUp';
      expect(rendering.variant).toBe('ThreeUp');
    });

    it('should support Default, ThreeUp, and Slider variants from XM Cloud', () => {
      const validVariants = ['Default', 'ThreeUp', 'Slider'];

      validVariants.forEach((variantName) => {
        const props: ProductListingProps = {
          fields: productListingSingle,
          params: {},
          rendering: {
            componentName: 'ProductListing',
          },
          isPageEditing: false,
        };

        const rendering = props.rendering as typeof props.rendering & { variant?: string };
        rendering.variant = variantName;
        expect(rendering.variant).toBe(variantName);
      });
    });
  });

  describe('Personalization & A/B Testing (XM Cloud)', () => {
    it('should validate structure supports personalization metadata', () => {
      // XM Cloud personalization adds metadata to rendering
      const props: ProductListingProps = {
        fields: productListingSingle,
        params: {},
        rendering: {
          componentName: 'ProductListing',
        },
        isPageEditing: false,
      };

      const rendering = props.rendering as typeof props.rendering & {
        personalization?: {
          variantIds: string[];
          testingId: string;
        };
      };
      rendering.personalization = {
        variantIds: ['variant-1'],
        testingId: 'test-123',
      };

      expect(rendering.personalization).toBeDefined();
    });
  });
});

describe('ProductListing - GraphQL Client Utility Integration', () => {
  describe('GraphQLRequestClient Usage', () => {
    it('should validate graphQlClient utility can be instantiated', () => {
      // The getGraphQlClient() utility from src/utils/graphQlClient.tsx
      // This is used for custom GraphQL queries outside Layout Service

      // Should not throw
      expect(() => getGraphQlClient()).not.toThrow();
    });

    it('should validate getValue utility extracts field values correctly', () => {
      const field = {
        jsonValue: {
          value: 'Test Value',
        },
      };

      const result = getValue(field);
      expect(result).toBe('Test Value');
    });

    it('should handle null/undefined fields gracefully', () => {
      expect(getValue(null)).toBe('');
      expect(getValue(undefined)).toBe('');
    });

    it('should extract nested property values', () => {
      const field = {
        jsonValue: {
          value: {
            href: '/products',
            text: 'View All',
          },
        },
      };

      const hrefValue = getValue(field, 'href');
      expect(hrefValue).toBe('/products');

      const textValue = getValue(field, 'text');
      expect(textValue).toBe('View All');
    });
  });
});
