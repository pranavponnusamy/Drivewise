import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { UserContextProvider } from "./src/infra/user.context";
import { AuthenticationContextProvider } from "./src/infra/auth.context";
import { Navigator } from "./src/infra/nav/navigator";
import Toast from "react-native-toast-message";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "white" }}>
      <SafeAreaProvider>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: "white" }}
          edges={["left", "right"]}
        >
          <AuthenticationContextProvider>
            <UserContextProvider>
              <Navigator />
              <StatusBar backgroundColor="white" />
              <Toast />
            </UserContextProvider>
          </AuthenticationContextProvider>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
