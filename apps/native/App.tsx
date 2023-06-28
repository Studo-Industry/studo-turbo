import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Octicons, Ionicons } from '@expo/vector-icons';
import { TRPCProvider } from './utils/trpc';
import Dashboard from './DashBoard';
import MyTeam from './screens/MyTeam';
import WishlistPage from './screens/WhishListScreen';
import MileStoneScreen from './screens/MileStoneScreen';
import Profile from './screens/Profile';
import HomeScreen from './HomeScreen';
import Screen2 from './screens/Screen2';
import Screen3 from './screens/Screen3';
import MyProjectScreen from './screens/MyProjectsScreen';
import Website from './screens/Website';
import AboutUsScreen from './screens/AboutUsScreen';
import Screen4 from './screens/Screen4';
import AllBranches from './screens/AllBranches';

const Tab = createBottomTabNavigator<RootStackParamList>();

// Add new screen here
export type RootStackParamList = {
  DashBoard: undefined;
  MyTeam: undefined;
  Wishlist: {id: string,
  name: string,
  details: string,
  timeline: string};
  Milestone: undefined;
  Profile: undefined;
  MyProject: undefined;
  Website: undefined;
  About: undefined;
  Project: undefined;
  Projects: undefined;

  AllBranches: undefined;

  Home: undefined;
  Screen2: undefined;
  Screen3: { id: string };
  Screen4: {categoryName: string};
};
const Stack = createStackNavigator<RootStackParamList>();

// Name Screen here
const App = () => {
  return (
    <TRPCProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='DashBoard'>
          <Stack.Screen name='DashBoard' component={Dashboard} />
          <Stack.Screen name='MyTeam' component={MyTeam} />
          <Stack.Screen name='Wishlist' component={WishlistPage} />
          <Stack.Screen name='Milestone' component={MileStoneScreen} />
          <Stack.Screen name='Profile' component={Profile} />
          <Stack.Screen name='MyProject' component={MyProjectScreen} />
          <Stack.Screen name='Website' component={Website} />
          <Stack.Screen name='About' component={AboutUsScreen} />
          <Stack.Screen name='AllBranches' component={AllBranches} />

          <Stack.Screen name='Home' component={HomeScreen} />
          <Stack.Screen name='Screen2' component={Screen2} />
          <Stack.Screen name='Screen3' component={Screen3} />
          <Stack.Screen name='Screen4' component={Screen4} />
        </Stack.Navigator>
      </NavigationContainer>
      {/* <NavigationContainer></NavigationContainer> */}
    </TRPCProvider>
  );
};

export default App;
