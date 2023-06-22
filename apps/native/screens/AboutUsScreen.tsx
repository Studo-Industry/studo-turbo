import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity,Linking } from 'react-native';
const handleLearnMore = () => {
    Linking.openURL('https://studo.vercel.app');
  };

const AboutUsScreen = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../img/about.png')}
        style={styles.backgroundImage}
        resizeMode="center"
        
      >
        <View style={styles.contentContainer}>
          <Text style={styles.title}>About Us</Text>
          <Text style={styles.description}>
            Studio Industry is a platform that bridges the gap between college students and the industry by providing real-life industry projects to students. Our goal is to empower students with practical experience and connect them with potential employers.
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleLearnMore}>
      <Text style={styles.buttonText}>Learn More</Text>
    </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#009688',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default AboutUsScreen;
