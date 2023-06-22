import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: '1',
      name: 'Project 1',
      details: 'Project details 1',
      timeline: 'Timeline 1',
      // image: require('../img/project.png'), // Replace with your own image source
    },
    {
      id: '2',
      name: 'Project 2',
      details: 'Project details 2',
      timeline: 'Timeline 2',
      // image: require('../img/project.png'), // Replace with your own image source
    },
    {
      id: '3',
      name: 'Project 3',
      details: 'Project details 3',
      timeline: 'Timeline 3',
      // image: require('../img/project.png'), // Replace with your own image source
    },
  ]);

  const removeProject = (projectId) => {
    const updatedWishlist = wishlistItems.filter((project) => project.id !== projectId);
    setWishlistItems(updatedWishlist);
  };

  const RenderImage = ({ image }) => (
    <View style={styles.imageContainer}>
      <View style={styles.imageBox}>
        <Image source={image} style={styles.image} />
      </View>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <RenderImage image={item.image} />
      <View style={styles.textContainer}>
        <Text style={styles.projectName}>{item.name}</Text>
        <Text style={styles.details}>{item.details}</Text>
        <Text style={styles.timeline}>{item.timeline}</Text>
      </View>
      <TouchableOpacity style={styles.removeButton} onPress={() => removeProject(item.id)}>
        <Ionicons name="close" size={16} color="#FFFFFF" />
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wishlist</Text>
      <FlatList
        data={wishlistItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333333',
  },
  listContainer: {
    paddingTop: 8,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  imageContainer: {
    marginRight: 16,
  },
  imageBox: {
    borderWidth: 0.5,
    borderColor: '#888888', // or 'gray'
    borderRadius: 4,
    elevation: 4,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 4,
    
  },
  textContainer: {
    flex: 1,
  },
  projectName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  details: {
    fontSize: 16,
    marginBottom: 8,
    color: '#888',
  },
  timeline: {
    fontSize: 16,
    marginBottom: 16,
    color: '#666',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

export default WishlistPage;
