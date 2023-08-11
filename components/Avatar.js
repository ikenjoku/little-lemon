import React from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import { AuthContext } from "../context/AuthContext";

const Avatar = ({ width = 50, height = 50, radius = 25 }) => {
  const { userData } = React.useContext(AuthContext);
  const initials = `${userData.firstName?.[0] || ""}${
    userData.lastName?.[0] || ""
  }`.toUpperCase();

  return (
    <View style={[]}>
      {userData.image ? (
        <Image
          source={{ uri: userData.image }}
          style={[
            {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "grey",
              width: width,
              height: height,
              borderRadius: radius,
            },
          ]}
        />
      ) : (
        <View
          style={[
            {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "grey",
              width: width,
              height: height,
              borderRadius: radius,
            },
          ]}
        >
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
      )}
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
});

export default Avatar;
