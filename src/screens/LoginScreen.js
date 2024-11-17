import { useState } from "react";
import { Alert } from "react-native";

import AuthContent from "../components/Auth/AuthContent";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { useAuthContext } from "../context/AuthContext";

const LoginScreen = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { login } = useAuthContext();

  const loginHandler = async ({ userid, password }) => {
    setIsAuthenticating(true);
    try {
      await login(userid, password);
      // Alert.alert("Login", `User ${userid} successfully log in`);
    } catch (error) {
      Alert.alert("Authentication failed!", `Could not log you in, ${error.message ?? "please check your credentials"}`);
    }
    setIsAuthenticating(false);
  };

  if (isAuthenticating) return <LoadingOverlay message="Logging you in..." />;
  return <AuthContent isLogin onAuthenticate={loginHandler} />;
};

export default LoginScreen;
