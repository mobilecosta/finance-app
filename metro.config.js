const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Definitively ignore the react-native-css-interop cache folder
// This folder is generated during build and often causes SHA-1 mismatch errors in CI
if (config.resolver) {
  config.resolver.blockList = [
    /node_modules\/react-native-css-interop\/\.cache\/.*/,
    /node_modules\/.*\/node_modules\/react-native-css-interop\/\.cache\/.*/,
  ];
}

module.exports = withNativeWind(config, {
  input: "./global.css",
  // Only write to file system in development to avoid build artifacts issues in CI
  forceWriteFileSystem: process.env.NODE_ENV === "development",
});
