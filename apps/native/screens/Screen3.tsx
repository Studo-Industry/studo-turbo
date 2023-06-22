import React from 'react';
import { View, Text, Button } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../App';

type Screen3Props = StackScreenProps<RootStackParamList, 'Screen3'>;
const Screen3: React.FC<Screen3Props> = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Screen 3</Text>
      <Button title='Go back' onPress={() => navigation.goBack()} />
    </View>
  );
};

export default Screen3;
