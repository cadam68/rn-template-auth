import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState, useMemo, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import FetchService from "../util/FetchService";
import LogService from "../util/LogService";
import { useAppContext } from "./AppContext";
import DefaultService from "../config/default";
import { UTILS } from "../util/tools";

const logger = LogService.Log("AuthContext");

const AuthContext = createContext({
  user: undefined,
  isAuthenticated: false,
  signup: async (userid, password, email) => {},
  login: async (userid, password) => {},
  logout: async () => {},
  autoLogging: async () => {},
});

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const { portfolioService } = useAppContext();

  const signup = async (userid, password, email) => {
    const abortCtrl = new AbortController();

    try {
      let data = await FetchService.fetchSignup(userid, password, email, abortCtrl);
      if (!data?.token) throw new Error("Signup failed, no token returned");

      const decodedToken = jwtDecode(data.token);
      logger.debug(`signup token = ${JSON.stringify(decodedToken)}`);
      if (!decodedToken?.userid || !decodedToken?.name || !decodedToken?.role) throw new Error("Invalid token returned");

      // Save the token in localStorage and set the user state
      await AsyncStorage.setItem("token", data.token);
      setUser({ userid: decodedToken.userid, name: decodedToken.name, role: decodedToken.role });
      portfolioService.setPortfolioId(decodedToken.userid);
    } catch (error) {
      logger.error(`Error during login : ${error}`);
      await logout();
      throw error;
    }
  };

  const login = async (userid, password) => {
    const abortCtrl = new AbortController();

    try {
      let data = await FetchService.fetchLogin(userid, password, abortCtrl);
      if (!data?.token) throw new Error("Login failed, no token returned");

      const decodedToken = jwtDecode(data.token);
      logger.debug(`login token = ${JSON.stringify(decodedToken)}`);
      if (!decodedToken?.userid || !decodedToken?.name || !decodedToken?.role) throw new Error("Invalid token returned");

      // Save the token in localStorage and set the user state
      await AsyncStorage.setItem("token", data.token);
      setUser({ userid: decodedToken.userid, name: decodedToken.name, role: decodedToken.role });
      portfolioService.setPortfolioId(decodedToken.userid);
    } catch (error) {
      logger.error(`Error during login : ${error}`);
      await logout();
      throw error;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    logger.info(`user ${user?.name} logged out`);
    setUser(undefined);
  };

  const autoLogging = async () => {
    let token = await AsyncStorage.getItem("token");
    if (token) {
      try {
        const isValid = await FetchService.fetchRefreshToken();
        if (!isValid) throw new Error();
        token = await AsyncStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        if (!decodedToken?.userid || !decodedToken?.name || !decodedToken?.role) throw new Error("Invalid token returned");

        // Save the token in localStorage and set the user state
        setUser({ userid: decodedToken.userid, name: decodedToken.name, role: decodedToken.role });
        portfolioService.setPortfolioId(decodedToken.userid);
      } catch (error) {
        logger.error("Invalid token found in local storage, clearing it.");
        localStorage.removeItem("token");
      }
    }
  };

  const refreshToken = async () => {
    const succeed = await FetchService.fetchRefreshToken();
    logger.debug(`refreshToken ${succeed ? "succeed" : "failed"}`);
    if (!succeed) await logout();
  };

  useEffect(() => {
    let intervalId;
    if (user) {
      logger.debug("create refreshToken interval");
      intervalId = setInterval(refreshToken, DefaultService.refreshTokenInterval * 60000);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        logger.debug("cleanup refreshToken interval");
      }
    };
  }, [user]);

  const contextValues = useMemo(
    () => ({
      isAuthenticated: !!user,
      user,
      signup: signup,
      login: login,
      logout: logout,
      autoLogging: autoLogging,
    }),
    [user]
  );

  return <AuthContext.Provider value={contextValues}>{children}</AuthContext.Provider>;
};

// Custom hook to consume the AuthContext
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthContextProvider");
  }
  return context;
};

export default AuthContextProvider;
