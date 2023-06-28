  import React, { useState } from 'react';
  import { View, Text, Button, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
  import { StackScreenProps } from '@react-navigation/stack';
  import { RootStackParamList } from '../App';
  import { api } from '../utils/trpc';
  import { AntDesign } from '@expo/vector-icons';

  type Screen3Props = StackScreenProps<RootStackParamList, 'Screen3'>;

  const Screen3: React.FC<Screen3Props> = ({ navigation, route }) => {
    const { data, status } = api.project.getOne.useQuery({ id: route.params.id });
    const [wishlistItems, setWishlistItems] = useState([]);

    const addToWishlist = () => {
      if (data) {
        const newItem = {
          id: data.id,
          name: data.title,
          details: data.description,
          timeline: data.implementation,
          image: `https://studoindustry.s3.ap-south-1.amazonaws.com/${data.images[0]}`,
        };
        setWishlistItems((prevItems) => [...prevItems, newItem]);
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
          {/* Avaibility */}
          <TouchableOpacity style={[styles.card, styles.viewRankingsCard]}>
            <Text style={[styles.viewRankingsText, { color: '#000', fontSize: 18 }]}>View Rankings</Text>
          </TouchableOpacity>
          <Text style={styles.descriptionT}>Description: </Text>
          <Text style={styles.description}>{data?.description}</Text>
          <Text style={styles.descriptionT}>Implementation: </Text>
          <Text style={styles.description}>{data?.implementation}</Text>

          <Button title="Go back" onPress={() => navigation.goBack()} />
        </View>
      </ScrollView>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    container2: {
      backgroundColor: 'white',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    contentContainer: {
      padding: 15,
    },
    imageContainer: {
      width: '100%',
      height: 250,
      marginBottom: 10,
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: 'black',
    },
    buttonText: {
      marginLeft: 5,
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 5,
      paddingHorizontal: 10,
      paddingVertical: 10,
      marginBottom: 10,
      elevation: 3,
    },
    viewRankingsCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    viewRankingsText: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    descriptionT: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 10,
    },
    description: {
      fontSize: 16,
      marginBottom: 10,
    },
    loadingText: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    errorText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'red',
    },
  });

  export default Screen3;
