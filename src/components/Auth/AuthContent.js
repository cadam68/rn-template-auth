import { useState } from "react";
import { Alert, StyleSheet, View, Text, Vibration, useWindowDimensions, ImageBackground, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import LogService from "../../util/LogService";
import validator from "validator";

import FlatButton from "../ui/FlatButton";
import AuthForm from "./AuthForm";
import { Colors } from "../../constants/styles";
import DefaultService, { IMAGES } from "../../config/default";
import ViewImageBackground from "../ui/ViewImageBackground";
import { useAppContext } from "../../context/AppContext";

const logger = LogService.Log("AuthContent");

const AuthContent = ({ isLogin, onAuthenticate }) => {
  const { width: screenWidth } = useWindowDimensions();
  const { debugService } = useAppContext();
  const navigation = useNavigation();
  const [credentialsError, setCredentialsError] = useState({
    userId: undefined,
    email: undefined,
    password: undefined,
    confirmPassword: undefined,
  });

  const switchAuthModeHandler = () => {
    if (isLogin) {
      navigation.replace("Signup");
    } else {
      navigation.replace("Login");
    }
  };

  const submitHandler = credentials => {
    let { userId, email, password, confirmPassword } = credentials;

    userId = userId.trim();
    email = email.trim();
    password = password.trim();
    logger.debug(`credentials: userId=[${userId}], email=[${email}], password=[${password}], confirmPassword=[${confirmPassword}]`);

    let userIdError = userId.length > 6 ? undefined : "UserId must be more than 6 char";
    let emailError = isLogin ? undefined : validator.isEmail(email) ? undefined : "Email is not valid";
    let passwordError = password.length > 6 ? undefined : "Password must be more than 6 char";
    let confirmPasswordError = isLogin ? undefined : password === confirmPassword ? undefined : "Passwords are not identical";
    logger.debug(`credentials validation: userId=[${!userIdError}], email=[${!emailError}], password=[${!passwordError}], confirmPassword=[${!confirmPasswordError}]`);

    if (userIdError || passwordError || confirmPasswordError || emailError) {
      logger.debug(`credentials are not valid!`);
      Vibration.vibrate(50);
      Alert.alert("Invalid input", "Please check your entered credentials.");
      setCredentialsError({
        userId: userIdError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
      return;
    }
    logger.debug(`credentials are valid`);
    onAuthenticate({ userid: userId, email, password });
  };

  const styles = StyleSheet.create({
    authContent: {
      alignSelf: "center",
      marginTop: "20%",
      padding: 16,
      borderRadius: 8,
      backgroundColor: "white",
      shadowColor: "black",
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.1,
      width: screenWidth > 600 ? "50%" : "80%",
    },
    buttons: {
      marginTop: 8,
    },
  });

  return (
    <>
      <ViewImageBackground imageBackground={IMAGES.AuthContent}>
        <View style={styles.authContent}>
          <AuthForm isLogin={isLogin} onSubmit={submitHandler} credentialsError={credentialsError} />
          <View style={styles.buttons}>
            <FlatButton onPress={switchAuthModeHandler} flatButtonStyles={{ color: Colors.dark2 }}>
              {isLogin ? "Create a new user" : "Log in instead"}
            </FlatButton>
          </View>
        </View>
        {debugService.debug && (
          <View style={{ margin: 10, borderWidth: 1, borderColor: "red" }}>
            <Text>- DeviceId : {DefaultService.getDeviceId()}</Text>
            <Text>- IsLogOn : {LogService.getIsLogOn() ? "true" : "false"}</Text>
            <Text>- LogLevel : {LogService.getLogLevel()}</Text>
          </View>
        )}
      </ViewImageBackground>
    </>
  );
};

export default AuthContent;
