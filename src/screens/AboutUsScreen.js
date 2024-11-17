import { StyleSheet, Text, View, Image, Linking, TouchableOpacity } from "react-native";
import ViewImageBackground from "../components/ui/ViewImageBackground";
import { IMAGES } from "../config/default";

const AboutUsScreen = () => {
  const handleOpenURL = async url => {
    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url);
  };

  return (
    <ViewImageBackground imageBackground={IMAGES.Splash}>
      {/* Company Overview */}
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.heading}>Company Overview</Text>
          <Text style={styles.text}>
            <Text style={styles.strong}>In-Line</Text> is a dynamic startup focused on empowering individuals to create and customize their own <Text style={styles.strong}>portfolio</Text> web pages.
          </Text>
        </View>

        {/* Mission Statement */}
        <View style={styles.section}>
          <Text style={styles.heading}>Our Mission</Text>
          <Text style={styles.text}>
            Our mission is to democratize the ability to create personalized portfolio websites, making it accessible to <Text style={styles.strong}>everyone</Text>.
          </Text>
        </View>

        {/* Our Team */}
        <View style={styles.section}>
          <Text style={styles.heading}>Our Team</Text>
          <Text style={styles.text}>Meet our team of professionals who are passionate about delivering exceptional results.</Text>
          {/* Example Team Member */}
          <View style={styles.teamMember}>
            <Image source={IMAGES.AdamCyril} style={styles.image} />
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>Cyril Adam</Text>
              <Text style={styles.memberRole}>CEO</Text>
            </View>
          </View>
          {/* Add more team members as needed */}
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.heading}>Contact Us</Text>
          <Text style={styles.text}>Email: info@in-line.fr</Text>
          <Text style={styles.text}>
            WebSite:{" "}
            <Text style={styles.link} onPress={() => handleOpenURL("https://portfolio.in-line.fr")}>
              portfolio.in-line.fr
            </Text>
          </Text>
        </View>
      </View>
    </ViewImageBackground>
  );
};

export default AboutUsScreen;

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
  container: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: "20%",
  },
  section: {
    marginBottom: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#0056b3",
    borderBottomWidth: 1,
    borderBottomColor: "#0056b3",
    paddingBottom: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  teamMember: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    borderWidth: 1,
    borderColor: "#ff922b",
  },
  memberInfo: {
    flexDirection: "column",
  },
  memberName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  memberRole: {
    fontSize: 16,
    color: "gray",
  },
  strong: {
    color: "#ff922b",
  },
  link: {
    color: "#1E90FF",
    textDecorationLine: "underline",
  },
});
