import React from 'react';
import { View, Button, StyleSheet, ScrollView } from 'react-native';
import Config from 'react-native-config';
import Card from '../Components/Card'; // Import the Card component
import { RootStackParamList } from '../App';
import { StackScreenProps } from '@react-navigation/stack';

type Screen4Props = StackScreenProps<RootStackParamList, 'Screen4'>;

const Screen4: React.FC<Screen4Props> = ({ navigation }) => {
  const cards = [
    {
      imageKey: 'c529779b-6e63-4462-a815-5afa537871b7.jpeg',
      title: '3D Printed and Fabricated Accessories Set for Agriculture Rain Pipe',
    },
    {
      imageKey: '25299369-8c62-4501-8d3a-762fa620d970.png',
      title: 'Foldable Electric Scooter Mini Tricycle',
    },
    {
      imageKey: '25299369-8c62-4501-8d3a-762fa620d970.png',
      title: ' Development of Commercial Hydraulic Pallet Truck for Loading & Unloading Goods 3-wheeler.',
    },
    // Add more card objects as needed
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}showsVerticalScrollIndicator={false}>
        {cards.map((card, index) => (
          <Card
            key={index}
            // imageUri={`${Config.NEXT_PUBLIC_AWS_S3}${card.imageKey}`}
            imageUri={`https://studoindustry.s3.ap-south-1.amazonaws.com/c529779b-6e63-4462-a815-5afa537871b7.jpeg`}
            title={card.title}
            
            
          />
        ))}
      </ScrollView>
      <Button title='Go back' onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollViewContent: {
    alignItems: 'center',
    paddingTop: 16,
    
  },
});

export default Screen4;
