import AsyncStorage from '@react-native-async-storage/async-storage';

export const AUTH_KEY = "user";

export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(
      key,
      JSON.stringify(value)
    );
  } catch (error) {
    console.error(`Error saving ${key} data`);
  }
};

export const retrieveData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      const data = JSON.parse(value);
      console.log('data', data);
      return data;
    }
  } catch (error) {
    console.error(`Error fetching ${key} data`, error);
  }
};