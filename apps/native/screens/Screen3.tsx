import React from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../App';

type Screen3Props = StackScreenProps<RootStackParamList, 'Screen3'>;

const Screen3: React.FC<Screen3Props> = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={styles.card}>
        <Image
          source={{ uri: 'https://studoindustry.s3.ap-south-1.amazonaws.com/c529779b-6e63-4462-a815-5afa537871b7.jpeg' }}
          style={styles.image}
        />
        <Text style={styles.title}>Card Title</Text>
      </View>
      <Button title='Go back' onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Screen3;
