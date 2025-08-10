// Performance optimization configuration
module.exports = {
  // Webpack optimizations for production builds
  webpack: {
    configure: (webpackConfig, { env }) => {
      if (env === 'production') {
        // Bundle splitting for better caching
        webpackConfig.optimization.splitChunks = {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              enforce: true,
            }
          }
        };
      }
      return webpackConfig;
    },
  },
  // Development server configuration
  devServer: {
    port: 3001,
    hot: true,
    compress: true
  }
};
