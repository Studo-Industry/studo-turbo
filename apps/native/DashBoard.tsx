import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

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
    imageUri:
      'https://www.cyberark.com/wp-content/uploads/2019/11/Developer.jpg',
    projectName: 'IT Engineering Projects',
  },
  {
    icon: 'settings',
    text: 'Mechanical',
    imageUri:
      'https://st2.depositphotos.com/6809168/10567/v/450/depositphotos_105676068-stock-illustration-engineer-working-on-blueprint.jpg',
    projectName: 'Mechanical Engineering Projects',
  },
  {
    icon: 'memory',
    text: 'Electronics',
    imageUri:
      'https://media.istockphoto.com/id/584570730/vector/electronics-repair-vector.jpg?s=170667a&w=0&k=20&c=f6zy0j0PS9wBlmcWKIsF4rn5Bl-RBzRI9vaLGHVCCNQ=',
    projectName: 'Electronics Engineering Projects',
  },
  {
    icon: 'desktop-mac',
    text: 'Computer Science',
    imageUri:
      'https://www.shutterstock.com/image-illustration/line-web-concept-computer-science-260nw-525822841.jpg',
    projectName: 'CS Engineering Projects',
  },
  {
    icon: 'person-search',
    text: 'Artificial Intelligence',
    imageUri:
      'https://www.cyberark.com/wp-content/uploads/2019/11/Developer.jpg',
    projectName: 'IT Engineering Projects',
  },
  {
    icon: 'apartment',
    text: 'Civil',
    imageUri:
      'https://thumbnails.cbsig.net/_x/w400/CBS_Production_Entertainment_VMS/2019/10/15/1623811651675/bob_the_builder_033_16x9_132680_1920x1080.jpg',
    projectName: 'Civil Engineering Projects',
  },
];
// const projects = [
//   {
//     icon: "groups",
//     text: "Mechanical Engineering",
//     projectName: "IT Engineering Projects",
//   },
//   {
//     icon: "favorite",
//     text: "Electrical Engineering",
//     projectName: "CS Engineering Projects",
//   },
//   {
//     icon: "emoji-events",
//     text: "Civil Engineering",
//     projectName: "Electronics Engineering Projects",
//   },
//   {
//     icon: "person",
//     text: "Computer Science",
//     projectName: "Mechanical Engineering Projects",
//   },
//   {
//     icon: "groups",
//     text: "Chemical Engineering",
//     projectName: "IT Engineering Projects",
//   },
//   {
//     icon: "favorite",
//     text: "Aerospace Engineering",
//     projectName: "IT Engineering Projects",
//   },
// ];

const projectsData = [
  {
    id: 1,
    image: require("./img/project.png"),
    name: "Project 1",
    description: "Description of Project 1",
  },
  {
    id: 2,
    image: require("./img/project.png"),
    name: "Project 2",
    description: "Description of Project 2",
  },
  {
    id: 3,
    image: require("./img/project.png"),
    name: "Project 3",
    description: "Description of Project 3",
  },
  // Add more projects here
];

const { width } = Dimensions.get('window');
const maxButtons = 6;
const buttonSize = (width - 48) / maxButtons;

const Dashboard = () => {
  const navigation = useNavigation();

  const handleImageClick = (project) => {
    navigation.navigate('Projects', { project });
  };

  const handleViewAllPro = (projectName) => {
    navigation.navigate('Project', { projectName });
  };

  const handleViewAllPress = () => {
    navigation.navigate('AllBranches');
  };

  const renderButtons = () => {
    const handleButtonPress = (text) => {
      switch (text) {
        case 'My Team':
          navigation.navigate('MyTeam');
          break;
        case 'Wishlist':
          navigation.navigate('Wishlist');
          break;
        case 'Milestone':
          navigation.navigate('Milestone');
          break;
        // case 'Milestone':
        //   navigation.navigate('Screen3');
        //   break;
        // case 'Profile':
        //   navigation.navigate('Profile');
        //   break;
        case 'Profile':
          navigation.navigate('Screen4');
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

  const renderCards = () => {
    const handleImageClick = (project) => {
      navigation.navigate('Projects', { project });
    };

    const rows = [];
    const numColumns = 3;
    const numRows = Math.ceil(projects.length / numColumns);

    for (let row = 0; row < numRows; row++) {
      const startIndex = row * numColumns;
      const endIndex = startIndex + numColumns;
      const rowData = projects.slice(startIndex, endIndex);

      rows.push(
        <View style={styles.cardRow} key={row}>
          {rowData.map((project, index) => (
            <TouchableOpacity
              style={styles.card}
              key={index}
              onPress={() => handleImageClick(project)}
            >
              <View style={styles.circularBackground}>
                <Image
                  source={{ uri: project.imageUri }}
                  style={styles.cardImage}
                />
              </View>
              <MaterialIcons
                name={project.icon}
                size={32}
                color='#808080'
                style={styles.cardIcon}
              />
              <Text style={styles.cardText}>{project.text}</Text>
            </TouchableOpacity>
          ))}
        </View>,
      );
    }

    return rows;
  };

  const renderProjects = (projects) => {
    return (
      <ScrollView horizontal>
        {projects.map((project) => (
          <TouchableOpacity
            style={styles.projectCard}
            key={project.projectName}
            onPress={() => handleViewAllPro(project.projectName)}
          >
            <Image
              source={project.image}
              style={styles.projectImage}
              resizeMode='cover'
            />
            <Text style={styles.projectText}>{project.projectName}</Text>
            <Text style={styles.projectDescription}>{project.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.buttonWrapper}>{renderButtons()}</View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Browse By Category</Text>
          <TouchableOpacity
            style={styles.viewAllLink}
            onPress={() => handleViewAllPress(null)}
          >
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cardContainer}>{renderCards()}</View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All Projects</Text>
          <TouchableOpacity
            style={styles.viewAllLink}
            onPress={() => handleViewAllPro(null)}
          >
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        {renderProjects(projectsData)}
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
    flexDirection: 'column',
    marginTop: 8,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  card: {
    flex: 1,
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
    marginRight: 8,
  },
  cardIcon: {
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  projectCard: {
    width: 200,
    marginRight: 16,
    borderRadius: 8,
    borderColor: '#d9d9d9',
    borderWidth: 1, // Add border width
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 8,
  },
  projectImage: {
    width: 200,
    height: 125,
    borderRadius: 8,
  },
  projectText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  projectDescription: {
    fontSize: 15,
    color: 'gray',
    marginBottom: 8,
  },
});

export default Dashboard;
