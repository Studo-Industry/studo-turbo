/** @type {import("@babel/core").ConfigFunction} */
module.exports = function (api) {
  // process.env.EXPO_ROUTER_APP_ROOT = '../../apps/expo/app';

  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
