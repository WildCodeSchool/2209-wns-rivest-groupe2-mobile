import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { RegisterScreen, LoginScreen, ProfileScreen } from "../screens/index";
import * as SecureStore from "expo-secure-store";
import { ROUTES } from "../constants/index";
import { useRecoilState } from "recoil";
import { userState } from "../atom/userAtom";

const Stack = createStackNavigator();

const ProfileNavigator: React.FC = () => {

  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  const [user, setUser] = useRecoilState(userState);
  console.log("=======> USER.TOKEN(PROFILENAVIGATOR) : ", user.token)

  useEffect(() => {
    async function checkTokensAndSetNavigation() {
      try {
        const token = await SecureStore.getItemAsync('token');
        console.log("=======> TOKEN : ", token)

        if (user.token !== null) {
          setInitialRoute("Profile");
        } else {
          setInitialRoute("Connexion");
        }
      } catch (error) {
        setInitialRoute("Connexion");
      }
    }
    checkTokensAndSetNavigation();
  }, []);

  return initialRoute !== null ? (
    <Stack.Navigator initialRouteName={initialRoute as "Connexion" | "Profile"}>
      <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
      <Stack.Screen name={ROUTES.REGISTER} component={RegisterScreen} />
      <Stack.Screen name={ROUTES.PROFILE} component={ProfileScreen} /> 
    </Stack.Navigator> 
  ) : null
};

export default ProfileNavigator;
