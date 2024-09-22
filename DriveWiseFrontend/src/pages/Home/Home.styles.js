import styled from "styled-components/native";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AntDesign from "@expo/vector-icons/AntDesign";

export const ReportContainer = styled(TouchableOpacity)`
  padding: ${hp("2%")}px ${wp("4")}px;
  background-color: #f76045;
  position: absolute;
  bottom: 100px;
  left: 10px;
  border-radius: ${wp(2)}px;
`;

export const ReportAccidentText = styled(Text)`
  color: white;
  font-size: ${RFPercentage(2)}px;
  font-weight: 600;
`;

export const SafetyModal = styled(Modal)``;

export const SafetyModalContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const SafetyModalContents = styled(View)`
  width: ${wp("90%")}px;
  background-color: white;
  padding: ${hp("2%")}px ${wp("4%")}px;
  border-radius: ${wp(2)}px;
`;

export const SafetyModalCloseIcon = styled(AntDesign).attrs({
  name: "close",
  size: RFPercentage(4),
  color: "black",
})`
  align-self: flex-end;
`;

export const SafetyModalTitle = styled(Text)`
  font-size: ${RFPercentage(3)}px;
  font-weight: 600;
`;

export const UpperRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const Row = styled(View)`
  background-color: #f9f9f9;
  padding: ${hp("2%")}px ${wp("4%")}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${hp("2%")}px;
  width: 100%;
`;

export const Label = styled(Text)`
  color: black;
  font-size: ${RFPercentage(2)}px;
  font-weight: 500;
`;
