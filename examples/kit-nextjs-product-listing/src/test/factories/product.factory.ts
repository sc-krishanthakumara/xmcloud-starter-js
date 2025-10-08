import type {
  ProductListingProps,
  ProductItemProps,
} from '@/components/product-listing/product-listing.props';

let productSeq = 0;

/**
 * Factory to build a single product item with sensible defaults
 * @param overrides - Partial product data to override defaults
 * @returns A complete ProductItemProps object
 */
export const buildProduct = (overrides: Partial<ProductItemProps> = {}): ProductItemProps => {
  productSeq += 1;
  const defaultProduct: ProductItemProps = {
    productName: {
      jsonValue: {
        value: `Product ${productSeq}`,
      },
    },
    productThumbnail: {
      jsonValue: {
        value: {
          src: `/images/product-${productSeq}.jpg`,
          alt: `Product ${productSeq}`,
          width: 400,
          height: 300,
        },
      },
    },
    productBasePrice: {
      jsonValue: {
        value: `$${(100 + productSeq * 10).toFixed(2)}`,
      },
    },
    productFeatureTitle: {
      jsonValue: {
        value: 'Feature Title',
      },
    },
    productFeatureText: {
      jsonValue: {
        value: 'Feature description text',
      },
    },
    productDrivingRange: {
      jsonValue: {
        value: '10 hours',
      },
    },
    url: {
      url: `/products/product-${productSeq}`,
      path: `/products/product-${productSeq}`,
    },
  };

  // Deep merge overrides (simple implementation for our use case)
  return {
    ...defaultProduct,
    ...overrides,
  } as ProductItemProps;
};

/**
 * Factory to build complete ProductListing fields with multiple products
 * @param itemCount - Number of products to generate
 * @param overrides - Partial field data to override defaults
 * @returns Complete ProductListingFields object
 */
export const buildProductListingFields = (
  itemCount = 1,
  overrides: Partial<ProductListingProps['fields']> = {}
): ProductListingProps['fields'] => {
  const items = Array.from({ length: itemCount }, () => buildProduct());

  const defaultFields: ProductListingProps['fields'] = {
    data: {
      datasource: {
        title: {
          jsonValue: {
            value: 'Our Featured Products',
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
          targetItems: items,
        },
      },
    },
  };

  // Simple merge - override products if provided
  if (overrides.data?.datasource?.products) {
    defaultFields.data.datasource.products = overrides.data.datasource.products;
  }

  if (overrides.data?.datasource?.title) {
    defaultFields.data.datasource.title = overrides.data.datasource.title;
  }

  if (overrides.data?.datasource?.viewAllLink) {
    defaultFields.data.datasource.viewAllLink = overrides.data.datasource.viewAllLink;
  }

  return defaultFields;
};

/**
 * Factory to build ProductListing component props
 * @param overrides - Partial props to override defaults
 * @returns Complete ProductListingProps object
 */
export const buildProductListingProps = (
  overrides: Partial<ProductListingProps> = {}
): ProductListingProps => {
  return {
    fields: buildProductListingFields(),
    params: {},
    isPageEditing: false,
    rendering: {
      componentName: 'ProductListing',
    },
    ...overrides,
  };
};

/**
 * Reset the product sequence counter (useful for predictable test data)
 */
export const resetProductSequence = () => {
  productSeq = 0;
};
