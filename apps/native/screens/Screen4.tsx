import React from 'react';
import {
  View,
  Button,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import Card from '../Components/Card';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { api } from '../utils/trpc';

type Screen4Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Screen4'>;
  route: RouteProp<RootStackParamList, 'Screen4'>;
};

const Screen4: React.FC<Screen4Props> = ({ navigation, route }) => {
  const categoryName = route.params?.categoryName || 'All Projects';

  const { data, status } = api.project.getProjectByCategory.useQuery({
    category: categoryName,
  });

  if (status === 'loading') {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading Projects</Text>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error loading Projects</Text>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noProjectsText}>No projects for {categoryName}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {data.map((project, index) => (
          <TouchableOpacity
            key={project.id}
            onPress={() => navigation.navigate('Screen3', { id: project.id })}
          >
            <Card
              imageUri={`https://studoindustry.s3.ap-south-1.amazonaws.com/${project.images[0]}`}
              title={project.title}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Button title="Go back" onPress={() => navigation.goBack()} />
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
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
  },
  noProjectsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  scrollViewContent: {
    alignItems: 'center',
    paddingTop: 16,
  },
});


export default Screen4;
