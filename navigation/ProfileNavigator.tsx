import React, { useCallback } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { RegisterScreen, LoginScreen, MyProfileScreen } from "../screens/index";
import * as SecureStore from "expo-secure-store";
import { ROUTES } from "../constants/index";
import { useRecoilState } from "recoil";
import { userState } from "../atom/userAtom";
import { useFocusEffect } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DrawerNavigator from "./DrawerNavigator";

const Stack = createStackNavigator();

const ProfileNavigator: React.FC = ({ navigation }: any) => {
  const [user, setUser] = useRecoilState(userState);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        user;
      })();
    }, [])
  );

  return (
    <Stack.Navigator>
      {user !== null ? (
        <>
          <Stack.Screen
            name={ROUTES.MYPROFILE}
            component={MyProfileScreen}
            //   options={{
            //     headerShown: true,
            //     headerLeft: () => (
            //       <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            //         <Ionicons
            //           name="md-menu"
            //           size={30}
            //           color="#44bdbe"
            //           style={{ marginLeft: 10 }}
            //         />
            //       </TouchableOpacity>
            //     ),
            //   }}
          />
          <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
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
