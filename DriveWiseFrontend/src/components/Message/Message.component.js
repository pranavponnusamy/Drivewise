import React from "react";
import { MessageContainer, MessageText } from "./Message.styles";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

export const MessageComponent = ({ message, isAI }) => {
  return (
    <MessageContainer
      style={{
        backgroundColor: isAI ? "#DEDEDE" : "#4CAF50",
        alignSelf: isAI ? "flex-start" : "flex-end",
        borderBottomLeftRadius: isAI ? 0 : wp("2%"),
        borderBottomRightRadius: isAI ? wp("2%") : 0,
      }}
    >
      <MessageText
        style={{
          color: isAI ? "black" : "white",
        }}
      >
        {message}
      </MessageText>
    </MessageContainer>
  );
};
