import React from 'react';
import {
  View,
  Button,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import Card from '../Components/Card'; // Import the Card component
import { RootStackParamList } from '../App';
import { StackScreenProps } from '@react-navigation/stack';
import { api } from '../utils/trpc';

type AllBranchesProps = StackScreenProps<RootStackParamList, 'AllBranches'>;
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
const AllBranches: React.FC<AllBranchesProps> = ({ navigation }) => {
  const { data } = api.project.getSample.useQuery({
    category: 'Computer science engineering',  
  });
  
  return (
    <View style={styles.container}>
      <TouchableOpacity
                  style={[styles.card]}
                >
                  <Text
                    style={[
                      styles.Text,
                      { color: '#000', fontSize: 18 },
                    ]}
                  >
                    Branch
                  </Text>
                  
                </TouchableOpacity>
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
  card: {
    width: '90%',
    margin:20,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    shadowColor: 'rgba(0, 0, 0, 1)',
    shadowOpacity: 1,
    shadowOffset: {
      width: 2,
      height: 10,
    },
    shadowRadius: 4,
    elevation: 10,
  },
  Text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#000',
  },
});

export default AllBranches;
