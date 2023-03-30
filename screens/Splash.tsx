import { Button } from "@react-native-material/core";
import React from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import Logo from "../assets/images/city-guide-logo.svg";
import * as Animatable from "react-native-animatable";

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
              <Text className="flex items-center justify-center text-center mt-3 tracking-widest w-52 text-gray-50 text-[24px] font-semibold">Découvrir la ville autrement !</Text>
            </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("CityGuideScreen");
            }}
            className="absolute bottom-20 w-24 h-24 rounded-full border-l-2 border-r-2  border-t-4 border-[#44bdbe] items-center justify-center"
          >
            <Animatable.View
              animation="pulse"
              easing="ease-in-out"
              iterationCount="infinite"
              className="w-20 h-20 items-center text-center justify-center bg-[#44bdbe] rounded-full"
            >
              <Text className="text-gray-50 text-[30px] font-semibold">GO</Text>
            </Animatable.View>
          </TouchableOpacity>
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
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 200,
    padding: 7,
    elevation: 20,
    shadowColor: "#a5a5a5",
  },
});
