import { useState, useRef, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { UTILS, STORAGE } from "../../util/tools";
import LogService from "../../util/LogService";
import { Colors } from "../../constants/styles";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import DefaultService from "../../config/default";
import { useAppContext } from "../../context/AppContext";

const logger = LogService.Log("AuthForm");

const AuthForm = ({ isLogin, onSubmit, credentialsError }) => {
  const [enteredUserId, setEnteredUserId] = useState(() => DefaultService.getInput("authForm.userId") ?? "");
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState("");
  const userIdInput = useRef(null);
  const emailInput = useRef(null);
  const passwordInput = useRef(null);
  const confirmPasswordInput = useRef(null);
  const { debugService } = useAppContext();

  const { userId: userIdError, email: emailError, password: passwordError, confirmPassword: confirmPasswordError } = credentialsError;

  useEffect(() => {
    if (credentialsError.userId) userIdInput.current.focus();
    else if (credentialsError.email) emailInput.current.focus();
    else if (credentialsError.password) passwordInput.current.focus();
    else if (credentialsError.confirmPassword) confirmPasswordInput.current.focus();
  }, [credentialsError]);

  // --------------
  const interpretCommand = UTILS.interpretCommand({
    logon: () => LogService.setLogOn(true),
    logoff: () => LogService.setLogOn(false),
    loglevel: level => LogService.setLogLevel(level),
    debug: () => debugService.toggle(),
    reset: () => STORAGE.removeAllItems(),
    // Add more commands as needed
  });

  const updateInputValueHandler = (inputType, enteredValue) => {
    const asciiPattern = /^[\x21-\x7E]*$/; // ASCII characters (excluding spaces)
    const numbersPattern = /^[0-9]*$/; // Numbers only
    const datePattern = /^\d{0,4}-\d{0,2}-\d{0,2}$/; // Date format YYYY-MM-DD

    switch (inputType) {
      case "userId":
        enteredValue = enteredValue.toLowerCase();
        if (asciiPattern.test(enteredValue)) setEnteredUserId(enteredValue);
        break;
      case "email":
        enteredValue = enteredValue.toLowerCase();
        setEnteredEmail(enteredValue);
        break;
      case "password":
        if (asciiPattern.test(enteredValue)) setEnteredPassword(enteredValue);
        break;
      case "confirmPassword":
        if (asciiPattern.test(enteredValue)) setEnteredConfirmPassword(enteredValue);
        break;
    }
  };

  const submitHandler = () => {
    onSubmit({
      userId: enteredUserId,
      email: enteredEmail,
      password: enteredPassword,
      confirmPassword: enteredConfirmPassword,
    });
  };

  return (
    <View style={styles.form}>
      <View>
        <View style={styles.icon}>
          <AntDesign name="user" size={50} color={"white"} />
        </View>
        <Input
          label={userIdError ?? "UserId"}
          onUpdateValue={updateInputValueHandler.bind(this, "userId")}
          onBlur={() => DefaultService.setInput("authForm.userId", enteredUserId)}
          value={enteredUserId}
          isInvalid={!!userIdError}
          inputStyles={inputStyles}
          placeholder={"userId"}
          icon={<Feather name="user" size={18} color={Colors.blue} style={{ marginRight: 10 }} />}
          ref={userIdInput}
        />
        {!isLogin && (
          <Input
            label={emailError ?? "Email Address"}
            onUpdateValue={updateInputValueHandler.bind(this, "email")}
            value={enteredEmail}
            keyboardType="email-address"
            isInvalid={!!emailError}
            inputStyles={inputStyles}
            placeholder={"email"}
            icon={<Feather name="mail" size={18} color={Colors.blue} style={{ marginRight: 10 }} />}
            ref={emailInput}
          />
        )}
        <Input
          label={passwordError ?? "Password"}
          onUpdateValue={updateInputValueHandler.bind(this, "password")}
          onBlur={() => interpretCommand(enteredPassword) && setEnteredPassword("")}
          secure
          value={enteredPassword}
          isInvalid={!!passwordError}
          inputStyles={inputStyles}
          placeholder={"password"}
          icon={<Feather name="lock" size={18} color={Colors.blue} style={{ marginRight: 10 }} />}
          ref={passwordInput}
        />
        {!isLogin && (
          <Input
            label={confirmPasswordError ?? "Confirm Password"}
            onUpdateValue={updateInputValueHandler.bind(this, "confirmPassword")}
            secure
            value={enteredConfirmPassword}
            isInvalid={!!confirmPasswordError}
            inputStyles={inputStyles}
            placeholder={"password"}
            icon={<Feather name="lock" size={18} color={Colors.blue} style={{ marginRight: 10 }} />}
            ref={confirmPasswordInput}
          />
        )}
        <View style={styles.buttons}>
          <Button onPress={submitHandler} buttonStyles={buttonStyles}>
            {isLogin ? "LogIn" : "SignUp"}
          </Button>
        </View>
      </View>
    </View>
  );
};

export default AuthForm;

const styles = StyleSheet.create({
  icon: {
    backgroundColor: Colors.blue,
    alignSelf: "center",
    borderRadius: 100,
    padding: 10,
    marginBottom: 8,
  },
  buttons: {
    marginTop: 18,
  },
});

const buttonStyles = StyleSheet.create({
  button: {
    backgroundColor: Colors.blue,
    paddingVertical: 12,
    shadowOpacity: 0,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textTransform: "uppercase",
  },
});

const inputStyles = StyleSheet.create({
  label: { color: Colors.dark2 },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: Colors.light3,
    borderColor: Colors.light1,
    borderWidth: 1,
    borderRadius: 4,
  },
});
