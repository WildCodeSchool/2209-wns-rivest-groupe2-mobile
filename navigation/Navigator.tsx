import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Splash from '../screens/Splash'
import CityGuideScreen from '../screens/cityguide/CityGuideScreen';
import ProfileScreen from '../screens/cityguide/MyProfileScreen';
import ProfileNavigator from './ProfileNavigator';
import RegisterScreen from '../screens/cityguide/RegisterScreen';
import { ROUTES } from '../constants';
import DrawerNavigator from './DrawerNavigator';
import ItemScreen from '../screens/cityguide/ItemScreen';
import { ItemScreenProps } from '../types/ItemScreenProps'

type RootStackParamList = {
  Splash: undefined;
  CityGuideScreen: undefined;
  ProfileNavigator: undefined;
  DrawerNavigator: undefined;
  ItemScreen: ItemScreenProps;
};

const Stack = createStackNavigator<RootStackParamList>();

const Navigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="CityGuideScreen" component={CityGuideScreen} />
        <Stack.Screen name="ProfileNavigator" component={ProfileNavigator} />
        <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
        <Stack.Screen name="ItemScreen" component={ItemScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigator;