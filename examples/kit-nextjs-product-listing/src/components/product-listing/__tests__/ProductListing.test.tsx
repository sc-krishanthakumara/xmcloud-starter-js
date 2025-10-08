import React from 'react';
import { screen } from '@testing-library/react';
import { Default as ProductListingDefault } from '../ProductListing';
import type { ProductListingProps } from '../product-listing.props';
import { renderWithSitecore } from '@/test/utils/renderWithSitecore';
import {
  productListingSingle,
  emptyProductListing,
  featuredProductListing,
} from '@/test/fixtures/product/productListing.fixture';
import { buildProductListingProps } from '@/test/factories/product.factory';

describe('ProductListing Component - Default Variant', () => {
  const baseProps: ProductListingProps = buildProductListingProps({
    fields: productListingSingle,
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render the component with product title', () => {
      renderWithSitecore(<ProductListingDefault {...baseProps} />);

      // Check if the title is rendered
      const titleElement = screen.getByText('Our Featured Products');
      expect(titleElement).toBeInTheDocument();
    });

    it('should render with featured product data', () => {
      const props = buildProductListingProps({ fields: featuredProductListing });
      renderWithSitecore(<ProductListingDefault {...props} />);

      expect(screen.getByText('Our Featured Products')).toBeInTheDocument();
      expect(screen.getByText('Premium Wireless Headphones')).toBeInTheDocument();
    });
  });

  describe('Editing Mode', () => {
    it('should pass isPageEditing prop correctly when in editing mode', () => {
      const editingProps = buildProductListingProps({
        fields: productListingSingle,
        isPageEditing: true,
      });

      renderWithSitecore(<ProductListingDefault {...editingProps} />, {
        sitecore: { page: { mode: { isEditing: true } } },
      });

      // Component should still render with title
      expect(screen.getByText('Our Featured Products')).toBeInTheDocument();
    });
  });

  describe('Empty States', () => {
    it('should handle empty products array gracefully', () => {
      const emptyProps = buildProductListingProps({ fields: emptyProductListing });

      renderWithSitecore(<ProductListingDefault {...emptyProps} />);

      // Should render title even with no products
      expect(screen.getByText('No Products Available')).toBeInTheDocument();
    });
  });

  describe('Custom Styles', () => {
    it('should render with custom params styles', () => {
      const propsWithStyles = buildProductListingProps({
        fields: productListingSingle,
        params: { styles: 'custom-class' },
      });

      const { container } = renderWithSitecore(<ProductListingDefault {...propsWithStyles} />);

      // Check if custom class is applied
      const componentContainer = container.querySelector('.custom-class');
      expect(componentContainer).toBeInTheDocument();
    });
  });
});
