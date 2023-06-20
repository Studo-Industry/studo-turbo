import React from 'react';
import { View, Text, Button } from 'react-native';
import { RootStackParamList } from './App';
import { StackScreenProps } from '@react-navigation/stack';

type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>;
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title='Go to Screen 2'
        onPress={() => navigation.navigate('Screen2')}
      />
    </View>
  );
};

export default HomeScreen;
