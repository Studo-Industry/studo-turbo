import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";

const Profile = () => {
  const [profileImageUrl, setProfileImageUrl] = useState(
    "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
  );

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

  const [editMode, setEditMode] = useState(false); // Add edit mode state

  const handleEditProfile = () => {
    if (editMode) {
      // Save changes when exiting edit mode
      setEditMode(false);
      // Save profile data changes to backend or storage
      Alert.alert("Changes Saved", "Profile changes have been saved.");
    } else {
      // Enter edit mode
      setEditMode(true);
    }
  };

  const handleSelectProfileImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Denied",
        "You need to grant access to your photos to select a profile image."
      );
      return;
    }

    const imageResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!imageResult.cancelled) {
      setProfileImageUrl(imageResult.uri);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
        <TouchableOpacity style={styles.editButton} onPress={handleSelectProfileImage}>
          <Text style={styles.editButtonText}>Select Profile Image</Text>
        </TouchableOpacity>
        <View style={styles.profileInfo}>
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Name:</Text>
              {editMode ? (
                <TextInput
                  style={styles.editableInput}
                  value={profileData.name}
                  onChangeText={(text) => setProfileData({ ...profileData, name: text })}
                />
              ) : (
                <Text style={styles.value}>{profileData.name}</Text>
              )}
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Email:</Text>
              {editMode ? (
                <TextInput
                  style={styles.editableInput}
                  value={profileData.email}
                  onChangeText={(text) => setProfileData({ ...profileData, email: text })}
                />
              ) : (
                <Text style={styles.value}>{profileData.email}</Text>
              )}
            </View>
            {/* ... (other profile details) */}
          </View>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Text style={styles.editButtonText}>{editMode ? "Save Changes" : "Edit Profile"}</Text>
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
  profileImage: {
    width: "55%",
    aspectRatio: 1,
    resizeMode: "cover",
    marginBottom: 20,
    borderRadius: 20,
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
  profileInfo: {
    flexDirection: "row",
    marginBottom: 20,
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
  editableInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 5,
    fontSize: 16,
    color: "#333",
  },
});

export default Profile;
