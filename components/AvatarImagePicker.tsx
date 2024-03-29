import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Avatar, Button, Modal, Portal } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";

function AvatarImagePicker() {
  const [modalOpen, setModalOpen] = useState(false);

  const [image, setImage] = useState(null);
  const launchImageLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setModalOpen(false);
    }
  };

  const launchCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setModalOpen(false);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setModalOpen(true)}>
        <Avatar.Image
          size={100}
          source={
            image
              ? { uri: image }
              : require("../assets/images/no-image-icon.png")
          }
          className="bg-white"
        />
      </TouchableOpacity>

      <Portal>
        <Modal visible={modalOpen}>
          <View>
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
            >
              Choose from Library
            </Button>
            <Button textColor="#45C7C9" mode="elevated" onPress={launchCamera}>
              Take a picture
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

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
  },
  modalContent: {
    flex: 1,
  },
});

export default AvatarImagePicker;
