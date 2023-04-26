import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import MapScreen from "../screens/cityguide/MapScreen";
import ProfileNavigator from "./ProfileNavigator";
import { useNavigation } from "@react-navigation/native";
import DrawerNavigator from "./DrawerNavigator";
import DiscoverScreen from "../screens/cityguide/DiscoverScreen";

export type BottomTabParamList = {
  Map: undefined;
  Compte: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const TabNavigator: React.FC = ({ navigation }: any) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap | undefined;
          if (route.name === "Map") {
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
        name="Map"
        component={MapScreen}
        options={{ unmountOnBlur: true }}
      />
      <Tab.Screen
        name="Découvrir"
        component={DiscoverScreen}
        options={{ unmountOnBlur: true }}
      />
      <Tab.Screen
        name="Compte"
        component={ProfileNavigator}
        // options={{
        //   headerShown: true,
        //   headerRight: () => {
        //     return (
        //       <TouchableOpacity onPress={() => navigation.openDrawer()}>
        //         <Ionicons
        //           name="md-menu"
        //           size={30}
        //           color="#44bdbe"
        //           style={{ marginRight: 10 }}
        //         />
        //       </TouchableOpacity>
        //     );
        //   },
        // }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default TabNavigator;
