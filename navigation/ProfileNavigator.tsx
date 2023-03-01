import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from '../screens/cityguide/RegisterScreen';

const Stack = createStackNavigator();

const ProfileNavigator: React.FC = () => {
  return (
      <Stack.Navigator >
          <Stack.Screen name="Je créé mon compte" component={RegisterScreen} />
      </Stack.Navigator>
  )
}

export default ProfileNavigator;