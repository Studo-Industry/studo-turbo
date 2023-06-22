import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";

const Profile = () => {
  const profileImageUrl =
    "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";

  // Define the profile data using state
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    college: "Terna Engineering College",
    branch: "Computer Science",
    doneProjects: "15",
    skills: "Web Development, UI/UX Design",
    teamName: "Creative Minds",
    applied: "2",
  });

  // Function to handle the edit profile button press
  const handleEditProfile = () => {
    // Navigate to the edit profile screen or show a modal
    // where the user can edit the profile data

    // Example: Update the profile data and show a notification
    const updatedProfileData = {
      ...profileData,
      name: "Jane Doe", // Example: Update the name
      email: "janedoe@example.com", // Example: Update the email
    };

    setProfileData(updatedProfileData);

    // Show a notification for successful profile editing
    Alert.alert("Profile Edited Successfully");
  };

  return (
    <ScrollView>
    <View style={styles.container}>
      <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
      <View style={styles.profileInfo}>
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{profileData.name}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{profileData.email}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.label}>College:</Text>
            <Text style={styles.value}>{profileData.college}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.label}>Branch:</Text>
            <Text style={styles.value}>{profileData.branch}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.label}>Done Projects:</Text>
            <Text style={styles.value}>{profileData.doneProjects}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.label}>Skills:</Text>
            <Text style={styles.value}>{profileData.skills}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.label}>Team Name:</Text>
            <Text style={styles.value}>{profileData.teamName}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.label}>Applied Projects:</Text>
            <Text style={styles.value}>{profileData.applied}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: "55%",
    aspectRatio: 1,
    resizeMode: "cover",
    marginBottom: 30,
    borderRadius: 20,
  },
  profileInfo: {
    flexDirection: "row",
    marginBottom: 30,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    elevation: 5,
    overflow: "hidden",
  },
  detailsContainer: {
    flex: 1,
    padding: 20,
    paddingRight: 50,
  },
  detailItem: {
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
    marginRight: 5,
  },
  value: {
    fontSize: 16,
    color: "#666",
  },
  editButton: {
    backgroundColor: "#39B9B6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 20,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default Profile;
