// Mock implementation of change-case module
module.exports = {
  kebabCase: (str) => {
    if (!str) return '';
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  },
  camelCase: (str) => {
    if (!str) return '';
    return str
      .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
      .replace(/^[A-Z]/, (c) => c.toLowerCase());
  },
  pascalCase: (str) => {
    if (!str) return '';
    return str
      .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
      .replace(/^[a-z]/, (c) => c.toUpperCase());
  },
  snakeCase: (str) => {
    if (!str) return '';
    return str
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/[\s-]+/g, '_')
      .toLowerCase();
  },
};
