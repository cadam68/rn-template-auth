import React, { useRef, useCallback } from "react";
import { View, Text, Animated, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { GUI } from "../util/tools";
import AudioPlayer from "../util/AudioPlayer";
import { useFocusEffect } from "@react-navigation/native";
import { IMAGES } from "../config/default";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const SplashScreen = ({ onClose }) => {
  const x1 = useRef(new Animated.Value(0)).current;
  const x2 = useRef(new Animated.Value(-100)).current;

  useFocusEffect(
    useCallback(() => {
      Animated.parallel([
        Animated.timing(x1, {
          toValue: -40,
          duration: 5000,
          useNativeDriver: false,
        }),
        Animated.timing(x2, {
          toValue: -140,
          duration: 5000,
          useNativeDriver: false,
        }),
      ]).start();
      // AudioPlayer.playSound("welcome");

      const timeout = setTimeout(() => {
        onClose();
      }, 6000);
      return () => {
        // AudioPlayer.stopSound();
        clearTimeout(timeout);
      };
    }, [])
  );

  return (
    <TouchableOpacity style={{ width: "100%", height: "100%" }} activeOpacity={1} onPress={onClose}>
      <View style={[styles.container]}>
        <Animated.View style={[styles.absoluteContainer, { left: 0, marginLeft: x1 }]}>
          <Image source={IMAGES.SplashScreen} style={{ opacity: 0.8, resizeMode: "cover", width: "100%", height: SCREEN_HEIGHT }} />
        </Animated.View>
        <Animated.View style={[styles.absoluteContainer, { right: 0, marginRight: x2 }]}>
          <Image source={IMAGES.SplashScreen_subject} style={{ opacity: 1, resizeMode: "cover", width: "100%", height: SCREEN_HEIGHT }} />
        </Animated.View>
        <GUI.TextContainer>
          <Text style={{ color: "blue", fontSize: 18 }}>{"Welcome \n\nIt's time to elevate your online presence"}</Text>
        </GUI.TextContainer>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  absoluteContainer: {
    position: "absolute",
    top: 0,
    width: SCREEN_WIDTH + 100,
  },
});

export default SplashScreen;
