import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(0);
  console.log(user);
  const login = (user) => {
    setUser(user);
  };
  const logOut = () => {
    setUser(0);
  };
  return (
    <AuthContext.Provider value={(user, login, logOut)}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
