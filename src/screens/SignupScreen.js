import { useState } from "react";
import { Alert } from "react-native";

import AuthContent from "../components/Auth/AuthContent";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { useAuthContext } from "../context/AuthContext";

const SignupScreen = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { signup } = useAuthContext();

  const signupHandler = async ({ userid, password, email }) => {
    setIsAuthenticating(true);
    try {
      await signup(userid, password, email);
      Alert.alert("Signup", `User ${userid} successfully created`);
    } catch (error) {
      Alert.alert("Authentication failed", `Could not create user, ${error.message ?? "please check your credentials"}`);
    }
    setIsAuthenticating(false);
  };

  if (isAuthenticating) return <LoadingOverlay message="Creating user..." />;
  return <AuthContent onAuthenticate={signupHandler} />;
};

export default SignupScreen;
