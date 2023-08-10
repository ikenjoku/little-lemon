import * as React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Alert,
  TextInput,
} from "react-native";

import { validateEmailRegex } from "../utils/validateEmailRegex";
import { AUTH_KEY, storeData, DEFAULT_STATE } from "../utils/asyncStore";
import { AuthContext } from "../context/AuthContext";

const validForm = ({ firstName, email }) => {
  return validateEmailRegex(email) && firstName.length > 0;
};

const OnboardingScreen = ({ navigation }) => {
  const [form, setForm] = React.useState(DEFAULT_STATE);
  const [isValidForm, setIsValidForm] = React.useState(false);
  const { signIn } = React.useContext(AuthContext);

  const handleChange = (fieldName, value) => {
    setForm((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };
  const handleSubscription = async () => {
    if (isValidForm) {
      // Alert.alert("Leggo!");
      await storeData(AUTH_KEY, { isSignedIn: true, ...form });
      // navigation.navigate("Profile");
      signIn(form);

    }
  };

  React.useEffect(() => {
    if (validForm(form)) {
      setIsValidForm(true);
    } else {
      setIsValidForm(false);
    }
  }, [form]);
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require("../assets/little-lemon-logo-grey.png")}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.subscribeText}>Let us get to know you</Text>
      </View>
      <View>
        <TextInput
          style={styles.input}
          value={form.firstName}
          onChangeText={(value) => handleChange("firstName", value)}
          placeholder="First name"
        />
        <TextInput
          style={styles.input}
          value={form.email}
          onChangeText={(value) => handleChange("email", value)}
          placeholder="Email"
        />
        <Pressable
          disabled={!isValidForm}
          onPress={handleSubscription}
          style={[
            styles.button,
            !isValidForm
              ? { backgroundColor: "grey" }
              : { backgroundColor: "#3E524B" },
          ]}
        >
          <Text style={styles.buttonText}>Next</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  image: {
    width: 100,
    height: 125,
    resizeMode: "contain",
  },
  container: {
    flex: 1,
    padding: 24,
  },
  textContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
  subscribeText: {
    textAlign: "center",
    fontSize: 20,
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

export default OnboardingScreen;
