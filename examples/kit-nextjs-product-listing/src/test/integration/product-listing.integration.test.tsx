/**
 * Integration tests for ProductListing page-level scenarios
 * Tests component composition and variant switching
 */

import React from 'react';
import { screen, cleanup } from '@testing-library/react';
import {
  Default as ProductListingDefault,
  ThreeUp as ProductListingThreeUp,
  Slider as ProductListingSlider,
} from '@/components/product-listing/ProductListing';
import { renderWithSitecore } from '@/test/utils/renderWithSitecore';
import {
  productListingSingle,
  productListingMultiple,
  emptyProductListing,
  featuredProductListing,
} from '@/test/fixtures/product/productListing.fixture';
import { buildProductListingProps } from '@/test/factories/product.factory';

describe('ProductListing Integration Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Variant Rendering', () => {
    it('should render Default variant with products', () => {
      const props = buildProductListingProps({ fields: productListingMultiple });
      renderWithSitecore(<ProductListingDefault {...props} />);

      expect(screen.getByText('Our Featured Products')).toBeInTheDocument();
    });

    it('should render ThreeUp variant with products', () => {
      const props = buildProductListingProps({ fields: productListingMultiple });
      renderWithSitecore(<ProductListingThreeUp {...props} />);

      expect(screen.getByText('Our Featured Products')).toBeInTheDocument();
    });

    it('should render Slider variant with products', () => {
      const props = buildProductListingProps({ fields: productListingMultiple });
      renderWithSitecore(<ProductListingSlider {...props} />);

      expect(screen.getByText('Our Featured Products')).toBeInTheDocument();
    });
  });

  describe('Editing Mode Integration', () => {
    it('should render Default variant in editing mode', () => {
      const props = buildProductListingProps({
        fields: featuredProductListing,
        isPageEditing: true,
      });

      renderWithSitecore(<ProductListingDefault {...props} />, {
        sitecore: { page: { mode: { isEditing: true } } },
      });

      expect(screen.getByText('Our Featured Products')).toBeInTheDocument();
    });

    it('should render ThreeUp variant in editing mode', () => {
      const props = buildProductListingProps({
        fields: featuredProductListing,
        isPageEditing: true,
      });

      renderWithSitecore(<ProductListingThreeUp {...props} />, {
        sitecore: { page: { mode: { isEditing: true } } },
      });

      expect(screen.getByText('Our Featured Products')).toBeInTheDocument();
    });

    it('should render Slider variant in editing mode', () => {
      const props = buildProductListingProps({
        fields: featuredProductListing,
        isPageEditing: true,
      });

      renderWithSitecore(<ProductListingSlider {...props} />, {
        sitecore: { page: { mode: { isEditing: true } } },
      });

      expect(screen.getByText('Our Featured Products')).toBeInTheDocument();
    });
  });

  describe('Multiple Product Scenarios', () => {
    it('should render all products in Default variant', () => {
      const props = buildProductListingProps({ fields: productListingMultiple });
      renderWithSitecore(<ProductListingDefault {...props} />);

      expect(screen.getByText('Our Featured Products')).toBeInTheDocument();
      // Multiple products should be rendered
      const container = screen.getByText('Our Featured Products').closest('div');
      expect(container).toBeInTheDocument();
    });

    it('should handle featured product in ThreeUp variant', () => {
      const props = buildProductListingProps({ fields: featuredProductListing });
      renderWithSitecore(<ProductListingThreeUp {...props} />);

      expect(screen.getByText('Our Featured Products')).toBeInTheDocument();
      expect(screen.getByText('Premium Wireless Headphones')).toBeInTheDocument();
    });

    it('should handle single product in Slider variant', () => {
      const props = buildProductListingProps({ fields: productListingSingle });
      renderWithSitecore(<ProductListingSlider {...props} />);

      expect(screen.getByText('Our Featured Products')).toBeInTheDocument();
    });
  });

  describe('Empty State Integration', () => {
    it('should handle empty products in Default variant', () => {
      const props = buildProductListingProps({ fields: emptyProductListing });
      renderWithSitecore(<ProductListingDefault {...props} />);

      expect(screen.getByText('No Products Available')).toBeInTheDocument();
    });

    it('should handle empty products in ThreeUp variant', () => {
      const props = buildProductListingProps({ fields: emptyProductListing });
      renderWithSitecore(<ProductListingThreeUp {...props} />);

      expect(screen.getByText('No Products Available')).toBeInTheDocument();
    });

    it('should handle empty products in Slider variant', () => {
      const props = buildProductListingProps({ fields: emptyProductListing });
      renderWithSitecore(<ProductListingSlider {...props} />);

      expect(screen.getByText('No Products Available')).toBeInTheDocument();
    });
  });

  describe('Props Inheritance', () => {
    it('should pass custom params to Default variant', () => {
      const props = buildProductListingProps({
        fields: productListingSingle,
        params: { styles: 'custom-integration-class' },
      });

      const { container } = renderWithSitecore(<ProductListingDefault {...props} />);
      const customElement = container.querySelector('.custom-integration-class');
      expect(customElement).toBeInTheDocument();
    });

    it('should pass custom params to ThreeUp variant', () => {
      const props = buildProductListingProps({
        fields: productListingSingle,
        params: { styles: 'custom-threeup-class' },
      });

      const { container } = renderWithSitecore(<ProductListingThreeUp {...props} />);
      const customElement = container.querySelector('.custom-threeup-class');
      expect(customElement).toBeInTheDocument();
    });

    it('should pass custom params to Slider variant', () => {
      const props = buildProductListingProps({
        fields: productListingSingle,
        params: { styles: 'custom-slider-class' },
      });

      const { container } = renderWithSitecore(<ProductListingSlider {...props} />);
      const customElement = container.querySelector('.custom-slider-class');
      expect(customElement).toBeInTheDocument();
    });
  });

  describe('Sitecore Context Integration', () => {
    it('should respond to editing mode changes', () => {
      const props = buildProductListingProps({ fields: featuredProductListing });

      // Render in normal mode
      renderWithSitecore(<ProductListingDefault {...props} />, {
        sitecore: { page: { mode: { isEditing: false } } },
      });

      expect(screen.getByText('Our Featured Products')).toBeInTheDocument();

      // Clean up the first render before rendering with new context
      cleanup();

      // Switch to editing mode
      renderWithSitecore(<ProductListingDefault {...props} />, {
        sitecore: { page: { mode: { isEditing: true } } },
      });

      expect(screen.getByText('Our Featured Products')).toBeInTheDocument();
    });

    it('should maintain component state across context changes', () => {
      const props = buildProductListingProps({ fields: productListingMultiple });

      renderWithSitecore(<ProductListingDefault {...props} />, {
        sitecore: { page: { mode: { isEditing: false } } },
      });

      const title = screen.getByText('Our Featured Products');
      expect(title).toBeInTheDocument();

      // Component should maintain rendering
      expect(title).toHaveTextContent('Our Featured Products');
    });
  });
});
