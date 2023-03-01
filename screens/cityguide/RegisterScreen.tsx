import * as React from "react";
import * as yup from "yup";
import { gql, useMutation } from "@apollo/client";
import { SafeAreaView, View, ScrollView, Text, StyleSheet } from "react-native";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Logo from "../../assets/images/city-guide-logo.svg";
import Button from "../../components/Button";
import InputGroup from "../../components/InputGroup";
import * as SecureStore from "expo-secure-store";
import { useRecoilState } from "recoil";
import { userState } from "../../atom/userAtom";
import { IUser } from "../../types/IUser";
import { Link  } from '@react-navigation/native';

//interface CreateAccountProps {}

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

const RegisterScreen: React.FC = ({ navigation }: any) => {

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

  // FN SECURE STORE
  async function saveTokenInSecureStore(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
  }

  // MUTATION - SUBMISSION
  const [signUp] = useMutation(CREATE_USER, {
    onCompleted(data) {
      saveTokenInSecureStore("token", data.createUser.token);
      setUser(data.createUser);
      navigation.navigate("Profile");
    },
    onError(error: any) {
      console.log(error);
    },
  });

  const onSubmit: SubmitHandler<IUser> = async (fields: {
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
  } = useForm<IUser>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
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
            <InputGroup
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Mot de passe"
              error={!!error}
              errorDetails={error?.message}
              //password
            />
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <InputGroup
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Confirmer le mot de passe"
              error={!!error}
              errorDetails={error?.message}
              //password
            />
          )}
        />
        <View>
          <Button onPress={handleSubmit(onSubmit)}>S'INSCRIRE</Button>
        </View>
        <Text style={{ textAlign: "center", color: "#ffffff" , marginTop: 20 }}>
            Déjà membre ?{" "}
            <Link style={{ color: "#2ECE65" }} to={{ screen: "Profile" }}>
              Connexion
            </Link>
          </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    padding: 20,
    width: "100%",
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
    backgroundColor: "#072428",
  },
  email: {
    position: "relative",
    width: "100%",
  },
  icon: {
    position: "absolute",
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 30,
    paddingBottom: 30,
    color: "#fff",
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

export default RegisterScreen;
