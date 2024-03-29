const path = require('path');

module.exports = {
  // output: 'export',
  // distDir: 'build',
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')]
  },
  webpack: config => {
    // camelCase style names from css modules
    config.module.rules
      .find(({ oneOf }) => !!oneOf)
      .oneOf.filter(({ use }) => JSON.stringify(use)?.includes('css-loader'))
      .reduce((acc, { use }) => acc.concat(use), [])
      .forEach(({ options }) => {
        if (options.modules) {
          options.modules.exportLocalsConvention = 'camelCase';
        }
      });

    return config;
  },
  reactStrictMode: false
};
