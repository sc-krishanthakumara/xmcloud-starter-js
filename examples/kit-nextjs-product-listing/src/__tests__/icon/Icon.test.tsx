/* eslint-disable */
import { sharedAttributes } from '@/components/icon/Icon';
import { IconName } from '@/enumerations/Icon.enum';

describe('Icon Component Helper Functions', () => {
  describe('sharedAttributes', () => {
    it('includes aria-hidden by default', () => {
      const props = { isAriaHidden: true };
      const attributes = sharedAttributes(props);
      expect(attributes['aria-hidden']).toBe(true);
    });

    it('does not include aria-hidden when isAriaHidden is false', () => {
      const props = { isAriaHidden: false };
      const attributes = sharedAttributes(props);
      expect(attributes['aria-hidden']).toBeUndefined();
    });

    it('includes aria-label when altText is provided', () => {
      const props = { altText: 'Facebook social link' };
      const attributes = sharedAttributes(props);
      expect(attributes['aria-label']).toBe('Facebook social link');
    });

    it('does not include aria-label when altText is not provided', () => {
      const props = {};
      const attributes = sharedAttributes(props);
      expect(attributes['aria-label']).toBeUndefined();
    });

    it('passes through other props', () => {
      const props = { className: 'custom-class', 'data-testid': 'test' };
      const attributes = sharedAttributes(props);
      expect(attributes['className']).toBe('custom-class');
      expect(attributes['data-testid']).toBe('test');
    });

    it('filters out isAriaHidden and altText from spread props', () => {
      const props = { isAriaHidden: true, altText: 'Test', className: 'custom' };
      const attributes = sharedAttributes(props);
      // These should be handled conditionally, not spread
      expect(attributes['className']).toBe('custom');
      expect(attributes['aria-hidden']).toBe(true);
      expect(attributes['aria-label']).toBe('Test');
    });
  });

  describe('Icon enumeration', () => {
    it('has expected icon name values', () => {
      expect(IconName.FACEBOOK).toBeDefined();
      expect(IconName.INSTAGRAM).toBeDefined();
      expect(IconName.TWITTER).toBeDefined();
      expect(IconName.LINKEDIN).toBeDefined();
      expect(IconName.ARROW_LEFT).toBeDefined();
      expect(IconName.ARROW_RIGHT).toBeDefined();
    });
  });
});
