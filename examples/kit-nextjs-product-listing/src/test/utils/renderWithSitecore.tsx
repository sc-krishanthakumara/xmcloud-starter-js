import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { mockSitecoreContext } from '../mocks/sitecoreContext.mock';

// Ensure jest.mock exists from jest.setup.js
const useSitecoreMock = useSitecore as jest.MockedFunction<typeof useSitecore>;

interface RenderWithSitecoreOptions extends Omit<RenderOptions, 'wrapper'> {
  sitecore?: Record<string, unknown>;
}

/**
 * Custom render function that wraps components with Sitecore context
 * @param ui - React element to render
 * @param options - Render options including Sitecore context overrides
 * @returns Render result from @testing-library/react
 *
 * @example
 * ```tsx
 * renderWithSitecore(<MyComponent />, {
 *   sitecore: { page: { mode: { isEditing: true } } }
 * });
 * ```
 */
export const renderWithSitecore = (
  ui: React.ReactElement,
  { sitecore = mockSitecoreContext(), ...options }: RenderWithSitecoreOptions = {}
) => {
  // Mock the useSitecore hook for this render
  useSitecoreMock.mockReturnValue(sitecore as never);

  return render(ui, options);
};
