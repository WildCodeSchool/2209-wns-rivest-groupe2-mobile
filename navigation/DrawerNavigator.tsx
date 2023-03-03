import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { ROUTES } from "../constants";
import { RegisterScreen, MapScreen, ProfileScreen } from "../screens/index";

const Drawer = createDrawerNavigator();

function DrawerNavigator() {

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: "#0fa6a6",
        drawerActiveTintColor: "#ffffff",
        drawerLabelStyle: {
          marginLeft: -20,
        },
      }}
    >
      <Drawer.Screen
        name={ROUTES.PROFILE}
        component={ProfileScreen}
        options={{
          title: "Home",
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons iconName="map" size={18} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name={ROUTES.MAP}
        component={MapScreen}
        options={{
          title: "Wallet",
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons iconName="map" size={18} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name={ROUTES.MAP}
        component={ProfileScreen}
        options={{
          title: "Notifications",
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons iconName="map" size={18} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
