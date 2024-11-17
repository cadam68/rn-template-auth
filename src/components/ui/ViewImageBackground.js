import { STYLES, GUI } from "../../util/tools";
import { ImageBackground, ScrollView } from "react-native";

const ViewImageBackground = ({ imageBackground, scroll, children }) => {
  return (
    <ImageBackground source={imageBackground} style={STYLES.image}>
      <GUI.Spacer style={{ backgroundColor: "rgba(255, 255, 255, 0.9)", margin: 0, height: "100%" }}>
        {scroll && <ScrollView showsVerticalScrollIndicator={false}>{children}</ScrollView>}
        {!scroll && children}
      </GUI.Spacer>
    </ImageBackground>
  );
};

export default ViewImageBackground;
