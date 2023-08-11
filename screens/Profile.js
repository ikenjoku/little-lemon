import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Alert,
  Pressable,
  ScrollView,
  TextInput,
  Image,
  // Checkbox,
} from "react-native";
import Constants from "expo-constants";
import { Checkbox } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

import useUpdate from "../utils/useUpdate";
import { AuthContext } from "../context/AuthContext";
import {
  AUTH_KEY,
  retrieveData,
  storeData,
  DEFAULT_STATE,
} from "../utils/asyncStore";
import { validateUSPhoneNumber } from "../utils/validateUSPhoneNumber";

export default function ProfileScreen() {
  const [form, setForm] = React.useState(DEFAULT_STATE);
  const { signOut } = React.useContext(AuthContext);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      handleChange("image", result.assets[0].uri);
    }
  };

  const removeImage = () => {
    handleChange("image", null);
  };

  React.useEffect(() => {
    const getUserProfile = async () => {
      let userData;
      try {
        userData = await retrieveData(AUTH_KEY);
        if (userData) {
          setForm(userData);
        }
      } catch (e) {
        console.error("Could not retrieve user data", e);
      }
    };

    getUserProfile();
  }, []);

  // useEffect(() => {
  //   // Populating preferences from storage using AsyncStorage.multiGet
  //   (async () => {
  //     try {
  //       const values = await AsyncStorage.multiGet(Object.keys(preferences));
  //       const initialState = values.reduce((acc, curr) => {
  //         // Every item in the values array is itself an array with a string key and a stringified value, i.e ['pushNotifications', 'false']
  //         acc[curr[0]] = JSON.parse(curr[1]);
  //         return acc;
  //       }, {});
  //       setPreferences(initialState);
  //     } catch (e) {
  //       Alert.alert(`An error occurred: ${e.message}`);
  //     }
  //   })();
  // }, []);

  // This effect only runs when the preferences state updates, excluding initial mount
  // useUpdate(() => {
  //   (async () => {
  //     // Every time there is an update on the preference state, we persist it on storage
  //     // The exercise requierement is to use multiSet API
  //     const keyValues = Object.entries(preferences).map((entry) => {
  //       return [entry[0], String(entry[1])];
  //     });
  //     try {
  //       await AsyncStorage.multiSet(keyValues);
  //     } catch (e) {
  //       Alert.alert(`An error occurred: ${e.message}`);
  //     }
  //   })();
  // }, [preferences]);

  const handleLogout = () => {
    signOut();
  };

  const handleChange = (fieldName, value) => {
    setForm((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSaveChanges = async () => {
    if (form.phoneNumber && !validateUSPhoneNumber(form.phoneNumber)) {
      Alert.alert("Please input a valid US number.");
      return;
    }
    const data = await retrieveData(AUTH_KEY);
    if (data) {
      await storeData(AUTH_KEY, { ...data, ...form });
    }
    Alert.alert("Profile successfully updated!");
  };

  const initials = `${form.firstName?.[0] || ""}${
    form.lastName?.[0] || ""
  }`.toUpperCase();
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>Personal Information</Text>
        <View style={styles.row}>
          <View style={[]}>
            {form.image ? (
              <Image
                source={{ uri: form.image }}
                style={[
                  {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "grey",
                    width: 150,
                    height: 150,
                    borderRadius: 75,
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
                    width: 150,
                    height: 150,
                    borderRadius: 75,
                  },
                ]}
              >
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
            )}
          </View>
          <View style={[styles.row, { gap: 10, alignItems: "center" }]}>
            {form.image ? (
              <>
                <Pressable
                  onPress={pickImage}
                  style={[styles.button, { backgroundColor: "#3E524B" }]}
                >
                  <Text style={styles.buttonText}>Change</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, { backgroundColor: "#ffffff" }]}
                >
                  <Text
                    onPress={removeImage}
                    style={[styles.buttonText, { color: "#000000" }]}
                  >
                    Remove
                  </Text>
                </Pressable>
              </>
            ) : (
              <Pressable
                onPress={pickImage}
                style={[styles.button, { backgroundColor: "#3E524B" }]}
              >
                <Text style={styles.buttonText}>Upload image</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <View style={[]}>
          <TextInput
            style={styles.input}
            value={form.firstName}
            onChangeText={(value) => handleChange("firstName", value)}
            placeholder="First name"
            label
          />
          <TextInput
            style={styles.input}
            value={form.lastName}
            onChangeText={(value) => handleChange("lastName", value)}
            placeholder="Last name"
          />
          <TextInput
            style={styles.input}
            value={form.email}
            onChangeText={(value) => handleChange("email", value)}
            placeholder="Email"
          />
          <TextInput
            style={styles.input}
            value={form.phoneNumber}
            onChangeText={(value) => handleChange("phoneNumber", value)}
            placeholder="Phone number"
          />
        </View>
      </View>
      <View style={styles.container}>
        <Text style={styles.header}>Email notifications</Text>
        <View style={styles.row}>
          <Text style={styles.text}>Order Statuses</Text>
          <Checkbox
            color="#4b3e52"
            status={form.orderStatuses ? "checked" : "unchecked"}
            onPress={() => handleChange("orderStatuses", !form.orderStatuses)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.text}>Password changes</Text>
          <Checkbox
            color="#4b3e52"
            status={form.passwordChanges ? "checked" : "unchecked"}
            onPress={() =>
              handleChange("passwordChanges", !form.passwordChanges)
            }
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.text}>Special offers</Text>
          <Checkbox
            color="#4b3e52"
            status={form.specialOffers ? "checked" : "unchecked"}
            onPress={() => handleChange("specialOffers", !form.specialOffers)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.text}>Newsletter</Text>
          <Checkbox
            color="#4b3e52"
            status={form.newsletter ? "checked" : "unchecked"}
            onPress={() => handleChange("newsletter", !form.newsletter)}
          />
        </View>
        <Pressable
          onPress={handleLogout}
          style={[styles.button, { backgroundColor: "grey" }]}
        >
          <Text style={styles.buttonText}>Sign out</Text>
        </Pressable>
        <Pressable
          onPress={handleSaveChanges}
          style={[styles.button, { backgroundColor: "#3E524B", marginTop: 10 }]}
        >
          <Text style={styles.buttonText}>Save Changes</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1",
    padding: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  text: {
    fontSize: 18,
  },
  header: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    fontSize: 22,
    padding: 10,
    borderColor: "#3E524B",
    borderWidth: 2,
    borderRadius: 12,
  },
  buttonText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 20,
  },
  avatarText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 60,
    fontWeight: "600",
  },
  input: {
    marginTop: 10,
    marginBottom: 10,
    borderColor: "#3E524B",
    borderWidth: 2,
    padding: 10,
    borderRadius: 12,
  },
});
