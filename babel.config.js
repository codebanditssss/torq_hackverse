module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Enable path aliases
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@': '.',
            '@components': './components',
            '@screens': './app',
            '@services': './services',
            '@store': './store',
            '@config': './config',
            '@utils': './utils',
          },
        },
      ],
      'react-native-paper/babel',
    ],
    env: {
      production: {
        plugins: ['react-native-paper/babel'],
      },
    },
  };
};
