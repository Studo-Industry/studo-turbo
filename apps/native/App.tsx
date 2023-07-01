import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Octicons, Ionicons } from '@expo/vector-icons';
import { TRPCProvider } from './utils/trpc';
import Dashboard from './DashBoard';
import MyTeam from './screens/MyTeam';
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
import { WishlistProvider } from './screens/WishlistContext';
import WishlistScreen from './screens/WhishListScreen';
import BottomNavigation from './Components/BottomNavigation';
import HelpScreen from './screens/HelpScreen';

const Tab = createBottomTabNavigator();

export type RootStackParamList = {
  Dashboard: {categoryName: string;};
  MyTeam: undefined;
  Main:undefined;
  Help: undefined;

  Milestone: undefined;
  Profile: undefined;
  MyProject: undefined;
  Website: undefined;
  About: undefined;
  Project: undefined;
  Projects: undefined;
  AllBranches: undefined;
  Home: undefined;
  Wishlist: undefined;

  Screen2: undefined;
  Screen3: {
    id: string;
  };
  Screen4: {
    categoryName: string;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <TRPCProvider>
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="Main" component={BottomNavigation} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Help" component={HelpScreen} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Milestone" component={MileStoneScreen} />
        <Stack.Screen name="MyTeam" component={MyTeam} />
        <Stack.Screen name="MyProject" component={MyProjectScreen} />
        <Stack.Screen name="Website" component={Website} />
        <Stack.Screen name="About" component={AboutUsScreen} />
        <Stack.Screen name="Wishlist" component={WishlistScreen} />
        <Stack.Screen name="Screen4" component={Screen4} />
        <Stack.Screen name="AllBranches" component={AllBranches} />
        <Stack.Screen name="Screen3" component={Screen3} />
        <Stack.Screen name="Screen2" component={Screen2} />

      </Stack.Navigator>
    </NavigationContainer>
    </TRPCProvider>
  );
};

export default App;
