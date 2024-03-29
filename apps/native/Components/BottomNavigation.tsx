import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Octicons } from '@expo/vector-icons';
import Dashboard from '../DashBoard';
import Help from '../screens/HelpScreen';
import Profile from '../screens/Profile';
import MyTeam from "../screens/MyProjectsScreen";
import MyProjectScreen from '../screens/MyProjectsScreen';

const Tab = createBottomTabNavigator();

const BottomNavigation: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'MyTeam') {
            iconName = focused ? 'info' : 'info-outline';
          // } else if (route.name === 'Wishlist') {
          //   iconName = focused ? 'info' : 'info-outline';
          } else if (route.name === 'Help') {
            iconName = focused ? 'info' : 'info-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Octicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#F39920',
        inactiveTintColor: 'gray',
        style: {
          backgroundColor: '#f5f5f5',
          borderTopWidth: 1,
          borderTopColor: '#ccc',
        },
        labelStyle: {
          fontSize: 12,
          marginBottom: 6,
        },
      }}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="MyTeam" component={MyProjectScreen} />
      {/* <Tab.Screen name="Wishlist" component={WishlistScreen} /> */}
      <Tab.Screen name="Help" component={Help} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default BottomNavigation;
