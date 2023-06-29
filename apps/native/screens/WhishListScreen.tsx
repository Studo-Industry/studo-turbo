import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useWishlist } from './WishlistContext';

type WishlistItem = {
  id: string;
  name: string;
};

const WishlistScreen = () => {
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const navigation = useNavigation();
  const route = useRoute();

  // Get the project name from the route params
  const projectName = route.params?.projectName;

  const handleAddToWishlist = () => {
    const newWishlistItem: WishlistItem = {
      id: String(Date.now()),
      name: projectName || 'New Project',
    };

    addToWishlist(newWishlistItem);
  };

  const handleRemoveFromWishlist = (id: string) => {
    removeFromWishlist(id);
  };

  const renderItem = ({ item }: { item: WishlistItem }) => (
    <TouchableOpacity
      style={styles.wishlistItem}
      onPress={() => handleRemoveFromWishlist(item.id)}
    >
      <Text style={styles.wishlistItemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wishlist</Text>
      <FlatList
        data={wishlist}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.wishlistContainer}
        ListEmptyComponent={() => (
          <Text style={styles.emptyMessage}>No projects in the wishlist</Text>
        )}
      />
      {/* Remove the Add Project button */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  wishlistContainer: {
    flexGrow: 1,
    marginBottom: 16,
  },
  wishlistItem: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 8,
  },
  wishlistItemText: {
    fontSize: 16,
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default WishlistScreen;
