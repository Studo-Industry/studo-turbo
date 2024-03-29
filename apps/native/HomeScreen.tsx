import React from 'react';
import { View, Text, Button } from 'react-native';
import { RootStackParamList } from './App';
import { StackScreenProps } from '@react-navigation/stack';
import { api } from './utils/trpc';

type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>;
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { data, isLoading } = api.example.hello.useQuery({ text: 'hiii' });
  if (isLoading) return <Text>Loading</Text>;
  //   const { data, isLoading } = api.project.getSample.useQuery({category:"Computer science engineering"});
  // console.log(data);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Text>{data?.greeting}</Text>
      <Button
        title='DashBoard'
        onPress={() => navigation.navigate('DashBoard')}
      />
      <Button
        title='Go to Screen 3 '
        onPress={() => navigation.navigate('Screen3')}
      />
      <Button title='Screen 4' onPress={() => navigation.navigate('Screen4')} />
    </View>
  );
};

export default HomeScreen;
