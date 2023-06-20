import React from 'react';
import { View, Text, Button } from 'react-native';

const Screen2 = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Screen 2</Text>
      <Button
        title="Go to Screen 3"
        onPress={() => navigation.navigate('Screen3')}
      />
      <Button
        title="Go to Home Screen"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
};

export default Screen2;
