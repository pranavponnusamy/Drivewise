import { Text, View } from "react-native";
import styled from "styled-components/native";
import { RFPercentage } from "react-native-responsive-fontsize";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const MessageContainer = styled(View)`
  padding: ${hp("2%")}px ${wp("4%")}px;
  border-radius: ${wp("2%")}px;
  margin: ${hp("1%")}px;
`;

export const MessageText = styled(Text)`
  color: white;
  font-size: ${RFPercentage(2.25)}px;
`;
