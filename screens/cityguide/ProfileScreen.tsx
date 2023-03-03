import { Stack, TextInput, Button } from "@react-native-material/core";
import React from "react";
import { Image, SafeAreaView, View, StyleSheet } from "react-native";
import { Avatar, Card, Text, IconButton, Modal } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import AvatarImagePicker from "../../components/AvatarImagePicker";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { useRecoilState, useResetRecoilState } from "recoil";
import { userState } from "../../atom/userAtom";

const ProfileScreen: React.FC = ({ navigation }: any) => {
  const [modalOpen, setModalOpen] = React.useState(false);

  const [userTest, setUserTest] = React.useState({
    firstName: "New",
    lastName: "NewLast",
    email: "qkfjkbgz@gmail.com",
    phoneNumber: "003442974824",
  });

  const updatedUser = (values) => {
    setUserTest({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phoneNumber: values.phoneNumber,
    });
  };

  const logout = async () => {
    const deletetoken = await SecureStore.deleteItemAsync("token");
    console.log("=======> DELETE TOKEN : ", deletetoken);
    resetList
    navigation.navigate("Map");
  };

  const resetList = useResetRecoilState(userState);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View>
          <AvatarImagePicker />

          <View>
            <View>
              <Ionicons name="medal-outline" size={20} />
              <Text> User type</Text>
            </View>
            <View>
              <Ionicons name="star-outline" size={20} />
              <Text> User rating</Text>
            </View>
          </View>
        </View>

        <Card>
          <Card.Title
            title="User Info"
            subtitle="User description"
            titleVariant="titleMedium"
            right={(props) => (
              <IconButton
                {...props}
                icon="pencil"
                size={20}
                onPress={() => setModalOpen(true)}
              />
            )}
          />
          <Card.Content>
            <Text>
              <Text>User first name:</Text> {userTest.firstName}
            </Text>
            <Text>
              <Text>User last name:</Text> {userTest.lastName}
            </Text>
            <Text>
              <Text>User email:</Text> {userTest.email}
            </Text>
            <Text>
              <Text>User phone number:</Text> {userTest.phoneNumber}
            </Text>
            <Text>
              <Text>Interests:</Text> #keywords #keywords #keywords #keywords
              #keywords #keywords
            </Text>
          </Card.Content>
        </Card>

        <Modal visible={modalOpen}>
          <View style={styles.modalContent}>
            <Ionicons
              name="close"
              size={24}
              style={{ ...styles.modalToggle, ...styles.modalClose }}
              onPress={() => setModalOpen(false)}
            />
            {/* <EditProfile user={user} updatedUser={updatedUser} /> */}
          </View>
        </Modal>
        <Button onPress={() => logout()} title={"Logout"} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loginForm: {
    flex: 1,
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
  title: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 30,
    paddingBottom: 15,
  },
  whiteContrast: {
    color: "#fff",
  },
});

export default ProfileScreen;
