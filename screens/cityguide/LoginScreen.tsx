import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import InputGroup from "../../components/InputGroup";
import Button from "../../components/Button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { IUserForm } from "../../types/IUser";
import { useRecoilState } from "recoil";
import { userState } from "../../atom/userAtom";
import * as SecureStore from "expo-secure-store";
import { ROUTES } from "../../constants";
import { Ionicons } from "@expo/vector-icons";
import { GET_TOKEN } from "../../services/queries/UserQueries";

export async function saveInSecureStore(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

const LoginScreen = ({ navigation }) => {
  const [passwordShown, setPasswordShown] = useState(false);

  const handleShowPassword = () => {
    setPasswordShown(!passwordShown);
  };
  //DISABLE TOP NAVIGATION
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  // VALIDATION SCHEMA
  const validationSchema = yup
    .object({
      email: yup
        .string()
        .email()
        .required("Veuillez saisir votre email valide"),
      password: yup
        .string()
        .matches(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\w~@#$%^&*+=`|{}:;!.?\\"()\\[\]-]{8,25}$/,
          "Should have one uppercase letter, one lowercase letter, one number. Should have min 8 and max 25 characters."
        )
        .required("Veuillez saisir votre mot de passe"),
    })
    .required();

  // RECOIL
  const [user, setUser] = useRecoilState(userState);

  // MUTATION - SUBMISSION
  const [signIn] = useLazyQuery(GET_TOKEN);

  const onSubmit: SubmitHandler<IUserForm> = async (fields: {
    email: string;
    password: string;
  }) => {
    await signIn({
      variables: {
        email: fields.email,
        password: fields.password,
      },
      onCompleted(data) {
        saveInSecureStore("token", data.getToken.token);
        saveInSecureStore("user", JSON.stringify(data.getToken));
        setUser(data.getToken);
        navigation.navigate("Profile");
      },
      onError(error: any) {
        console.log(error);
      },
    });
  };

  const { control, handleSubmit } = useForm<IUserForm>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
  });

  return (
    <SafeAreaView style={styles.main}>
      <ImageBackground
        source={require("../../assets/images/bg-login.jpg")}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.overlay} />

        {/******************** FORM *********************/}

        <View style={styles.scroll}>
          <ScrollView>
            <View style={styles.container}>
              <View style={styles.wFull}>
                <View>
                  <Text style={styles.title}>Se connecter</Text>
                </View>
                <Controller
                  control={control}
                  name="email"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <InputGroup
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Email"
                      errorDetails={error?.message}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="password"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <View>
                      <InputGroup
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder="Mot de passe"
                        errorDetails={error?.message}
                        password={passwordShown ? false : true}
                      />
                      <TouchableOpacity
                        onPress={handleShowPassword}
                        className="absolute top-7 right-10"
                      >
                        {passwordShown ? (
                          <Ionicons name="eye" color="black" size={20} />
                        ) : (
                          <Ionicons name="eye-off" color="black" size={20} />
                        )}
                      </TouchableOpacity>
                    </View>
                  )}
                />
                <View>
                  <Button onPress={handleSubmit(onSubmit)}>SE CONNECTER</Button>
                </View>
              </View>

              {/******************** FOOTER *********************/}

              <View style={styles.footer}>
                <View>
                  <Text style={styles.footerText}>
                    Pas encore de compte CityGuide ?
                  </Text>
                </View>
                <View>
                  <TouchableOpacity
                    onPress={() => navigation.navigate(ROUTES.REGISTER)}
                  >
                    <Text style={styles.signupBtn}>
                      Inscription gratuite 😀
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // FORM
  container: {
    padding: 15,
    width: "100%",
    position: "relative",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    width: "100%",
    padding: 10,
  },
  wFull: {
    width: "100%",
    marginBottom: 100,
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 30,
    paddingBottom: 30,
    color: "#fff",
    padding: 30,
  },
  // FORGOT PASSWORD
  forgotPassText: {
    color: "#0fa6a6",
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 15,
  },
  // FOOTER
  footer: {
    position: "absolute",
    bottom: 0,
    alignItems: "center",
    flexDirection: "column",
  },
  footerText: {
    color: "#fff",
    fontWeight: "bold",
  },
  signupBtn: {
    color: "#0fa6a6",
    marginTop: 5,
    fontWeight: "bold",
  },
  // BACKGROUND
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
    backgroundColor: "rgba(0, 0, 0, 0.591)",
  },
});

export default LoginScreen;

/* {"getToken": {
  "__typename": "LoginResponse", 
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNpdHkuYWRtaW5AZGV2ZWxvcC5jb20iLCJyb2xlIjoiY2l0eV9hZG1pbiIsImlhdCI6MTY5Mjg2ODc2OCwiZXhwIjoxNjkzNDczNTY4fQ.JC7t7vs2-qjrU7WWiySZFOsoV_biNkOy-I9iUk40VOs", 
  "userFromDB": {
    "__typename": "User", 
    "email": "city.admin@develop.com", 
    "firstname": "City", 
    "id": 10, 
    "isVerified": true, 
    "lastname": "Admin", 
    "profilePicture": null, 
    "role": [Object], 
    "username": "city.admin"
  }
}} */
