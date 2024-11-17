import { StyleSheet, Text, View } from "react-native";
import ViewImageBackground from "../components/ui/ViewImageBackground";
import { IMAGES } from "../config/default";
import { useAuthContext } from "../context/AuthContext";

const WelcomeScreen = () => {
  const authCtx = useAuthContext();

  return (
    <ViewImageBackground imageBackground={IMAGES.WelcomeScreen}>
      <View style={styles.rootContainer}>
        <Text style={styles.title}>Welcome {authCtx.user?.userid}!</Text>
        <Text>You authenticated successfully!</Text>
      </View>
    </ViewImageBackground>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
