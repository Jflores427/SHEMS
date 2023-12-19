import React, { createContext, useState } from "react";

export const AuthOptions = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [username, setUsername] = useState("");
  const [customerId, setCustomerId] = useState(null);

  const loggedIn = (username,customerId) => {
    setAuth(true);
    setUsername(username);
    setCustomerId(customerId);
  };
  const loggedOut = () => {
    setAuth(false);
    setUsername("");
    setCustomerId(null);
  };

  return (
    <AuthOptions.Provider value={{ auth, username, customerId, loggedIn, loggedOut }}>
      {children}
    </AuthOptions.Provider>
  );
};