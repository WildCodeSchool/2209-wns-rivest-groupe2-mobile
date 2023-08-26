import { TouchableOpacity, View, StyleSheet, Text } from "react-native";
import { Avatar, Button, Modal, Portal } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import Constants from "expo-constants";
import { useMutation } from "@apollo/client";
import { UPDATE_USER_MUTATION } from "../services/mutations/User";
import { useRecoilState } from "recoil";
import { userState } from "../atom/userAtom";
import { saveInSecureStore } from "../screens/cityguide/LoginScreen";
import axios from "axios";
import Toast from "react-native-root-toast";
import { Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ROUTES } from "../constants";

function AvatarImagePicker() {
  const [modalOpen, setModalOpen] = useState(false);
  const [user, setUser] = useRecoilState(userState);
  const navigation = useNavigation();

  const { manifest } = Constants;
  const image_url =
    manifest?.debuggerHost &&
    `http://${manifest.debuggerHost.split(":").shift()}:18000/images`;

  const [updateAvatarImg] = useMutation(UPDATE_USER_MUTATION, {
    context: {
      headers: {
        authorization: `Bearer ${user.token}`,
      },
    },
    onCompleted(data) {
      saveInSecureStore(
        "user",
        JSON.stringify({
          token: user.token,
          userFromDB: data.updateUser,
        })
      );
      setUser({
        __typename: "User",
        token: user.token,
        userFromDB: data.updateUser,
      });
    },
  });

  const updateBackendUrlImg = async (data: {
    status: string;
    filename: string;
  }) => {
    try {
      await updateAvatarImg({
        variables: {
          data: {
            id: user.userFromDB.id,
            profilePicture: data.filename,
          },
        },
      });
      setModalOpen(false);
      Toast.show("Photo de profil ajoutée avec succès !", {
        duration: Toast.durations.SHORT,
        backgroundColor: "rgb(1, 162, 1)",
        shadow: false,
        position: 90,
      });
    } catch (error: any) {
      console.error(error);
      Toast.show(
        `Erreur lors de l'ajout de la photo de profil: ${error.message}`,
        {
          duration: Toast.durations.SHORT,
          backgroundColor: "#D58574",
          shadow: false,
          position: 90,
        }
      );
    }
  };

  const uploadImageBackend = async (media: string) => {
    const pictureData = {
      name: new Date() + "_profile",
      type: "image/jpg",
      uri: Platform.OS !== "android" ? "file://" + media : media,
    };
    const formData = new FormData();
    // @ts-ignore
    formData.append("file", pictureData);

    const postUrl = `/upload/avatars/${user.userFromDB.id}`;

    try {
      const { data } = await axios.post(`${image_url}${postUrl}`, formData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${user.token}`,
          "Content-type": "multipart/form-data",
        },
      });
      await updateBackendUrlImg(data);
    } catch (err) {
      console.error(err);
      Toast.show(
        `Erreur lors de l'ajout de la photo de profil: ${err.message}`,
        {
          duration: Toast.durations.SHORT,
          backgroundColor: "#D58574",
          shadow: false,
          position: 90,
        }
      );
    }
  };

  const launchImageLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.2,
    });

    if (!result.canceled) {
      await uploadImageBackend(result.assets[0].uri);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setModalOpen(true)}>
        <Avatar.Image
          size={100}
          source={
            user?.userFromDB?.profilePicture &&
            user.userFromDB.profilePicture.length > 0
              ? {
                  uri: `${image_url}${user.userFromDB.profilePicture}`,
                }
              : require("../assets/images/no-image-icon.png")
          }
          className="bg-white"
        />
      </TouchableOpacity>

      <Portal>
        <Modal visible={modalOpen}>
          <View style={styles.modalContent}>
            <Ionicons
              name="close"
              size={24}
              style={{ ...styles.modalToggle, ...styles.modalClose }}
              onPress={() => setModalOpen(false)}
            />
            <Button
              textColor="#45C7C9"
              mode="elevated"
              onPress={launchImageLibrary}
              style={styles.modalButton}
            >
              Choisir une photo depuis la bibliothèque
            </Button>
            <Button
              textColor="#45C7C9"
              mode="elevated"
              style={styles.modalButton}
              onPress={() => {
                // @ts-ignore
                navigation.navigate(ROUTES.CAMERA);
                setModalOpen(false);
              }}
            >
              Prendre une photo avec la caméra
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

export default AvatarImagePicker;

const styles = StyleSheet.create({
  modalToggle: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#f2f2f2",
    padding: 10,
    borderRadius: 10,
    alignSelf: "center",
  },
  modalClose: {
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: "#8C9EA6",
    color: "white",
  },
  modalContent: {
    backgroundColor: "white",
    paddingVertical: 30,
    height: "100%",
  },
  modalButton: {
    marginVertical: 15,
    width: "80%",
    marginLeft: "10%",
  },
});
