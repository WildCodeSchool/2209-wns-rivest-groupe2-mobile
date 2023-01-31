import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./src/screens/Home";
import Likes from "./src/screens/Likes";
import MyAccount from "./src/screens/MyAccount";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer >
      <Tab.Navigator  
    
        screenOptions={({ route }) => ({
          tabBarStyle: { backgroundColor:'#009FA1' },

          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Favorites") {
              iconName = focused ? "heart" : "heart-outline";
            } else if (route.name === "My Account") {
              iconName = focused
                ? "md-information-circle"
                : "md-information-circle-outline";
            }
            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#EB571F",
          tabBarInactiveTintColor: "white",
          
          
          
        })}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{ unmountOnBlur: true }}
        />
        <Tab.Screen name="Favorites" component={Likes} />
        <Tab.Screen name="My Account" component={MyAccount} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

