import React, { forwardRef } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

import { Colors } from "../../constants/styles";

const Input = forwardRef(({ label, keyboardType, secure, onUpdateValue, value, isInvalid, onBlur, inputStyles, icon, placeholder }, ref) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, inputStyles?.label, isInvalid && styles.labelInvalid]}>{label}</Text>
      <View style={[{ flexDirection: "row", alignItems: "center" }, inputStyles?.input, isInvalid && styles.inputInvalid]}>
        {icon}
        <TextInput
          style={[styles.input]}
          autoCapitalize={false}
          autoCapitalize="none"
          keyboardType={keyboardType}
          secureTextEntry={secure}
          onChangeText={onUpdateValue}
          value={value}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor={Colors.light0}
          ref={ref}
        />
      </View>
    </View>
  );
});

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 8,
  },
  label: {
    color: "white",
    marginBottom: 4,
  },
  labelInvalid: {
    color: Colors.error500,
  },
  input: {
    fontSize: 18,
    flexGrow: 1,
  },
  inputInvalid: {
    backgroundColor: Colors.error100,
  },
});
