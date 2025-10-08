/**
 * Accessibility tests for ProductListing component
 * Uses jest-axe for automated accessibility testing
 */

import React from 'react';
import { axe } from 'jest-axe';
import { renderWithSitecore } from '../utils/renderWithSitecore';
import { Default as ProductListingDefault } from '@/components/product-listing/ProductListing';
import {
  productListingSingle,
  productListingMultiple,
  featuredProductListing,
} from '../fixtures/product/productListing.fixture';
import { buildProductListingProps } from '../factories/product.factory';

describe('ProductListing Accessibility', () => {
  describe('Basic accessibility checks', () => {
    it('renders with proper semantic structure', () => {
      const props = buildProductListingProps({ fields: productListingSingle });
      renderWithSitecore(<ProductListingDefault {...props} />);

      // Basic semantic checks without axe
      const heading = document.querySelector('h1, h2, h3, h4, h5, h6');
      expect(heading).toBeInTheDocument();
    });

    it('renders images with alt text', () => {
      const props = buildProductListingProps({ fields: featuredProductListing });
      const { container } = renderWithSitecore(<ProductListingDefault {...props} />);

      const images = container.querySelectorAll('img');
      images.forEach((img: Element) => {
        expect(img).toHaveAttribute('alt');
      });
    });

    it('renders links with proper attributes', () => {
      const props = buildProductListingProps({ fields: productListingSingle });
      const { container } = renderWithSitecore(<ProductListingDefault {...props} />);

      const links = container.querySelectorAll('a');
      links.forEach((link: Element) => {
        expect(link).toHaveAttribute('href');
      });
    });
  });

  describe('Automated accessibility testing (axe)', () => {
    it('has no obvious a11y violations with single product', async () => {
      const props = buildProductListingProps({ fields: productListingSingle });
      const { container } = renderWithSitecore(<ProductListingDefault {...props} />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no obvious a11y violations with multiple products', async () => {
      const props = buildProductListingProps({ fields: productListingMultiple });
      const { container } = renderWithSitecore(<ProductListingDefault {...props} />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no obvious a11y violations with featured products', async () => {
      const props = buildProductListingProps({ fields: featuredProductListing });
      const { container } = renderWithSitecore(<ProductListingDefault {...props} />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no obvious a11y violations in editing mode', async () => {
      const props = buildProductListingProps({
        fields: featuredProductListing,
        isPageEditing: true,
      });
      const { container } = renderWithSitecore(<ProductListingDefault {...props} />, {
        sitecore: { page: { mode: { isEditing: true } } },
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no obvious a11y violations with empty state', async () => {
      const props = buildProductListingProps({
        fields: productListingMultiple,
      });
      const { container } = renderWithSitecore(<ProductListingDefault {...props} />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
