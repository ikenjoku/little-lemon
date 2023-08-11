import AsyncStorage from '@react-native-async-storage/async-storage';

export const DEFAULT_STATE = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    image: null,
    orderStatuses: false,
    passwordChanges: false,
    specialOffers: false,
    newsletter: false,
};

export const AUTH_KEY = "user";

export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(
      key,
      JSON.stringify(value)
    );
  } catch (error) {
    console.log(`Error saving ${key} data`);
  }
};

export const retrieveData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      const data = JSON.parse(value);
      return data;
    }
  } catch (error) {
    console.log(`Error fetching ${key} data`, error);
  }
};