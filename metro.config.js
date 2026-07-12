const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Fix for Vercel build error: Failed to get the SHA-1 for react-native-css-interop cache
// We exclude the .cache directory from Metro's watch list and resolver
if (config.resolver) {
  config.resolver.blockList = [
    /node_modules\/react-native-css-interop\/\.cache\/.*/,
  ];
}

module.exports = withNativeWind(config, {
  input: "./global.css",
  // Force write CSS to file system instead of virtual modules
  // This fixes iOS styling issues in development mode
  forceWriteFileSystem: true,
});
