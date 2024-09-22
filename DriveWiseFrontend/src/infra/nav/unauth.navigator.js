import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Auth } from "../../pages/Auth/Auth.page";

const Stack = createNativeStackNavigator();

export const UnAuthenticatedNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth">{(props) => <Auth {...props} />}</Stack.Screen>
    </Stack.Navigator>
  );
};
