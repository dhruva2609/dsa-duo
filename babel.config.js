module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // We removed "plugins" array to stop the crash
  };
};