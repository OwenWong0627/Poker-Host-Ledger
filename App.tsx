import React from 'react';
import { Provider } from 'react-redux';
import store from './src/redux/store';

import HomeScreen from './src/screens/Homescreen';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PlayerScreen from './src/screens/PlayerScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
          />
          <Stack.Screen name="Players" component={PlayerScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}