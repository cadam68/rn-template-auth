import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "../../constants/styles";

const Button = ({ children, onPress, buttonStyles }) => {
  return (
    <Pressable style={({ pressed }) => [styles.button, buttonStyles?.button, pressed && styles.pressed]} onPress={onPress}>
      <View>
        <Text style={[styles.buttonText, buttonStyles?.buttonText]}>{children}</Text>
      </View>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.primary500,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
