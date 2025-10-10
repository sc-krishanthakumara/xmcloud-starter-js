/**
 * Mock Sitecore context with sensible defaults
 * @param overrides - Partial context data to override defaults
 * @returns Mock Sitecore context object
 */
export const mockSitecoreContext = (overrides: Record<string, unknown> = {}) => ({
  page: {
    mode: {
      isEditing: false,
    },
  },
  ...overrides,
});

/**
 * Mock Sitecore context for editing mode
 */
export const mockSitecoreEditingContext = () =>
  mockSitecoreContext({
    page: {
      mode: {
        isEditing: true,
      },
    },
  });

/**
 * Mock Sitecore context for preview mode
 */
export const mockSitecorePreviewContext = () =>
  mockSitecoreContext({
    page: {
      mode: {
        isEditing: false,
        isPreview: true,
      },
    },
  });
