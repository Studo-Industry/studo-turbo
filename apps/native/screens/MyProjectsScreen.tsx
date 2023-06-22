import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";

const MyProjectScreen = () => {
  const [projects, setProjects] = useState([]);

  // Simulated data for projects
  const dummyProjects = [
    {
      id: 1,
      title: "Design and Fabrication of a Manual Seed Planter",
      description: "Description of Project",
    //   imageUrl: "https://example.com/project1.jpg",
    },
    {
      id: 2,
      title: "Project 2",
      description: "Description for Project 2",
    //   imageUrl: "https://example.com/project2.jpg",
    },
    {
      id: 3,
      title: "Project 3",
      description: "Description for Project 3",
    //   imageUrl: "https://example.com/project3.jpg",
    },
    {
      id: 4,
      title: "Project 4",
      description: "Description for Project 4",
      imageUrl: "", // Empty URL to simulate missing image
    },
    {
        id: 5,
        title: "Project 5",
        description: "Description for Project 5",
        imageUrl: "", // Empty URL to simulate missing image
      },
  ];


  useEffect(() => {
    // Fetch projects from API or database
    // For now, using simulated data
    setProjects(dummyProjects);
  }, []);

  const renderProjectItem = ({ item }) => (
    <View style={styles.projectItem}>
      <View style={styles.imageContainer}>
        <View style={styles.imageShadow}>
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.projectImage} />
          ) : (
            <Image
              source={require("../img/project.png")}
              style={styles.projectImage}
            />
          )}
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.projectTitle}>{item.title}</Text>
        <Text style={styles.projectDescription}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Projects</Text>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProjectItem}
        contentContainerStyle={styles.projectList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  projectList: {
    flexGrow: 1,
  },
  projectItem: {
    maxWidth:"95%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    marginHorizontal:"2%",
    marginBottom: 18,
    flexDirection: "row",
    elevation: 7,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  imageContainer: {
    marginRight: 20,
  },
  imageShadow: {
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 2,
    shadowRadius: 4,
    elevation: 5,
  },
  projectImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    resizeMode: "cover",
  },
  textContainer: {
    flex: 1,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  projectDescription: {
    fontSize: 16,
    color: "#666",
  },
});

export default MyProjectScreen;
