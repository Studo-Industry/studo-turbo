import React from 'react';
import {
  View,
  Button,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import Config from 'react-native-config';
import Card from '../Components/Card'; // Import the Card component
import { RootStackParamList } from '../App';
import { StackScreenProps } from '@react-navigation/stack';
import { api } from '../utils/trpc';

type Screen4Props = StackScreenProps<RootStackParamList, 'Screen4'>;
const projectCategories = [
  { name: 'All Projects' },
  { name: 'Computer science engineering' },
  { name: 'Information technology engineering' },
  { name: 'Electrical engineering' },
  { name: 'Electronics engineering' },
  { name: 'Mechanical engineering' },
  { name: 'Civil engineering' },
  { name: 'Electrical vehicle (EV) engineering' },
  { name: 'Electronic & communication engineering' },
  { name: 'Biomedical engineering' },
  { name: 'Agricultural engineering' },
  { name: 'Mechatronics engineering' },
  { name: 'Biochemical engineering' },
  { name: 'Production engineering' },
  { name: 'Textile engineering' },
  { name: 'Automobile engineering' },
  { name: 'Biotechnology engineering' },
  { name: 'Cyber security engineering' },
  { name: 'Instrumentation technology engineering' },
];
const Screen4: React.FC<Screen4Props> = ({ navigation }) => {
  const { data, status } = api.project.getSample.useQuery({
    category: 'Computer science engineering',
  });
  // const cards = [
  //   {
  //     imageKey: 'c529779b-6e63-4462-a815-5afa537871b7.jpeg',
  //     title: '3D Printed and Fabricated Accessories Set for Agriculture Rain Pipe',
  //   },
  //   {
  //     imageKey: '25299369-8c62-4501-8d3a-762fa620d970.png',
  //     title: 'Foldable Electric Scooter Mini Tricycle',
  //   },
  //   {
  //     imageKey: '25299369-8c62-4501-8d3a-762fa620d970.png',
  //     title: ' Development of Commercial Hydraulic Pallet Truck for Loading & Unloading Goods 3-wheeler.',
  //   },
  //   // Add more card objects as needed
  // ];
  // console.log(Config.NEXT_PUBLIC_AWS_S3)
  if (status === 'loading') return <Text>Loading </Text>;
  if (status === 'error') return <Text>Error loading data </Text>;
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {data?.map((project, index) => (
          <TouchableOpacity
            key={project.id}
            onPress={() => navigation.navigate('Screen3', { id: project.id })}
          >
            <Card
              imageUri={`https://studoindustry.s3.ap-south-1.amazonaws.com/${project.images[0]}`}
              // imageUri={`https://studoindustry.s3.ap-south-1.amazonaws.com/c529779b-6e63-4462-a815-5afa537871b7.jpeg`}
              title={project.title}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Button title='Go back' onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
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
