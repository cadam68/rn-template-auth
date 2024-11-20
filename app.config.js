import "dotenv/config";

// console.log('EAS_PROJECT_ID:', process.env.EAS_PROJECT_ID);
export default {
  expo: {
    name: "rn-auth",
    slug: "rn-auth",
    privacy: "public",
    newArchEnabled: true,
    platforms: ["ios", "android"],
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.jpg",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      icon: "./assets/icon.png",
      bundleIdentifier: "com.ca-inline.template-auth",
      buildNumber: "1.0.0",
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.ca_inline.template-auth",
      versionCode: 100,
    },
    plugins: ["expo-secure-store"],
    extra: {
      eas: {
        projectId: process.env.EAS_PROJECT_ID,
      },
    },
  },
};