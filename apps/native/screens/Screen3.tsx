import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { api } from '../utils/trpc';
import { AntDesign } from '@expo/vector-icons';

type Screen3Props = StackScreenProps<RootStackParamList, 'Screen3'>;

type WishlistItem = {
  id: string;
  name: string;
  details: string;
  timeline: null;
  image: string;
};

const Screen3: React.FC<Screen3Props> = ({ navigation, route }) => {
  const { data, status } = api.project.getOne.useQuery({ id: route.params.id });
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(route.params?.wishlistItems || []);

  const addToWishlist = () => {
    if (data) {
      const newItem: WishlistItem = {
        id: data.id,
        name: data.title,
        details: data.description,
        timeline: data.implementation,
        image: `https://studoindustry.s3.ap-south-1.amazonaws.com/${data.images[0]}`,
      };
      const updatedWishlistItems = [...wishlistItems, newItem];
      setWishlistItems(updatedWishlistItems);
      navigation.navigate('Wishlist', { projectName: data.title, wishlistItems: updatedWishlistItems });
    }
  };

  if (status === 'loading') {
    return (
      <View style={styles.container2}>
        <Text style={styles.loadingText}>Loading Projects</Text>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.container2}>
        <Text style={styles.errorText}>Error loading Projects</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          {data?.images.map((image, index) => (
            <Image
              key={index}
              source={{
                uri: `https://studoindustry.s3.ap-south-1.amazonaws.com/${image}`,
              }}
              style={styles.image}
            />
          ))}
        </View>
        <Text style={styles.title}>{data?.title}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={addToWishlist}>
            <AntDesign name="heart" size={24} color="black" />
            <Text style={styles.buttonText}>Wishlist</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <AntDesign name="left" size={24} color="black" />
            <Text style={styles.buttonText}>Apply</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.card, styles.viewRankingsCard]}>
          <Text style={[styles.viewRankingsText, { color: '#000', fontSize: 18 }]}>View Rankings</Text>
        </TouchableOpacity>
        <Text style={styles.descriptionT}>Description:</Text>
        <Text style={styles.description}>{data?.description}</Text>
        <Text style={styles.descriptionT}>Implementation:</Text>
        <Text style={styles.description}>{data?.implementation}</Text>

        <Button title="Go back" onPress={() => navigation.goBack()} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container2: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 20,
  },
  errorText: {
    fontSize: 20,
    color: 'red',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 5,
    marginHorizontal: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
  },
  buttonText: {
    marginLeft: 5,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  viewRankingsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderColor: '#f0f0f0',
    borderWidth: 1,
  },
  viewRankingsText: {
    color: '#222',
    fontSize: 14,
    fontWeight: 'bold',
  },
  descriptionT: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
});

export default Screen3;
