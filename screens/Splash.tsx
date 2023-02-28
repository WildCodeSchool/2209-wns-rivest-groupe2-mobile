import { Button } from "@react-native-material/core";
import React from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  SafeAreaView,
} from "react-native";
import Logo from "../assets/images/city-guide-logo.svg";

const Splash: React.FC = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.container}>
        <ImageBackground
          source={require("../assets/images/bg-splash.jpg")}
          resizeMode="cover"
          style={styles.image}
        >
          <View style={styles.overlay} />
          <View style={styles.wrapper}>
            <View style={styles.logo}>
              <Logo width={300} height={60} />
            </View>
            <Button
              title="Découvrir"
              color="#44bdbe"
              tintColor="#fff"
              onPress={() => {
                navigation.navigate("CityGuideScreen");
              }}
              style={styles.button}
            />
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

export default Splash;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "cover",
    width: "100%",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  wrapper: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 100,
  },
  logo: {
    marginTop: 60,
    elevation: 50,
    shadowColor: "#a5a5a5",
  },
  button: {
    width: 200,
    padding: 7,
    elevation: 20,
    shadowColor: "#a5a5a5",
  },
});
