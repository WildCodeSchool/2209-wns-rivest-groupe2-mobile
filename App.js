import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from "./screens/Home";
import Likes from "./screens/Likes";
import MyAccount from "./screens/MyAccount";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator 
      screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused
                ? 'home'
                : 'home-outline';
            } else if (route.name === 'Likes') {
              iconName = focused ? 'heart' : 'heart-outline';
            } else if (route.name === 'MyAccount') {
              iconName = focused ? 'account' : 'image-outline';
            }
            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color}  />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
        >
        <Tab.Screen name="Camera" component={Home}  options={{ unmountOnBlur: true }} />
        <Tab.Screen name="Feed" component={Likes} />
        <Tab.Screen name="Images" component={MyAccount} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
