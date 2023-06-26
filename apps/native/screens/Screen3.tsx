import React from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { api } from '../utils/trpc';

type Screen3Props = StackScreenProps<RootStackParamList, 'Screen3'>;

const Screen3: React.FC<Screen3Props> = ({ navigation, route }) => {
  const { data, status } = api.project.getOne.useQuery({ id: route.params.id });
  if (status === 'loading') return <Text> Loading...</Text>;
  if (status === 'error') return <Text> Error loading data...</Text>;
  return (
    <View>
      <Text>{data?.title}</Text>
      <Text>{data?.description}</Text>
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

      <Button title='Go back' onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
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
export default Screen3;
