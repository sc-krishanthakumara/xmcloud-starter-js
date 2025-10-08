import type { ProductListingProps } from '@/components/product-listing/product-listing.props';
import { buildProductListingFields, buildProduct } from '../../factories/product.factory';

/**
 * Single product listing fixture - minimal case
 */
export const productListingSingle: ProductListingProps['fields'] = buildProductListingFields(1);

/**
 * Multiple products listing fixture
 */
export const productListingMultiple: ProductListingProps['fields'] = buildProductListingFields(3);

/**
 * Empty products listing fixture
 */
export const emptyProductListing: ProductListingProps['fields'] = buildProductListingFields(0, {
  data: {
    datasource: {
      title: {
        jsonValue: {
          value: 'No Products Available',
        },
      },
      viewAllLink: {
        jsonValue: {
          value: {
            href: '',
            text: '',
          },
        },
      },
    },
  },
});

/**
 * Rich product listing with custom data
 */
export const featuredProductListing: ProductListingProps['fields'] = {
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
            text: 'View All Products',
          },
        },
      },
      products: {
        targetItems: [
          buildProduct({
            productName: {
              jsonValue: {
                value: 'Premium Wireless Headphones',
              },
            },
            productThumbnail: {
              jsonValue: {
                value: {
                  src: '/images/headphones.jpg',
                  alt: 'Premium Wireless Headphones',
                  width: 400,
                  height: 300,
                },
              },
            },
            productBasePrice: {
              jsonValue: {
                value: '$299.99',
              },
            },
            productFeatureTitle: {
              jsonValue: {
                value: 'Active Noise Cancellation',
              },
            },
            productFeatureText: {
              jsonValue: {
                value: 'Industry-leading noise cancellation technology',
              },
            },
            productDrivingRange: {
              jsonValue: {
                value: '30 hours battery life',
              },
            },
            url: {
              url: '/products/wireless-headphones',
              path: '/products/wireless-headphones',
            },
          }),
        ],
      },
    },
  },
};
