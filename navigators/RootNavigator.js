import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingScreen from "../screens/Onboarding";
import ProfileScreen from "../screens/Profile";
import SplashScreen from "../screens/Splash";
import HomeScreen from "../screens/Home";
import {
  retrieveData,
  AUTH_KEY,
  storeData,
  DEFAULT_STATE,
} from "../utils/asyncStore";
import { AuthContext } from "../context/AuthContext";

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "SIGN_IN":
          return {
            ...prevState,
            isLoading: false,
            isSignedIn: true,
            firstName: action.firstName,
            lastName: action.lastName,
            email: action.email,
            phoneNumber: action.phoneNumber,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            ...DEFAULT_STATE,
          };
        case "UPDATE_PROFILE":
          return {
            ...prevState,
            ...action.payload,
          };
      }
    },
    {
      isLoading: true,
      isSignedIn: false,
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
    }
  );

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let userData;

      try {
        userData = await retrieveData(AUTH_KEY);
        console.log("data in context🔥", userData);
        if (userData) {
          dispatch({
            ...userData,
            type: "SIGN_IN",
            firstName: userData.firstName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber,
            email: userData.email,
          });
        }
      } catch (e) {
        console.error("Could not retrieve user data", e);
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        dispatch({
          type: "SIGN_IN",
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          email: data.email,
        });
      },
      signOut: () => dispatch({ type: "SIGN_OUT" }),
      signUp: async (data) => {
        dispatch({
          type: "SIGN_IN",
          firstName: data.firstName,
          lastName: "",
          phoneNumber: "",
          email: data.email,
        });
      },
      userData: state,
      updateProfile: async (data, form) => {
        const updatedProfile = { ...data, ...form };
        await storeData(AUTH_KEY, updatedProfile);
        dispatch({
          type: "UPDATE_PROFILE",
          payload: updatedProfile,
        });
      },
    }),
    [state]
  );

  if (state.isLoading) {
    <SplashScreen />;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <Stack.Navigator>
        {state.isSignedIn ? (
          <>
            <Stack.Screen
              options={{ headerShown: false }}
              name="Home"
              component={HomeScreen}
            />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        ) : (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        )}
      </Stack.Navigator>
    </AuthContext.Provider>
  );
};

export default RootNavigator;
