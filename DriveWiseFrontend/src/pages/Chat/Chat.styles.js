import styled from "styled-components/native";
import { RFPercentage } from "react-native-responsive-fontsize";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { View, TouchableOpacity, Text, TextInput } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { InputToolbar } from "react-native-gifted-chat";

export const ChatPageContainer = styled(View)`
  flex: 1;
  background-color: white;
`;

export const SubTitleTouchable = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;
export const CallIcon = styled(Ionicons).attrs({
  name: "call",
  size: RFPercentage(2.5),
  color: "#5d8cf9",
})`
  margin-right: ${wp("2%")}px;
`;

export const SubTitle = styled(Text)`
  color: #5d8cf9;
  font-size: ${RFPercentage(2.5)}px;
  font-weight: 600;
`;

export const ChatInput = styled(TextInput).attrs({
  placeholder: "Type a message...",
  placeholderTextColor: "black",
})`
  flex: 1;
  color: black;
  font-size: ${RFPercentage(2)}px;
  padding: ${hp("2%")}px 0;
  height: ${hp("7%")}px;
`;

export const MessageButtton = styled(TouchableOpacity)`
  background-color: #4caf50;
  border-radius: 500px;
  justify-content: center;
  align-items: center;
  height: ${wp("10%")}px;
  width: ${wp("10%")}px;
`;

export const MessageIcon = styled(Ionicons).attrs({
  name: "send",
  size: RFPercentage(2.5),
  color: "white",
})``;

export const ChatInputContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${wp("2%")}px;
  background-color: white;
`;

export const Toolbar = styled(InputToolbar)``;

export const LowerBar = styled(View)`
  align-items: center;
`;

export const UpperBar = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${hp(2)}px ${wp(4)}px;
`;

export const BackArrow = styled(AntDesign).attrs({
  name: "arrowleft",
  size: RFPercentage(3),
  color: "black",
})``;
