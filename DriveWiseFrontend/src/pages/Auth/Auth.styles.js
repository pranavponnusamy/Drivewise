import styled from "styled-components/native";
import { Text, TextInput, TouchableOpacity } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// Container for the authentication screen
export const AuthContainer = styled(KeyboardAwareScrollView)`
  flex: 1;
  padding: ${hp("2%")}px ${wp("4%")}px;
  background-color: #022a2b; /* Dark background */
`;

// Title styling for Sign Up / Log In header
export const Title = styled(Text)`
  font-size: ${RFPercentage(
    3.5
  )}px; /* Slightly increased for better readability */
  font-weight: 600;
  color: #ffffff; /* White text for contrast */
  text-align: center;
  margin-bottom: ${hp("2%")}px; /* Add spacing below the title */
`;

// Input fields for email and password
export const AuthInput = styled(TextInput).attrs({
  placeholderTextColor: "#A9A9A9" /* Light gray for placeholder */,
})`
  background-color: #033b3b; /* Slightly lighter than the container for distinction */
  color: white; /* White input text */
  width: ${wp("90%")}px;
  align-self: center;
  border-radius: 10px; /* Smooth rounded corners */
  height: ${hp("6.5%")}px; /* Slightly taller input */
  padding: ${hp("1.5%")}px ${wp("4%")}px; /* Adjusted padding */
  margin-top: ${hp("2%")}px;
  font-size: ${RFPercentage(2)}px;
  border-width: 1px;
  border-color: #4caf50; /* Green border matching the theme */
`;

// Button for submission (Sign Up / Log In)
export const SubmitButton = styled(TouchableOpacity)`
  background-color: #4caf50;
  width: 100%;
  border-radius: ${wp(4)}px;
  padding: ${hp("1.5%")}px 0;
  align-items: center;
  margin-top: ${hp("3%")}px;
  shadow-color: #000;
  shadow-opacity: 0.3;
  shadow-radius: 5px;
  elevation: 5;
`;

// Text inside the submit button
export const SubmitButtonText = styled(Text)`
  font-size: ${RFPercentage(
    2.2
  )}px; /* Slightly increased for better readability */
  color: white; /* White button text */
  font-weight: 600;
`;

// Touchable text to switch between Sign Up and Log In
export const SwitchStateTouchable = styled(TouchableOpacity)`
  margin-top: ${hp("2.5%")}px; /* Adjusted for better spacing */
`;

// Text for "Already have an account?" or "Don't have an account?"
export const SwitchStateTouchableText = styled(Text)`
  font-size: ${RFPercentage(2)}px;
  color: #a9a9a9; /* Light gray text */
  text-align: center;
`;

// Green text for "Log In" or "Register" within the switch state text
export const StateColor = styled(Text)`
  color: #4caf50; /* Green highlight for state */
  font-weight: 600; /* Bolder to make it stand out */
`;
