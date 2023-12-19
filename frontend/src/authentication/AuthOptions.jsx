import React, { createContext, useState } from "react";

export const AuthOptions = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [username, setUsername] = useState("");
  const [customerID, setCustomerID] = useState(null);

  const loggedIn = (username,customerID) => {
    setAuth(true);
    setUsername(username);
    setCustomerID(customerID);
  };
  const loggedOut = () => {
    setAuth(false);
    setUsername("");
    setCustomerID(null);
  };

  return (
    <AuthOptions.Provider value={{ auth, username, customerID, loggedIn, loggedOut }}>
      {children}
    </AuthOptions.Provider>
  );
};