import React, { useRef, useState } from "react";
import { Camera, CameraType } from "expo-camera";
import { Button, Platform, StyleSheet, Text, View } from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import Constants from "expo-constants";
import { useMutation } from "@apollo/client";
import { UPDATE_USER_MUTATION } from "../../services/mutations/User";
import { useRecoilState } from "recoil";
import { userState } from "../../atom/userAtom";
import { saveInSecureStore } from "./LoginScreen";
import Toast from "react-native-root-toast";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { ROUTES } from "../../constants";

export default function CameraScreen() {
  const [typeCamera, setTypeCamera] = useState(CameraType.front);
  const [user, setUser] = useRecoilState(userState);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const cameraRef = useRef<any>(null);
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
      Toast.show("Photo de profil ajoutée avec succès !", {
        duration: Toast.durations.SHORT,
        backgroundColor: "rgb(1, 162, 1)",
        shadow: false,
        position: 90,
      });
      // @ts-ignore
      navigation.navigate(ROUTES.MYPROFILE);
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

  async function takePhoto() {
    const pictureMetadata = cameraRef.current
      ? await cameraRef.current.takePictureAsync()
      : null;
    await ImageManipulator.manipulateAsync(pictureMetadata.uri, [
      { resize: { width: 800 } },
    ]);
    await uploadImageBackend(pictureMetadata.uri);
  }

  function toggleCameraType() {
    setTypeCamera((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  if (!permission) {
    return <View />;
  }
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          Nous avons besoin de votre permission pour ouvrir la caméra
        </Text>
        <Button onPress={requestPermission} title="Donner la permission" />
      </View>
    );
  }
  return (
    <>
      <Camera style={styles.camera} ref={cameraRef} type={typeCamera} />
      <Button title="Changer de caméra" onPress={toggleCameraType} />
      <Button onPress={() => takePhoto()} title="Prendre une photo" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
});
