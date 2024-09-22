import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MapScreen from "../../pages/Home/Home.page";
import ProfileScreen from "../../pages/Profile/ProfileScreen.page";
import { FontAwesome } from "@expo/vector-icons";
import { Summary } from "../../pages/Summary/Summary.page";
import { Chat } from "../../pages/Chat/Chat.page";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="Summary" component={Summary} />
    </Stack.Navigator>
  );
};

export const AuthenticatedNavigator = () => {
  const TAB_ICON = {
    Home: "home",
    Learn: "book",
    Profile: "user",
  };

  return (
    <Tab.Navigator
      tabBarHideOnKeyboard={true}
      screenOptions={({ route }) => {
        const iconName = TAB_ICON[route.name];
        return {
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name={iconName} color={color} size={size} />
          ),
          tabBarActiveTintColor: "#FFFFFF",
          tabBarInactiveTintColor: "#FFFFFF",
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#4CAF50",
            position: "absolute",
            borderTopWidth: 0,
            elevation: 0,
          },
        };
      }}
    >
      <Tab.Screen name="Home" component={HomeNavigator} />
      <Tab.Screen name="Learn" component={Chat} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
