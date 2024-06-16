import React from 'react';
import { Provider } from 'react-redux';
import store from './src/redux/store';

import HomeScreen from './src/screens/Homescreen';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PlayerScreen from './src/screens/PlayerScreen';
import { DatabaseProvider } from './src/context/DatabaseContext';
import SessionsScreen from './src/screens/SessionsScreen';
import SessionDetailsScreen from './src/screens/SessionDetailsScreen';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <Provider store={store}>
      <DatabaseProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Players" component={PlayerScreen} />
            <Stack.Screen name="Sessions" component={SessionsScreen} />
            <Stack.Screen name="SessionDetailsScreen" component={SessionDetailsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </DatabaseProvider>
    </Provider>
  );
}
