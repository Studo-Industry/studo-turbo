import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  Button,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Card from './Components/Card';
import type { RootStackParamList } from './App';
import { api } from './utils/trpc';
import { RouteProp } from '@react-navigation/native';
import { Icon } from 'react-native-vector-icons/Icon';
import { StackNavigationProp } from '@react-navigation/stack';
import GoogleLogIn from './utils/google';

const buttonsData = [
  { icon: 'groups', text: 'My Team' },
  { icon: 'favorite', text: 'Wishlist' },
  { icon: 'emoji-events', text: 'Milestone' },
  { icon: 'person', text: 'Profile' },
  { icon: 'folder-open', text: 'My Projects' },
  { icon: 'language', text: 'Refer Website' },
  { icon: 'info-outline', text: 'About Us' },
];

const projects = [
  {
    icon: 'computer',
    text: 'Information Technology',
  },
  {
    icon: 'settings',
    text: 'Mechanical',
  },
  {
    icon: 'memory',
    text: 'Electronics',
  },
  {
    icon: 'desktop-mac',
    text: 'Computer science engineering',
  },
  {
    icon: 'person-search',
    text: 'Artificial Intelligence',
  },
  {
    icon: 'apartment',
    text: 'Civil',
  },
];

const { width } = Dimensions.get('window');
const maxButtons = 6;
const buttonSize = (width - 48) / maxButtons;
const projectCategories = [
  // { name: 'All Projects' },
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

type DashboardProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Dashboard'>;
  route: RouteProp<RootStackParamList, 'Dashboard'>;
};

const Dashboard: React.FC<DashboardProps> = ({ navigation }) => {
  const handleCardPress = (categoryName: string) => {
    navigation.navigate('Screen4', { categoryName });
  };

  const handleViewAllPress = () => {
    navigation.navigate('AllBranches');
  };
  const { data, status } = api.project.getProjectByCategory.useQuery({
    category: 'All Projects',
  });

  const handleButtonPress = (text: string) => {
    switch (text) {
      case 'My Team':
        navigation.navigate('MyTeam');
        break;
      // case 'Wishlist':
      //   navigation.navigate('Wishlist');
      //   break;
      case 'Milestone':
        navigation.navigate('Milestone');
        break;
      case 'Profile':
        navigation.navigate('Profile');
        break;
      case 'My Projects':
        navigation.navigate('MyProject');
        break;
      case 'Refer Website':
        navigation.navigate('Website');
        break;
      case 'About Us':
        navigation.navigate('About');
        break;
      default:
        break;
    }
  };

  const renderButtons = () => {
    const visibleButtons = buttonsData.slice(0, 4);
    const remainingButtons = buttonsData.slice(4);

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {visibleButtons.map((button, index) => (
          <View style={styles.buttonItem} key={index}>
            <TouchableOpacity
              style={[
                styles.buttonContainer,
                { width: buttonSize, height: buttonSize },
              ]}
              onPress={() => handleButtonPress(button.text)}
            >
              <MaterialIcons
                name={button.icon}
                size={32}
                color='#FFD700'
                style={styles.buttonIcon}
              />
            </TouchableOpacity>
            <Text style={styles.buttonText}>{button.text}</Text>
          </View>
        ))}
        {remainingButtons.map((button, index) => (
          <View style={styles.buttonItem} key={index + visibleButtons.length}>
            <TouchableOpacity
              style={[
                styles.buttonContainer,
                { width: buttonSize, height: buttonSize },
              ]}
              onPress={() => handleButtonPress(button.text)}
            >
              <MaterialIcons
                name={button.icon}
                size={32}
                color='#FFD700'
                style={styles.buttonIcon}
              />
            </TouchableOpacity>
            <Text style={styles.buttonText}>{button.text}</Text>
          </View>
        ))}
      </ScrollView>
    );
  };
  const visibleCategories = projectCategories.slice(0, 4);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.buttonWrapper}>{renderButtons()}</View>
      </View>
      <View>
        <GoogleLogIn />
      </View>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Browse By Category</Text>
          <TouchableOpacity
            style={styles.viewAllLink}
            onPress={() => handleViewAllPress()}
          >
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardContainer}>
        {visibleCategories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => handleCardPress(category.name)}
            disabled={index >= 4}
          >
            <Text style={styles.Text}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Browse By Projects</Text>
          <TouchableOpacity
            style={styles.viewAllLink}
            onPress={() => handleCardPress('All Projects')}
          >
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.container}>
        <ScrollView
          horizontal={true} // Set horizontal prop to true
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
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
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  scrollViewContent: {
    alignItems: 'center',
    paddingTop: 16,
    flexDirection: 'row',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllLink: {
    backgroundColor: 'transparent',
  },
  viewAllText: {
    fontSize: 16,
    color: 'gray',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#F39920',
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  buttonItem: {
    alignItems: 'center',
    marginHorizontal: 7.4,
  },
  buttonContainer: {
    borderRadius: buttonSize / 2,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 8,
    marginBottom: 8,
    marginTop: 4,
  },
  buttonIcon: {
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  buttonText: {
    fontSize: 12,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 25,
  },
  card: {
    width: width / 2 - 24,
    height: 125,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 8,
    marginRight: 3,
    marginLeft: 5,
  },
  cardIcon: {
    marginBottom: 8,
  },
  Text: {
    fontSize: 15,
  },
});

export default Dashboard;
