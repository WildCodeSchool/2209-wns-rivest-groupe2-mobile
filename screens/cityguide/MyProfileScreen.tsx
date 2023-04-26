import { Stack, TextInput, Button } from "@react-native-material/core";
import React, { useLayoutEffect } from "react";
import { Image, SafeAreaView, View, StyleSheet } from "react-native";
import { Avatar, Card, Text, IconButton, Modal } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import AvatarImagePicker from "../../components/AvatarImagePicker";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { useRecoilState, useResetRecoilState } from "recoil";
import { userState } from "../../atom/userAtom";
import { NavigationContainer, DrawerActions } from "@react-navigation/native";

const MyProfileScreen: React.FC = ({ navigation }: any) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [user, setUser] = useRecoilState(userState);
  const resetUserState = useResetRecoilState(userState);

  console.log("user", user);

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

  return (
    <SafeAreaView style={styles.container}>
      <View className="flex-row items-center justify-between my-5 px-5">
        <View>
          <Text className="text-[30px] text-[#0B646B] font-semibold">
            Bonjour {user?.userFromDB.firstname}
          </Text>
          <Text className="text-[15px] text-[#527873]">
            Que va t'on découvrir aujourd'hui ?
          </Text>
        </View>
        {/* <Ionicons
          name="md-menu"
          size={30}
          color="#44bdbe"
          style={{ marginRight: 10 }}
          onPress={() => navigation.openDrawer()}
        /> */}
      </View>

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
              <Text>User first name:</Text> {user?.userFromDB.firstname}
            </Text>
            <Text>
              <Text>User last name:</Text> {user?.userFromDB.lastname}
            </Text>
            <Text>
              <Text>User email:</Text> {user?.userFromDB.email}
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
          </View>
        </Modal>
        <Button onPress={logout} title={"Se déconnecter"} />
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

export default MyProfileScreen;
