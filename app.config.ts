import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'FreshBooks',
  slug: 'FreshBooks',
  scheme: 'freshbooks',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  plugins: ['expo-router', '@react-native-community/datetimepicker'],
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#299737',
    imageResizeMode: 'contain'
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.belazy.FreshBooks',
    newArchEnabled: true,
    icon: './assets/icon.png',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#299737',
      dark: {
        image: './assets/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#299737'
      }
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#299737'
    },
    package: 'com.belazy.FreshBooks',
    newArchEnabled: true,
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#299737',
      dark: {
        image: './assets/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#299737'
      }
    }
  },
  web: {
    favicon: './assets/favicon.png'
  },
  experiments: {
    typedRoutes: true,
    tsconfigPaths: true,
  },
});
