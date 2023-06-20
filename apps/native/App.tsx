import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import Screen2 from './Screen2';
import Screen3 from './Screen3';

export type RootStackParamList = {
  Home: undefined;
  Screen2: undefined;
  Screen3: undefined;
};
const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='Screen2' component={Screen2} />
        <Stack.Screen name='Screen3' component={Screen3} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
