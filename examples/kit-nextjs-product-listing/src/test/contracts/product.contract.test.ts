import {
  productListingSingle,
  productListingMultiple,
} from '../fixtures/product/productListing.fixture';

/**
 * Contract tests validate the shape and structure of data
 * These tests catch breaking changes in Sitecore field schemas
 */
describe('Product Listing Content Contract', () => {
  describe('Product fields structure', () => {
    it('validates all products have required name field', () => {
      const items = productListingSingle.data.datasource.products?.targetItems || [];
      items.forEach((item) => {
        expect(item.productName?.jsonValue?.value).toBeDefined();
        expect(typeof item.productName?.jsonValue?.value).toBe('string');
      });
    });

    it('validates all products have required thumbnail field', () => {
      const items = productListingSingle.data.datasource.products?.targetItems || [];
      items.forEach((item) => {
        expect(item.productThumbnail?.jsonValue?.value).toBeDefined();
        expect(item.productThumbnail?.jsonValue?.value?.src).toBeDefined();
        expect(item.productThumbnail?.jsonValue?.value?.alt).toBeDefined();
      });
    });

    it('validates all products have price field', () => {
      const items = productListingSingle.data.datasource.products?.targetItems || [];
      items.forEach((item) => {
        expect(item.productBasePrice?.jsonValue?.value).toBeDefined();
        expect(typeof item.productBasePrice?.jsonValue?.value).toBe('string');
      });
    });

    it('validates all products have valid URL structure', () => {
      const items = productListingSingle.data.datasource.products?.targetItems || [];
      items.forEach((item) => {
        expect(item.url?.url).toBeDefined();
        expect(item.url?.url).toMatch(/^\/products\//);
      });
    });
  });

  describe('Datasource structure', () => {
    it('validates title field exists', () => {
      expect(productListingSingle.data.datasource.title).toBeDefined();
      expect(productListingSingle.data.datasource.title?.jsonValue?.value).toBeDefined();
    });

    it('validates viewAllLink field exists', () => {
      expect(productListingSingle.data.datasource.viewAllLink).toBeDefined();
      expect(
        productListingSingle.data.datasource.viewAllLink?.jsonValue?.value?.href
      ).toBeDefined();
      expect(
        productListingSingle.data.datasource.viewAllLink?.jsonValue?.value?.text
      ).toBeDefined();
    });

    it('validates products collection exists', () => {
      expect(productListingSingle.data.datasource.products).toBeDefined();
      expect(Array.isArray(productListingSingle.data.datasource.products?.targetItems)).toBe(true);
    });
  });

  describe('Multiple products contract', () => {
    it('validates all products in collection have required fields', () => {
      const items = productListingMultiple.data.datasource.products?.targetItems || [];
      expect(items.length).toBeGreaterThan(1);

      items.forEach((item) => {
        // Required fields check
        expect(item.productName?.jsonValue?.value).toBeDefined();
        expect(item.productThumbnail?.jsonValue?.value?.src).toBeDefined();
        expect(item.productBasePrice?.jsonValue?.value).toBeDefined();
        expect(item.url?.url).toBeDefined();
      });
    });
  });
});
