import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

const SplashScreen = () =>  {

    return (
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require("../assets/little-lemon-logo.png")}
        />
      </View>
    );
}

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center"
  },
  image: {
    width: 200,
    height: 250,
    resizeMode: "contain",
  }
});

export default SplashScreen;
