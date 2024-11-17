import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

import usePreventAutoHide from "./src/hooks/usePreventAutoHide";
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import SplashScreen from "./src/screens/SplashScreen";
import AboutUsScreen from "./src/screens/AboutUsScreen";

import { Colors } from "./src/constants/styles";
import AppContextProvider, { useAppContext } from "./src/context/AppContext";
import AuthContextProvider, { useAuthContext } from "./src/context/AuthContext";
import IconButton from "./src/components/ui/IconButton";
import DefaultService, { init as initDefaultService, IMAGES } from "./src/config/default";
import LogService, { init as initLogService } from "./src/util/LogService";
import { init as initFetchService } from "./src/util/FetchService";
import soundLibrary from "./src/config/soundLibrary";
import AudioPlayer from "./src/util/AudioPlayer";
import { UTILS } from "./src/util/tools";
import { Asset } from "expo-asset";
import ErrorScreen from "./src/screens/ErrorScreen";

const Stack = createNativeStackNavigator();
const logger = LogService.Log("App");

// Main App Component
const App = () => {
  const { basicDataService } = useAppContext();
  const authCtx = useAuthContext();

  // Manage display of animation splash screen
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  // Function to initialize app resources
  const initializeApp = async () => {
    try {
      logger.debug("Initializing services...");
      await initDefaultService();
      await initLogService(DefaultService);
      await initFetchService(DefaultService);
      logger.debug("Initializing audio...");
      await AudioPlayer.initializeAudio();
      const soundLoadPromises = AudioPlayer.load(soundLibrary);
      await Promise.all(soundLoadPromises);
      logger.debug("Preload local images...");
      const imageAssets = Object.values(IMAGES).map(image => Asset.fromModule(image).downloadAsync());
      await Promise.all(imageAssets);
      logger.debug("Loading basic data...");
      await basicDataService.loadBasicData();
      logger.debug("AutoLogging...");
      await authCtx.autoLogging();
      await UTILS.wait(1);
      logger.debug("App ready");
    } catch (error) {
      logger.error("Error initializing app " + error.message);
    }
  };

  // Auto-login logic
  const handleAutoLogin = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        await appCtx.setCredential(storedToken); // Ensures credentials setup
      }
    } catch (error) {
      logger.error("Auto-login failed:", error);
    }
  };

  const headerStyle = {
    headerStyle: { backgroundColor: Colors.primary500 },
    headerTintColor: "white",
    contentStyle: { backgroundColor: Colors.primary100 },
    animation: "none",
    // headerBackVisible: false,
  };

  const buildHeaderOptions = (navigation, target, iconName = "information-circle-outline") => ({
    headerRight: ({ tintColor }) => <IconButton icon={iconName} color={tintColor} size={24} onPress={() => navigation.navigate(target)} />,
  });

  const headerOptions = {
    headerRight: ({ tintColor }) => <IconButton icon="exit" color={tintColor} size={24} onPress={() => authCtx.logout()} />,
  };

  // Initialisation
  const isAppReady = usePreventAutoHide(initializeApp);

  // Show system splash screen while loading resources
  if (!isAppReady) return null;
  if (!basicDataService.basicData || basicDataService.basicData?.maintenanceMessage)
    return (
      <ErrorScreen
        message={basicDataService.basicData?.maintenanceMessage ?? "Unable to connect to the server.\n\nPlease check your internet connection or try again later. \n\nIf the issue persists, the application may be undergoing maintenance."}
      />
    );

  // Show main app navigation
  return (
    <NavigationContainer>
      {showSplashScreen && <SplashScreen onClose={() => setShowSplashScreen(false)} />}
      {!showSplashScreen && !authCtx.isAuthenticated && (
        <Stack.Navigator initialRouteName="Login" screenOptions={({ navigation }) => ({ ...headerStyle, ...buildHeaderOptions(navigation, "AboutUs") })}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="AboutUs" component={AboutUsScreen} options={{ headerRight: null }} />
        </Stack.Navigator>
      )}
      {!showSplashScreen && authCtx.isAuthenticated && (
        <Stack.Navigator initialRouteName="Welcome" screenOptions={headerStyle}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} options={headerOptions} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

// Application Context Wrapper
export default () => {
  return (
    <>
      <StatusBar style="light" />
      <AppContextProvider>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </AppContextProvider>
    </>
  );
};
