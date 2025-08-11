module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Add support for .css.ts files if vanilla-extract is available
      try {
        const { VanillaExtractPlugin } = require('@vanilla-extract/webpack-plugin');
        webpackConfig.plugins.push(new VanillaExtractPlugin());
      } catch (e) {
        console.warn('Vanilla Extract plugin not available, skipping...');
      }
      return webpackConfig;
    }
  }
};
