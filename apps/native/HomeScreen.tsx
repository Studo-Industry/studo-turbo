import React from 'react';
import { View, Text, Button } from 'react-native';
import { RootStackParamList } from './App';
import { StackScreenProps } from '@react-navigation/stack';
import { api } from './utils/trpc';

type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>;
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const hello = api.example.hello.useQuery({ message: 'hiii' });
  console.log('hereh', hello);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title='Go to Screen 2 xxxxxx'
        onPress={() => navigation.navigate('Screen2')}
      />
    </View>
  );
};

export default HomeScreen;
