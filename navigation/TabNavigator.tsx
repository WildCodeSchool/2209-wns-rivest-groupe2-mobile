import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import MapScreen from "../screens/cityguide/MapScreen";
import ProfileNavigator from "./ProfileNavigator";
import DiscoverScreen from "../screens/cityguide/DiscoverScreen";

export type BottomTabParamList = {
  Carte: undefined;
  Découvrir: undefined;
  Compte: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap | undefined;
          if (route.name === "Carte") {
            iconName = focused ? "map" : "map-outline";
          } else if (route.name === "Découvrir") {
            iconName = focused ? "image" : "image-outline";
          } else if (route.name === "Compte") {
            iconName = focused ? "person" : "person-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#44bdbe",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Carte"
        component={MapScreen}
        options={{ unmountOnBlur: true }}
      />
      <Tab.Screen
        name="Découvrir"
        component={DiscoverScreen}
        options={{ unmountOnBlur: true }}
      />
      <Tab.Screen name="Compte" component={ProfileNavigator} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
