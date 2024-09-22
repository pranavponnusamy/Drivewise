import React, { useState, useEffect } from "react";
import {
  ChatPageContainer,
  SubTitleTouchable,
  SubTitle,
  CallIcon,
  ChatInput,
  MessageButtton,
  MessageIcon,
  ChatInputContainer,
  Toolbar,
  LowerBar,
  BackArrow,
  UpperBar,
} from "./Chat.styles";
import { GiftedChat } from "react-native-gifted-chat";
import { MessageComponent } from "../../components/Message/Message.component";
import { Platform, Keyboard } from "react-native";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import uuid from "react-native-uuid";
import { LoadingMessage } from "../../components/LoadingMessage/LoadingMessage.component";
import { sendMessage, sendYashMessage } from "../../api/messages.api";

let counter = 0;
export const Chat = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [chatHistory, setChatHistory] = useState(() => {
    if (
      route?.params?.chatHistory?.length === 0 ||
      !route?.params?.chatHistory
    ) {
      return [
        {
          _id: 1,
          text: "Hey! Did you have a question about driving?",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "ai",
          },
        },
      ];
    } else {
      return [...route?.params?.chatHistory].reverse().map((message, index) => {
        return {
          _id: index,
          text: message?.text?.trim(),
          createdAt: new Date(message?.time),
          user: {
            _id: message?.user?.name === "ai" ? 2 : 1,
            name: message?.user?.name || "user",
          },
        };
      });
    }
  });

  const [chatId, setChatId] = useState(route?.params?.chatId || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [currentText, setCurrentText] = useState("");

  const onSend = async (message) => {
    try {
      setIsLoading(true);
      let msg = message[0].text.trim();
      setCurrentText("");
      Keyboard.dismiss();

      setChatHistory((previousMessages) =>
        GiftedChat.append(previousMessages, message)
      );

      let chat = chatId;
      if (!chat) {
        chat = uuid.v4();
        setChatId(chat);
      }
      let receivedMessage = 0;
      if (counter % 2 == 0) {
        receivedMessage = await sendYashMessage(msg);
        counter++;
      } else {
        receivedMessage = await sendMessage(msg, chatHistory);
        counter++;
      }

      const newMessageFromBot = {
        _id: message[0]._id + 1,
        text: receivedMessage,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "ai",
        },
      };
      setChatHistory((previousMessages) =>
        GiftedChat.append(previousMessages, [newMessageFromBot])
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <ChatPageContainer
      style={{
        paddingBottom: !isKeyboardVisible && insets.bottom,
        paddingTop: insets.top,
      }}
    >
      <GiftedChat
        messages={chatHistory}
        onSend={onSend}
        user={{ _id: 1 }}
        scrollToBottom={true}
        inverted={true}
        forceGetKeyboardHeight={false}
        bottomOffset={0}
        renderInputToolbar={() => {}}
        minInputToolbarHeight={0}
        renderChatFooter={(props) => {
          return (
            <Toolbar
              {...props}
              renderComposer={({ composerProps }) => (
                <ChatInputContainer style={{ margin: 0, marginBottom: 50 }}>
                  <ChatInput
                    {...composerProps}
                    onChangeText={(text) => setCurrentText(text)}
                    value={currentText}
                    returnKeyType="done"
                    onSubmitEditing={() => {
                      !isLoading &&
                        currentText.trim() !== "" &&
                        onSend([
                          {
                            text: currentText,
                            createdAt: new Date(),
                            user: { _id: 1, name: "user" },
                            _id: new Date().getTime(),
                          },
                        ]);
                    }}
                  />
                  <MessageButtton
                    onPress={() => {
                      !isLoading &&
                        currentText.trim() !== "" &&
                        onSend([
                          {
                            text: currentText,
                            createdAt: new Date(),
                            user: { _id: 1, name: "user" },
                            _id: new Date().getTime(),
                          },
                        ]);
                    }}
                  >
                    <MessageIcon />
                  </MessageButtton>
                </ChatInputContainer>
              )}
            />
          );
        }}
        renderMessage={(props) => {
          return (
            <MessageComponent
              message={props.currentMessage.text}
              isAI={props.currentMessage.user.name == "ai"}
            />
          );
        }}
        renderAvatar={null}
        renderFooter={() => {
          return (
            <>
              {isLoading ? (
                <LoadingMessage />
              ) : (
                <LowerBar
                  style={{
                    marginBottom:
                      !isKeyboardVisible || Platform.OS === "android"
                        ? heightPercentageToDP("10%")
                        : heightPercentageToDP("2%"),
                  }}
                ></LowerBar>
              )}
            </>
          );
        }}
      />
    </ChatPageContainer>
  );
};
