import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

type CardProps = {
  imageUri: string;
  title: string;
};

const Card: React.FC<CardProps> = ({ imageUri, title,}) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} />
      </View>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    paddingBottom:5,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.50,
    shadowRadius: 4,
    elevation: 8,
    width: 320,
    height: 290,
    marginBottom: 18,
    marginLeft: 8,  // Add marginLeft
    marginRight: 8, // Add marginRight
  },
  imageContainer: {
    width: '100%',
    height: '70%',
    overflow: 'hidden',
    borderRadius: 8,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  
});

export default Card;
