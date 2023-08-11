import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import Avatar from "./Avatar";

const Header = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View></View>
      <View>
        <Image
          style={styles.logo}
          source={require("../assets/little-lemon-logo-grey.png")}
        />
      </View>
      <View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Profile");
          }}
        >
          <Avatar />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#ffffff",
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  flex: {
    flex: 1,
  },
});

export default Header;
