import React, { useLayoutEffect, useState } from "react";
import * as yup from "yup";
import { gql, useMutation } from "@apollo/client";
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Logo from "../../assets/images/city-guide-logo.svg";
import Button from "../../components/Button";
import InputGroup from "../../components/InputGroup";
import * as SecureStore from "expo-secure-store";
import { useRecoilState } from "recoil";
import { userState } from "../../atom/userAtom";
import { IUser, IUserForm } from "../../types/IUser";
import { Link } from "@react-navigation/native";
import { ROUTES } from "../../constants";
import { Ionicons } from "@expo/vector-icons";

// MUTATION APOLLO
const CREATE_USER = gql`
  mutation Mutation($email: String!, $password: String!) {
    createUser(email: $email, password: $password) {
      token
      userFromDB {
        id
        email
        username
        type
        firstname
        lastname
        hashedPassword
        profilePicture
      }
    }
  }
`;

// FN SECURE STORE
async function saveTokenInSecureStore(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

const RegisterScreen: React.FC = ({ navigation }: any) => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [passwordShownBis, setPasswordShownBis] = useState(false);

  const handleShowPassword = () => {
    setPasswordShown(!passwordShown);
  };

  const handleShowPasswordBis = () => {
    setPasswordShownBis(!passwordShownBis);
  };

  // DISABLE TOP NAVIGATION
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
        .required("Veuillez saisir un mot de passe"),
      confirmPassword: yup
        .string()
        .oneOf(
          [yup.ref("password"), null],
          "Les mots de passe ne correspondent pas"
        ),
    })
    .required();

  // RECOIL
  const [user, setUser] = useRecoilState(userState);

  // MUTATION - SUBMISSION
  const [signUp] = useMutation(CREATE_USER, {
    onCompleted(data) {
      saveTokenInSecureStore("token", data.createUser.token);
      setUser(data.createUser);
      navigation.navigate(ROUTES.MYPROFILE);
      //navigation.navigate("Profile");
    },
    onError(error: any) {
      console.log(error);
    },
  });

  const onSubmit: SubmitHandler<IUserForm> = async (fields: {
    email: string;
    password: string;
  }) => {
    signUp({
      variables: {
        email: fields.email,
        password: fields.password,
      },
    });
  };

  const {
    control,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<IUserForm>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
  });

  return (
    <SafeAreaView style={styles.main}>
      <ImageBackground
        source={require("../../assets/images/bg-register.jpg")}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.overlay} />

        {/******************** FORM *********************/}

        <ScrollView>
          <View style={styles.container}>
            <View style={styles.wFull}>
              <View>
                <Text style={styles.title}>Créez votre compte</Text>
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
                    error={!!error}
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
                      error={!!error}
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
              <Controller
                control={control}
                name="confirmPassword"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <View>
                    <InputGroup
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Confirmer le mot de passe"
                      error={!!error}
                      errorDetails={error?.message}
                      password={passwordShownBis ? false : true}
                    />
                    <TouchableOpacity
                      onPress={handleShowPasswordBis}
                      className="absolute top-7 right-10"
                    >
                      {passwordShownBis ? (
                        <Ionicons name="eye" color="black" size={20} />
                      ) : (
                        <Ionicons name="eye-off" color="black" size={20} />
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              />
              <View>
                <Button onPress={handleSubmit(onSubmit)}>S'INSCRIRE</Button>
              </View>
            </View>

            {/******************** FOOTER *********************/}

            <View style={styles.footer}>
              <View>
                <Text style={styles.footerText}>
                  Déjà un compte CityGuide ?
                </Text>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => navigation.navigate(ROUTES.LOGIN)}
                >
                  <Text style={styles.signupBtn}>Se connecter 😀</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
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
    marginTop: 80,
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
    backgroundColor: "rgba(0, 0, 0, 0.803)",
  },
});

export default RegisterScreen;
