import React, { useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import Constant from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";

export default function Header() {
  const [profileImage, setProfileImage] = useState(null);

  const handleImageUpload = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access the camera roll is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync();

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri); // Access the first selected asset URI
    }
  };

  return (
    <View
      style={{
        marginTop: Constant.statusBarHeight,
        // marginTop:10,
        height: 75,
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor:"white",
      }}
    >
      <View style={{ margin: 10 }}>
        <Image
          source={require("../img/Navbar_Logo.png")}
          style={{ width: 100, height: 50 }}
        />
      </View>
      <View style={{ margin: 10 }}>
        <TouchableOpacity onPress={handleImageUpload}>
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={{ width: 55, height: 55, borderRadius: 27.5 }}
            />
          ) : (
            <Ionicons
              name="md-person-circle-outline"
              size={55}
              color="#39B9B6"
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
