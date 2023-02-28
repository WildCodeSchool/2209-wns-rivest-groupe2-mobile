import { Stack, Text, TextInput, Button } from "@react-native-material/core";
import React from "react";
import {
  Image,
  SafeAreaView,
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import Logo from "../../assets/images/city-guide-logo.svg";

const ProfileScreen: React.FC = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ImageBackground
          source={require("../../assets/images/bg-splash.jpg")}
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
                navigation.navigate("ProfileNavigator");
              }}
              style={styles.button}
            />
          </View>
        </ImageBackground>

        {/* <View style={styles.imageContainer}>
          <Logo width={300} height={60} />
        </View>
        <Text style={styles.title}>
          Trouver les meilleurs plans
        </Text>

        <Text variant="body1" style={styles.body}>
          Suivez vos activités carbone, montrez vos progrès à vos amis et
          profitez des bons plans partagés au quotidien.
        </Text>
        <Button
          title="Je me connecte"
          color="#003c49"
          tintColor="#fff"
          style={{ margin: 10 }}
          onPress={() => {
            navigation.navigate("CityGuideScreen");
          }}
        />
        <Button
          title="Je créé mon compte"
          color="#44bdbe"
          tintColor="#fff"
          style={{ margin: 10 }}
          onPress={() => {
            navigation.navigate("CityGuideScreen");
          }}
        />
        <View
          style={{
            backgroundColor: "#003c49",
            marginTop: 50,
            paddingTop: 25,
            paddingBottom: 25,
            paddingLeft: 15,
            paddingRight: 15,
          }}
        >
          <Text style={[styles.title, styles.whiteContrast]}>
            Ici, les meilleurs bons plans !
          </Text>
          <View style={styles.imageContainer}>
            <Logo width={300} height={60} />
          </View>
          <Text variant="body1" style={{ color: "#fff", margin: 20 }}>
            Chaque jour des nouveaux bons plans carbone à découvrir !
          </Text>
          <Button
            title="Voir les bons plans"
            color="#17b2aa"
            tintColor="#fff"
            onPress={() => {
              navigation.navigate("CityGuideScreen");
            }}
          />
        </View>
        <Text style={{ textAlign: "center", margin: 20 }}>
          WildCarbon © 2023
        </Text> */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollView: {
    marginHorizontal: 0,
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 30,

    paddingBottom: 15,
  },
  whiteContrast: {
    color: "#fff",
  },
  body: {
    textAlign: "center",
    margin: 10,
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    resizeMode: "contain",
    flex: 0.8,
    aspectRatio: 2.5,
  },
});

export default ProfileScreen;
