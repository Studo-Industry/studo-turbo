import React from 'react';
import { View, Text, Button } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../App';

type Screen4Props = StackScreenProps<RootStackParamList, 'Screen4'>;
const Screen4: React.FC<Screen4Props> = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Screen 4</Text>
      <Button title='Go back' onPress={() => navigation.goBack()} />
    </View>
  );
};

export default Screen4;
