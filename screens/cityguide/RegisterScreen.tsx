import * as React from "react";
import * as yup from "yup";
import {
  SafeAreaView,
  View,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Logo from "../../assets/images/city-guide-logo.svg";
import Button from "../../components/Button";
import InputGroup from "../../components/InputGroup";

interface CreateAccountProps {}

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterScreen: React.FC<CreateAccountProps> = () => {
  // VALIDATION SCHEMA
  const validationSchema = yup
    .object({
      name: yup.string().required("Veuillez saisir votre nom"),
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
        .oneOf([yup.ref("password"), null], "Passwords do not match."),
    })
    .required();

  const {
    control,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data) => {
    clearErrors();
    console.log(data);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Controller
          control={control}
          name="name"
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <InputGroup
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Nom"
              error={!!error}
              errorDetails={error?.message}
            />
          )}
        />
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
            />
          )}
        />
        <View>
          <Button onPress={handleSubmit(onSubmit)}>Créer mon compte</Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#44bdbe",
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

export default RegisterScreen;
