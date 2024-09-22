import { View } from "react-native";
import styled from "styled-components/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Lottie from "lottie-react-native";

export const MessageContainer = styled(View)`
  padding: ${hp("1%")}px ${wp("4%")}px;
  border-radius: ${wp("2%")}px;
  margin: ${hp("1%")}px;
  width: ${wp("20%")}px;
`;
export const Loading = styled(Lottie).attrs({
  source: require("../../../assets/lottie/messageLoading.json"),
  autoPlay: true,
  loop: true,
})`
  height: ${hp("4%")}px;
`;
