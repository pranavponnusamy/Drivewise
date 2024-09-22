import React, { createContext, useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import { createUser } from "../api/user.api";

export const AuthenticationContext = createContext(null);

export function AuthenticationContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const onEmailPasswordSignIn = async (email, password) => {
    try {
      const u = await auth().signInWithEmailAndPassword(email, password);
      setUser(u?.user?.uid);
      console.log(u);
    } catch (error) {
      console.log(error);
    }
  };

  const onEmailPasswordRegister = async (email, password) => {
    try {
      const u = await auth().createUserWithEmailAndPassword(email, password);
      await createUser(u?.user?.uid || u?.user || u);
      setUser(u?.user?.uid || u?.user);
      console.log(u);
    } catch (error) {
      console.log(error);
      createToast("error", "Email already registered", "Please sign in");
    }
  };

  const logOut = async () => {
    console.log("Run");
    setUser(null);
    auth().signOut();
  };

  const onAuthStateChanged = async (user) => {
    setUser(user?.uid || user);
    if (isLoading) setIsLoading(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (isLoading) return null;

  return (
    <AuthenticationContext.Provider
      value={{
        user,
        onEmailPasswordSignIn,
        onEmailPasswordRegister,
        logOut,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}
