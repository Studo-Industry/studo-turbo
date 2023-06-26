import React from 'react';
import { View, Text, Button, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { api } from '../utils/trpc';
import { AntDesign } from '@expo/vector-icons';

type Screen3Props = StackScreenProps<RootStackParamList, 'Screen3'>;

const Screen3: React.FC<Screen3Props> = ({ navigation, route }) => {
  const { data, status } = api.project.getOne.useQuery({ id: route.params.id });
  if (status === 'loading') return <Text>Loading...</Text>;
  if (status === 'error') return <Text>Error loading data...</Text>;

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
          <TouchableOpacity style={styles.button}>
            <AntDesign name="heart" size={24} color="black" />
            <Text style={styles.buttonText}>Wishlist</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <AntDesign name="left" size={24} color="black" />
            <Text style={styles.buttonText}>Apply</Text>
          </TouchableOpacity>
        </View>
          {/* Avaibility */}
        <TouchableOpacity
                  style={[styles.card, styles.viewRankingsCard]}
                >
                  <Text
                    style={[
                      styles.viewRankingsText,
                      { color: '#000', fontSize: 18 },
                    ]}
                  >
                    View Rankings
                  </Text>
                  
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
  contentContainer: {
    padding: 15,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
    textAlign: 'left',
    marginHorizontal: 12,
  },
  descriptionT: {
    marginTop:20,
    fontSize: 18,
    marginBottom: 4,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'column',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f39920',
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
    width: '100%',
    height: 50,
  },
  buttonText: {
    color: '#FFF',
    marginLeft: 10,
    fontSize: 17,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    shadowColor: 'rgba(0, 0, 0, 1)',
    shadowOpacity: 1,
    shadowOffset: {
      width: 2,
      height: 10,
    },
    shadowRadius: 4,
    elevation: 10,
  },
  viewRankingsCard: {
    marginTop: 10,
  },
  viewRankingsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#000',
  },
});

export default Screen3;
