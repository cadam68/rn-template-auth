import { StyleSheet, Text, View } from "react-native";
import ViewImageBackground from "../components/ui/ViewImageBackground";
import { IMAGES } from "../config/default";

const ErrorScreen = ({ message }) => {
  return (
    <ViewImageBackground imageBackground={IMAGES.ErrorScreen}>
      <View style={styles.rootContainer}>
        <Text style={styles.error}>{message}</Text>
      </View>
    </ViewImageBackground>
  );
};

export default ErrorScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  error: {
    fontSize: 20,
    marginBottom: 8,
    color: "red",
  },
});
