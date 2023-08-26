import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  RegisterScreen,
  LoginScreen,
  MyProfileScreen,
  CameraScreen,
} from "../screens/index";
import { ROUTES } from "../constants/index";
import { useRecoilState } from "recoil";
import { userState } from "../atom/userAtom";
import DrawerNavigator from "./DrawerNavigator";
import * as SecureStore from "expo-secure-store";
import { View } from "react-native";
import { ActivityIndicator } from "react-native";
import { StyleSheet } from "react-native";

const Stack = createStackNavigator();

const ProfileNavigator: React.FC = ({ navigation }: any) => {
  const [user, setUser] = useRecoilState(userState);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      let user;
      try {
        user = await SecureStore.getItemAsync("user");
      } catch (err) {
        console.error(err);
      }
      if (user) {
        setUser(JSON.parse(user));
        setLoading(false);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {user !== null ? (
        <>
          <Stack.Screen name={ROUTES.MYPROFILE} component={MyProfileScreen} />
          <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
          <Stack.Screen name={ROUTES.CAMERA} component={CameraScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
          <Stack.Screen name={ROUTES.REGISTER} component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default ProfileNavigator;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
