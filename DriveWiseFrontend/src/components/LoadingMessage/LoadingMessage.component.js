import React from "react";
import { Loading, MessageContainer } from "./LoadingMessage.styles";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const LoadingMessage = () => {
  return (
    <MessageContainer
      style={{
        backgroundColor: "#DEDEDE",
        alignSelf: "flex-start", // Align left for AI messages, right for other messages
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: wp("2%"),
        marginBottom: hp("10%"),
      }}
    >
      <Loading />
    </MessageContainer>
  );
};
