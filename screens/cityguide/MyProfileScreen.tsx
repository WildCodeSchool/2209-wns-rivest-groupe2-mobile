import React, { useCallback, useLayoutEffect, useState } from "react";
import { SafeAreaView, View, StyleSheet, Button } from "react-native";
import { Text, Modal } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import AvatarImagePicker from "../../components/AvatarImagePicker";
import * as SecureStore from "expo-secure-store";
import { useRecoilState, useResetRecoilState } from "recoil";
import { userState } from "../../atom/userAtom";
import { GET_POI_QUERY } from "../../services/queries/Poi";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useFocusEffect } from "@react-navigation/native";
import ItemCardContainer from "../../components/ItemCardContainer";
import { ScrollView } from "react-native-gesture-handler";
import { UPDATE_USER_MUTATION } from "../../services/mutations/User";
import { saveTokenInSecureStore } from "./LoginScreen";
import { Controller, useForm } from "react-hook-form";
import InputGroup from "../../components/InputGroup";

const MyProfileScreen: React.FC = ({ navigation }: any) => {
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: "white", padding: 20 };
  const [user, setUser] = useRecoilState(userState);
  const resetUserState = useResetRecoilState(userState);

  const [getAllPois, { loading, error }] = useLazyQuery(GET_POI_QUERY);
  const [pois, setPois] = useState([]);

  async function fetchPois() {
    try {
      const data = await getAllPois();
      const dataPois = [...data.data.getAllPoi];

      setPois(dataPois);
    } catch (error) {
      console.log(error);
      setPois([]);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchPois();
    }, [])
  );

  // LOGOUT
  const logout = async () => {
    await SecureStore.deleteItemAsync("token");
    resetUserState();
    navigation.navigate("Map");
  };

  // DISABLE TOP NAVIGATION
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const [updateUser] = useMutation(UPDATE_USER_MUTATION, {
    variables: { data: {} },
    onCompleted: (data) => {
      console.log("data.updateUser", data.updateUser);
      saveTokenInSecureStore("token", data.getToken.token);
      setUser(data.updateUser);
    },
  });

  const onSubmit = (formData: {}) => {
    updateUser({
      variables: { data: { ...formData, id: user.userFromDB.id } },
    });
  };

  const {
    control,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    /* resolver: yupResolver(validationSchema), */
  });

  return (
    <SafeAreaView style={styles.container}>
      <View className="flex items-end px-10">
        <Text className="underline font-bold" onPress={showModal}>
          Modifier mes informations
        </Text>
      </View>
      <View className="flex-row items-center justify-between mx-auto my-5 px-5 py-5 bg-white w-[85%] border rounded-xl border-slate-100 shadow-lg shadow-black">
        <View className="flex items-center">
          <AvatarImagePicker />
          <Text className="pt-5 text-xl font-bold">
            {user?.userFromDB.firstname || user?.userFromDB.email}
          </Text>
          <Text className="text-sm">
            {user?.userFromDB.type === "freeUser"
              ? "Free user"
              : user?.userFromDB.type === "admin"
              ? "admin"
              : user?.userFromDB.type === "paidUser"
              ? "Paid User"
              : ""}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-2xl px-3">5</Text>
          <Ionicons name="heart" color="black" size={30} />
        </View>
      </View>
      <View style={styles.subContainer}>
        <ScrollView>
          <View className="p-5">
            <Text className="text-[30px] text-[#0B646B] font-semibold">
              Bonjour {user?.userFromDB.firstname}
            </Text>
            <Text className="text-[15px] text-[#527873]">
              Vos points d'intérêts favoris !
            </Text>
          </View>
          <View className="px-4 flex-row items-center justify-evenly flex-wrap">
            {pois?.length > 0 ? (
              pois
                ?.slice(0, 5)
                .map((poi, i) => (
                  <ItemCardContainer
                    key={i}
                    id={poi.id}
                    pictureUrl={
                      poi?.pictureUrl
                        ? poi?.pictureUrl
                        : "https://cdn.pixabay.com/photo/2015/10/30/12/22/eat-1014025_1280.jpg"
                    }
                    name={poi.name}
                    address={poi.address}
                    postal={poi.postal}
                    isFavorite={true}
                  />
                ))
            ) : (
              <>
                <View className="w-full h-[400px] bg-gray-200 placeholder:items-center space-y-8 justify-center">
                  <Text className="text-2xl text-[#428288] font-semibold">
                    Vous n'avez pas de favoris enregistrés
                  </Text>
                </View>
              </>
            )}
          </View>
          <View className="my-4">
            <View className="w-[60%] mx-auto">
              <Button title="SE DECONNECTER" color="#44bdbe" onPress={logout} />
            </View>
          </View>
        </ScrollView>
      </View>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={containerStyle}
      >
        <View>
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
                  className="border border-teal-400"
                />
              </View>
            )}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  subContainer: {
    flex: 2,
  },
  modalContent: {
    flex: 1,
  },
  modalToggle: {
    flex: 1,
  },
  modalClose: {
    flex: 1,
  },
});

export default MyProfileScreen;
