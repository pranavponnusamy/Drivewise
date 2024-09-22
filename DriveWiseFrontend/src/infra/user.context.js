import React, { createContext, useState, useContext } from "react";
import { AuthenticationContext } from "./auth.context";
// import { getUserDataReq } from "../api/user.api";

export const UserContext = createContext(null);

export function UserContextProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const { user } = useContext(AuthenticationContext);

  // const getUserData = async () => {
  //   const data = await getUserDataReq(user?.uid || user);
  //   setUserData(data);
  // };

  return (
    <UserContext.Provider
      value={{
        // getUserData,
        userData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
