import React, { useContext, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { UnAuthenticatedNavigator } from "./unauth.navigator";
import { AuthenticationContext } from "../auth.context";
import { AuthenticatedNavigator } from "./auth.navigator";

export const Navigator = () => {
  const { user } = useContext(AuthenticationContext);
  return (
    <NavigationContainer>
      {user ? <AuthenticatedNavigator /> : <UnAuthenticatedNavigator />}
    </NavigationContainer>
  );
};
