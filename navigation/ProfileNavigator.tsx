import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { RegisterScreen, LoginScreen, MyProfileScreen } from "../screens/index";
import * as SecureStore from "expo-secure-store";
import { ROUTES } from "../constants/index";
import { useRecoilState } from "recoil";
import { userState } from "../atom/userAtom";
import { useFocusEffect } from "@react-navigation/native";

const Stack = createStackNavigator();

const ProfileNavigator: React.FC = () => {

  //const [initialRoute, setInitialRoute] = useState<string | null>(null);
  //console.log("=======> INITIALROUTE : ", initialRoute)

  const [user, setUser] = useRecoilState(userState);
  //console.log("=======> USER(PROFILENAVIGATOR) : ", user)

  useFocusEffect(
    useCallback(() => {
      (async () => {
          user
      })();
    }, [])
  );

  // useFocusEffect(
  //   useCallback(() => {
  //   async function checkTokensAndSetNavigation() {
  //     try {
  //       const token = await SecureStore.getItemAsync('token');
  //       console.log("=======> TOKEN: ", token)
  //       if (token !== null) {
  //         setInitialRoute("MyProfileScreen");
  //         console.log("=======> INITIALROUTE : ", initialRoute)
  //       } else {
  //         setInitialRoute("LoginScreen");
  //       }
  //     } catch (error) {
  //       setInitialRoute("LoginScreen");
  //     }
  //   }
  //   checkTokensAndSetNavigation();
  // }, [])
  // )

  //return initialRoute !== null ? (
  return (
    //<Stack.Navigator initialRouteName={initialRoute as "LoginScreen" | "MyProfileScreen"}>
    <Stack.Navigator>
      {user !== null ? (
        <Stack.Screen name={ROUTES.MYPROFILE} component={MyProfileScreen} />
      ) : (
          <>
          <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
          <Stack.Screen name={ROUTES.REGISTER} component={RegisterScreen} />
          </>
      )}
    </Stack.Navigator> 
  )
};

export default ProfileNavigator;
