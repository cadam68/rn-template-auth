import React from "react";
import { View, Text, StyleSheet, TextInput, Linking, Platform, ActivityIndicator, Modal, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AudioPlayer from "./AudioPlayer";
import LogService from "./LogService";

const logger = LogService.Log("Tools");
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export const GUI = {
  Separator: function () {
    return <View style={styles.Separator} />;
  },
  Spacer: function (props) {
    return <View style={[styles.Spacer, props.style]}>{props.children}</View>;
  },
  TextContainer: function (props) {
    return <View style={[styles.TextContainer, props.style]}>{props.children}</View>;
  },
  TextInput: function ({ value, onChangeText, name, ...props }) {
    return (
      <TextInput
        value={value}
        onChangeText={value => onChangeText(name, value)} //... Bind the name here
        {...props}
      />
    );
  },
  TitleH1: function ({ text, styleView }) {
    return (
      <View style={styleView}>
        <Text style={[STYLES.h1, { color: "#cccccc", position: "absolute", top: 1, left: 1 }]}>{text}</Text>
        <Text style={STYLES.h1}>{text}</Text>
      </View>
    );
  },
};

export const MATH = {
  add: function (a, b) {
    return a + b;
  },
  randomRgb: function () {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    return `rgb(${red},${green},${blue})`;
    // return '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
  },
  random: function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  },
  convertIfNumber: param => {
    const num = +param;
    return isNaN(num) ? param : num;
  },
};

export const STYLES = StyleSheet.create({
  image: {
    flex: 1,
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 14,
    color: "#fff",
    alignSelf: "center",
    textTransform: "uppercase",
  },
  button: {
    backgroundColor: "#7777FF",
    borderRadius: 1,
    paddingVertical: 10,
  },
  input: {
    margin: 15,
    borderColor: "black",
    borderWidth: 1,
  },
  h1: {
    fontSize: 20,
    color: "red",
    fontWeight: "bold",
  },
  h2: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export const UTILS = {
  // const interpretCommand =  UTILS.interpretCommand({
  //  logon: () => console.log("Logging on..."), ...
  // });
  interpretCommand: commandHandlers => input => {
    if (!input) return;
    logger.console(`interpretCommand(${input})`);
    // Match pattern like [command(arg)] or [command] without arguments
    const pattern = /\[(\w+)(?:\(([^)]*)\))?\]/;
    const match = input.match(pattern);
    if (match) {
      const command = match[1];
      const args = match[2] ? match[2].split(",") : [];
      // Check if the command exists in the commandHandlers
      if (commandHandlers[command]) {
        // Call the function with parsed arguments
        commandHandlers[command](...args.map(value => MATH.convertIfNumber(value))); // Execute the command function with arguments
        AudioPlayer.playSound("blip");
        return true; // Indicate command was processed
      }
    }
    return false; // Indicate command was not recognized
  },

  dialCall: number => {
    let phoneNumber = "";
    if (Platform.OS === "android") {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    Linking.openURL(phoneNumber);
  },

  openGps: (lat, lng, address) => {
    const scheme = Platform.OS === "ios" ? "maps:" : "geo:";
    const url = scheme + `${lat},${lng}?q=${address}`;
    // console.log(url);
    Linking.openURL(url);
  },

  getEnvVariable: (varName, fallbackValue) => {
    const value = process.env[varName] || fallbackValue;
    if (!value) throw new Error(`${varName} is not defined. Please check your environment variables.`);
    return value;
  },

  wait: seconds => new Promise(resolve => setTimeout(resolve, seconds * 1000)),
};

export const STORAGE = {
  async setItem(key, value) {
    logger.console(`AsyncStorage.setItem(${key})`);
    try {
      return await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // console.error('AsyncStorage#setItem error: ' + error.message);
    }
  },

  async getItem(key) {
    logger.console(`AsyncStorage.getItem(${key})`);
    return await AsyncStorage.getItem(key).then(result => {
      if (result) {
        try {
          result = JSON.parse(result);
        } catch (e) {
          // console.error('AsyncStorage#getItem error deserializing JSON for key: ' + key, e.message);
        }
      }
      return result;
    });
  },

  async removeItem(key) {
    return await AsyncStorage.removeItem(key);
  },

  async getAllKeys() {
    return await AsyncStorage.getAllKeys();
  },

  async removeAllItems() {
    const allKeys = await AsyncStorage.getAllKeys();
    // console.log('Storage remove allKeys', allKeys);
    // await Promise.all(allKeys.map(async key => await AsyncStorage.removeItem(key)));
    for await (let key of allKeys) await AsyncStorage.removeItem(key);
  },
};

const styles = StyleSheet.create({
  Separator: {
    marginVertical: 5,
    marginHorizontal: 15,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  Spacer: {
    margin: 10,
    alignSelf: "stretch",
  },
  TextContainer: {
    margin: 10,
    alignSelf: "auto",
    alignItems: "center",
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: 20,
    marginTop: -20,
    width: SCREEN_WIDTH > 600 ? "50%" : "80%",
  },
  ModalActivityIndicator: function ({ visible }) {
    return (
      <Modal visible={visible} animationType="none" transparent>
        <View style={styles.modalContainer}>
          <ActivityIndicator size="large" color="white" animating={visible} />
        </View>
      </Modal>
    );
  },
});
