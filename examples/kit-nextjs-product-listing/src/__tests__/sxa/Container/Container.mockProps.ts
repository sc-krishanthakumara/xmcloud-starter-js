/**
 * Test fixtures and mock data for Container component
 */

import type { ComponentParams, ComponentRendering } from '@sitecore-content-sdk/nextjs';

interface ContainerComponentProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
}

/**
 * Base mock data for Container component
 */
export const mockContainerData = {
  basicParams: {
    RenderingIdentifier: 'container-1',
    Styles: 'custom-styles',
    GridParameters: 'col-12',
    DynamicPlaceholderId: '123',
  },
  backgroundImageParams: {
    RenderingIdentifier: 'container-bg',
    Styles: 'with-background',
    GridParameters: 'col-12',
    DynamicPlaceholderId: '456',
    BackgroundImage: 'mediaurl="/-/media/image.jpg"',
  },
  tailwindContainerParams: {
    Styles: 'container',
    GridParameters: 'col-12',
    DynamicPlaceholderId: '789',
  },
  minimalParams: {
    DynamicPlaceholderId: '999',
  },
};

/**
 * Mock rendering object
 */
export const mockRendering: ComponentRendering & { params: ComponentParams } = {
  componentName: 'Container',
  dataSource: '',
  uid: 'container-uid',
  params: {},
  placeholders: {
    'container-123': [],
    'container-456': [],
    'container-789': [],
    'container-999': [],
  },
};

/**
 * Default props for Container component testing
 */
export const defaultContainerProps: ContainerComponentProps = {
  params: mockContainerData.basicParams,
  rendering: mockRendering,
};

/**
 * Props with background image
 */
export const containerPropsWithBackground: ContainerComponentProps = {
  params: mockContainerData.backgroundImageParams,
  rendering: mockRendering,
};

/**
 * Props for Tailwind container variant
 */
export const containerPropsTailwind: ContainerComponentProps = {
  params: mockContainerData.tailwindContainerParams,
  rendering: mockRendering,
};

/**
 * Props with minimal parameters
 */
export const containerPropsMinimal: ContainerComponentProps = {
  params: mockContainerData.minimalParams,
  rendering: mockRendering,
};

/**
 * Props with null parameters (edge case)
 */
export const containerPropsNullParams: ContainerComponentProps = {
  params: null as unknown as ComponentParams,
  rendering: mockRendering,
};

/**
 * Props with empty styles
 */
export const containerPropsEmptyStyles: ContainerComponentProps = {
  params: {
    ...mockContainerData.basicParams,
    Styles: '',
    GridParameters: '',
  },
  rendering: mockRendering,
};
