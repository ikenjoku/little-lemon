import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingScreen from "../screens/Onboarding";
import ProfileScreen from "../screens/Profile";
import SplashScreen from "../screens/Splash";
import { retrieveData, AUTH_KEY } from "../utils/asyncStore";
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
            email: action.email,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isLoading: false,
            isSignedIn: false,
            firstName: "",
            email: "",
          };
      }
    },
    {
      isLoading: true,
      isSignedIn: false,
      firstName: "",
      email: "",
    }
  );

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let userData;

      try {
        userData = await retrieveData(AUTH_KEY);
        if (userData) {
          dispatch({
            type: "SIGN_IN",
            firstName: userData.firstName,
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
          email: data.email,
        });
      },
      signOut: () => dispatch({ type: "SIGN_OUT" }),
      signUp: async (data) => {
        dispatch({
          type: "SIGN_IN",
          firstName: data.firstName,
          email: data.email,
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
          <Stack.Screen name="Profile" component={ProfileScreen} />
          ) : (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        )}
      </Stack.Navigator>
    </AuthContext.Provider>
  );
};

export default RootNavigator;
