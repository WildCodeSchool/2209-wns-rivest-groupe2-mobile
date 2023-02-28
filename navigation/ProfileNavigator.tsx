import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from '../screens/cityguide/RegisterScreen';

const Stack = createStackNavigator();

const ProfileNavigator = () => {
  return (
      <Stack.Navigator >
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      </Stack.Navigator>
  )
}

export default ProfileNavigator;