import { API_URL, API_KEY, API_SECURE_KEY, API_DEVICE_KEY } from "@env";
import * as SecureStore from "expo-secure-store";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { STORAGE, UTILS } from "../util/tools";
import { Dimensions } from "react-native";

// Define and retrieve environment variables
let deviceId;
let inputs = {};

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export const IMAGES = {
  AuthContent: require("./../../assets/images/login.jpg"),
  WelcomeScreen: require("./../../assets/images/background2.jpg"),
  SplashScreen: require("./../../assets/images/crayons.jpg"),
  SplashScreen_subject: require("./../../assets/images/clavier.png"),
  ErrorScreen: require("./../../assets/images/404.jpg"),
  AdamCyril: require("./../../assets/images/AdamCyril.jpg"),
  Splash: require("./../../assets/splash.jpg"),
};

export const init = async () => {
  // generate & retrieve the deviceId
  let storedId = await SecureStore.getItemAsync("device-id");
  if (!storedId) {
    storedId = "id-" + Date.now() + "-" + Math.floor(Math.random() * 10000);
    await SecureStore.setItemAsync("device-id", storedId);
  }
  deviceId = storedId;

  // retrieve inputs from localStorage
  inputs = { ...(await STORAGE.getItem("inputs")) };
};

const DefaultService = {
  // --- authentication ---
  apiUrl: UTILS.getEnvVariable("API_URL", API_URL),
  apiKey: UTILS.getEnvVariable("API_KEY", API_KEY),
  apiSecureKey: UTILS.getEnvVariable("API_SECURE_KEY", API_SECURE_KEY),
  apiDeviceKey: UTILS.getEnvVariable("API_DEVICE_KEY", API_DEVICE_KEY),
  getDeviceId: () => deviceId,
  appName: "portfolio",
  loginRestrictedProfile: "USER",
  refreshTokenInterval: 15,
  // --- environment properties ---
  environment: {
    isExpoGo: !!Constants.expoVersion, // Running in Expo Go
    // isExpoGo: Constants.appOwnership === "expo",  (depreciated)
    isDevice: Device.isDevice, // Running on a physical device (not a simulator)
    isSimulator: !Device.isDevice && Constants.platform.ios !== undefined,
  },
  // --- business properties ---
  getInput: key => {
    return inputs[key];
  },
  setInput: (key, value) => {
    inputs = { ...inputs, [key]: value };
    STORAGE.setItem("inputs", inputs);
  },
};

export default DefaultService;
