import React from 'react';
import { render, screen } from '@testing-library/react';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { Default as ProductListingDefault } from '../ProductListing';
import type { ProductListingProps } from '../product-listing.props';

// Mock the Sitecore hook
jest.mock('@sitecore-content-sdk/nextjs');
const mockUseSitecore = useSitecore as jest.MockedFunction<typeof useSitecore>;

describe('ProductListing Component - Default Variant', () => {
  // Mock data that matches the expected structure
  const mockFields: ProductListingProps['fields'] = {
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
          targetItems: [
            {
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
            },
          ],
        },
      },
    },
  };

  const mockProps: ProductListingProps = {
    fields: mockFields,
    params: {},
    isPageEditing: false,
    rendering: {
      componentName: 'ProductListing',
    },
  };

  beforeEach(() => {
    // Mock the useSitecore hook to return editing mode status
    mockUseSitecore.mockReturnValue({
      page: {
        mode: {
          isEditing: false,
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component with product title', () => {
    render(<ProductListingDefault {...mockProps} />);

    // Check if the title is rendered
    const titleElement = screen.getByText('Our Featured Products');
    expect(titleElement).toBeInTheDocument();
  });

  it('should pass isPageEditing prop correctly when in editing mode', () => {
    // Update mock to simulate editing mode
    mockUseSitecore.mockReturnValue({
      page: {
        mode: {
          isEditing: true,
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const editingProps: ProductListingProps = {
      ...mockProps,
      isPageEditing: true,
    };

    render(<ProductListingDefault {...editingProps} />);

    // Component should still render with title
    expect(screen.getByText('Our Featured Products')).toBeInTheDocument();
  });

  it('should handle empty products array gracefully', () => {
    const emptyProductsProps: ProductListingProps = {
      ...mockProps,
      fields: {
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
      },
    };

    render(<ProductListingDefault {...emptyProductsProps} />);

    // Should render title even with no products
    expect(screen.getByText('No Products Available')).toBeInTheDocument();
  });

  it('should render with custom params styles', () => {
    const propsWithStyles: ProductListingProps = {
      ...mockProps,
      params: {
        styles: 'custom-class',
      },
    };

    const { container } = render(<ProductListingDefault {...propsWithStyles} />);

    // Check if custom class is applied
    const componentContainer = container.querySelector('.custom-class');
    expect(componentContainer).toBeInTheDocument();
  });
});
