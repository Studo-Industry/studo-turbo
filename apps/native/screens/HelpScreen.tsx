import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';

const emailAddress = 'abhithorat.24@gmail.com';

const handleContactSupport = () => {
  Linking.openURL(`mailto:${emailAddress}`);
};

const HelpScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../img/help.jpg')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>Help & Support</Text>
      <Text style={styles.description}>
        If you need any assistance or have any questions regarding the Studio Industry app, please feel free to contact our support team at support@studioindustry.com. We are here to help you!
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleContactSupport}>
        <Text style={styles.buttonText}>Contact Support</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 20,
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

export default HelpScreen;
