import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MapScreen from "./MapScreen";
import TabNavigator from "../../navigation/TabNavigator";

const Stack = createStackNavigator();

const CityGuideScreen: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TabNavigator"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default CityGuideScreen;
