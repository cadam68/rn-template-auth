import LogService from "./LogService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

let config = {};
const logger = LogService.Log("FetchService");

const getHeaders = async (sendToken = false, contentType = "application/json") => {
  try {
    const headers = {
      "Content-Type": contentType,
      "X-API-KEY": config.apiKey,
      "X-SECURE-KEY": config.apiSecureKey,
      "X-API-DEVICE-KEY": config.apiDeviceKey,
      "X-DEVICE-ID": config.deviceId,
    };

    if (sendToken) {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        logger.warn("Token is missing");
      }
    }

    return headers;
  } catch (error) {
    logger.error("Error getting headers:", error);
    throw error;
  }
};

const fetchFormData = async (method, data, route, sendToken = false, abortCtrl = new AbortController()) => {
  const headers = await getHeaders(sendToken);
  let result, response;

  logger.debug(`perform fetch().method=[${method}].route=[${config.apiUrl}/${route}]`);
  try {
    response = await fetch(`${config.apiUrl}/${route}`, {
      method: data ? "POST" : method ?? "GET",
      headers,
      signal: abortCtrl.signal,
      body: !data || method == "POST" ? JSON.stringify(data) : undefined,
    });

    const contentType = response.headers.get("Content-Type") || "";
    const isJson = contentType.includes("application/json");
    result = isJson ? await response.json() : { message: await response.text() };

    if (!response.ok) {
      const errorMessage = result.message || "Something went wrong with fetching";
      console.debug(`Error in fetchFormData, result = ${JSON.stringify(result)}`);
      console.error(`Error in fetchFormData: ${errorMessage}`);
      const error = new Error(errorMessage);
      const errorDetail = {
        route: route,
        data: data,
        status: response?.status,
        ok: response?.ok,
        response: result,
      };
      error.fetch = errorDetail;
      throw error;
    }

    return result;
  } catch (error) {
    if (error.name === "AbortError") {
      console.warn("Fetch aborted");
    } else {
      console.error("Fetch error:", error.message);
    }
    throw error;
  }
};

const fetchLog = async (logLevel, module, text, abortCtrl = new AbortController()) => {
  return fetchFormData("POST", { logLevel, module, text }, "log", false, abortCtrl);
};

const fetchSignup = async (userid, password, email, abortCtrl = new AbortController()) => {
  return fetchFormData("POST", { userid, password, email }, "auth/signup", false, abortCtrl);
};

const fetchLogin = async (userid, password, abortCtrl = new AbortController()) => {
  return fetchFormData("POST", { userid, password }, "auth/login", false, abortCtrl);
};

const fetchLoadBasicData = async (abortCtrl = new AbortController()) => {
  return fetchFormData("GET", undefined, "basicData", false, abortCtrl);
};

const fetchRefreshToken = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) return false;

    const decodedToken = jwtDecode(token);
    logger.debug(`Current token being sent: ${JSON.stringify(decodedToken)}`);

    // Calculate the remaining time until expiration in seconds
    const currentTime = Math.floor(Date.now() / 1000);
    const timeLeft = decodedToken.exp - currentTime;
    logger.debug(`Time left before token expiration: ${timeLeft} seconds`);
    if (timeLeft <= 0) {
      logger.debug("Token has already expired");
      return false;
    }

    const data = await fetchFormData("GET", undefined, "auth/refreshToken", true);
    logger.debug(`Received new token and save it in localStorage : ${JSON.stringify(jwtDecode(data.token))}`);
    await AsyncStorage.setItem("token", data.token);
    return true;
  } catch (error) {
    logger.warn(`Error in refreshToken: ${error.message}`);
    return false;
  }
};

// Initialize configuration for FetchService
export const init = configService => {
  config = {
    apiUrl: configService.apiUrl,
    apiKey: configService.apiKey,
    apiSecureKey: configService.apiSecureKey,
    apiDeviceKey: configService.apiDeviceKey,
    environment: configService.environment,
    appName: configService.appName,
    deviceId: configService.getDeviceId(),
  };
};

// Export FetchService methods
const FetchService = {
  fetchLog,
  fetchSignup,
  fetchLogin,
  fetchLoadBasicData,
  fetchRefreshToken,
};

export default FetchService;
