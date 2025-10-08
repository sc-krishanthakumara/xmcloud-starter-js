// Mock lucide-react icons
const React = require('react');

const createMockIcon = (name) => {
  const MockIcon = (props) => React.createElement('svg', { ...props, 'data-testid': name }, name);
  MockIcon.displayName = name;
  return MockIcon;
};

module.exports = {
  ChevronLeft: createMockIcon('ChevronLeft'),
  ChevronRight: createMockIcon('ChevronRight'),
  X: createMockIcon('X'),
  Menu: createMockIcon('Menu'),
  Search: createMockIcon('Search'),
  ArrowRight: createMockIcon('ArrowRight'),
  ArrowLeft: createMockIcon('ArrowLeft'),
  Plus: createMockIcon('Plus'),
  Minus: createMockIcon('Minus'),
  Check: createMockIcon('Check'),
  // Add more icons as needed
};
