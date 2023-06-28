import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const WishlistPage = ({ route }) => {
  const [wishlistItems, setWishlistItems] = useState(route.params?.wishlistItems || []);

  const removeProject = (projectId: any) => {
    const updatedWishlist = wishlistItems.filter((project: { id: any; }) => project.id !== projectId);
    setWishlistItems(updatedWishlist);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Wishlist</Text>
        {wishlistItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => removeProject(item.id)}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.detailsContainer}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.details}>{item.details}</Text>
              <Text style={styles.details}>{item.timeline}</Text>
            </View>
            <AntDesign name="delete" size={24} color="black" />
          </TouchableOpacity>
        ))}
        {wishlistItems.length === 0 && (
          <Text style={styles.emptyText}>Your wishlist is empty</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    borderRadius: 5,
    marginRight: 10,
  },
  detailsContainer: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  details: {
    fontSize: 16,
  },
  emptyText: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default WishlistPage;
