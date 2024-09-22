import React, { useContext, useState } from "react";
import {
  AuthContainer,
  AuthInput,
  StateColor,
  SubmitButton,
  SubmitButtonText,
  SwitchStateTouchable,
  SwitchStateTouchableText,
  Title,
} from "./Auth.styles";
import { AuthenticationContext } from "../../infra/auth.context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image, StyleSheet, View } from "react-native";

export const Auth = ({ navigation }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const insets = useSafeAreaInsets();

  const { onEmailPasswordSignIn, onEmailPasswordRegister } = useContext(
    AuthenticationContext
  );

  return (
    <AuthContainer
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor: "#FFFFFF", // Set background color to white
      }}
    >
      <Image
        source={require("../../../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Title style={styles.title}>{isSignUp ? "Sign Up" : "Log In"}</Title>
      <AuthInput
        placeholder="Email"
        onChangeText={setEmail}
        style={styles.input}
      />
      <AuthInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        style={styles.input}
      />
      <SubmitButton
        style={styles.submitButton}
        onPress={() => {
          if (password && email) {
            isSignUp
              ? onEmailPasswordRegister(email, password)
              : onEmailPasswordSignIn(email, password);
          }
        }}
      >
        <SubmitButtonText style={styles.submitButtonText}>
          Submit
        </SubmitButtonText>
      </SubmitButton>
      <SwitchStateTouchable onPress={() => setIsSignUp(!isSignUp)}>
        <SwitchStateTouchableText>
          {isSignUp ? (
            <>
              <SwitchStateTouchableText>
                Already have an account?{" "}
              </SwitchStateTouchableText>
              <StateColor style={styles.switchStateText}>Log In</StateColor>
            </>
          ) : (
            <>
              <SwitchStateTouchableText>
                Don't have an account?{" "}
              </SwitchStateTouchableText>
              <StateColor style={styles.switchStateText}>Register</StateColor>
            </>
          )}
        </SwitchStateTouchableText>
      </SwitchStateTouchable>
    </AuthContainer>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 250, // Increased width
    height: 250, // Increased height
    alignSelf: "center",
    marginBottom: 30, // Space between logo and title
  },
  title: {
    fontSize: 28, // Larger and more readable
    color: "#002027", // Darker text for contrast against white background
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#F5F5F5", // Light gray background for input
    color: "#002027", // Dark text for readability
    borderRadius: 10, // Smooth rounded corners
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20, // More spacing between input fields
    borderWidth: 1,
    borderColor: "#047F8C", // Green border for the input fields
  },
  submitButton: {
    backgroundColor: "#047F8C", // Green to match the logo
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 30, // Add space after the submit button
    shadowColor: "#000", // Shadow for a lifted button look
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10, // Shadow on Android
  },
  submitButtonText: {
    fontSize: 18,
    color: "#FFFFFF", // White text on green button
    fontWeight: "600",
  },
  switchStateText: {
    fontSize: 16,
    color: "#047F8C", // Green for the switch state link text
    fontWeight: "600",
  },
});
