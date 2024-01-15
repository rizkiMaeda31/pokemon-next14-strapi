import { createContext, useContext, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
// import { useLocalStorage } from "../custom hooks/useLS";
const AuthContext = createContext(
  {user:window.localStorage.getItem('user')}
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();
  console.log('user - AuthProvider', user)
  // call this function when you want to authenticate the user
  const login = async (data) => {
    //insert axios in here to send login request to laravel
    setUser(data);
    setStoredUser(data)
    navigate("/dashboard");
  };

  // call this function to sign out logged in user
  const logout = () => {
    setUser(null);
    setStoredUser(null)
    navigate("/sign-in", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useLocalStorage = (keyName, defaultValue) => {
    const [storedValue, setStoredValue] = useState(() => {
      try {
        const value = window.localStorage.getItem(keyName);
        console.log('value', value)
        if (value) {
          return JSON.parse(value);
        } else {
            window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
          return defaultValue;
        }
      } catch (err) {
        return defaultValue;
      }
    });
    const setStoredUser  = (user) => {
      try {
        window.localStorage.setItem(keyName, JSON.stringify(user));
      } catch (err) {}
      setStoredValue(newValue);
    };
    return [storedValue, setStoredUser ];
};

export const useAuth = () => {
    console.log('useAuth', AuthContext)
    return useContext(AuthContext) || {}
};

export const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    console.log('user', user)
    if (!user) {
        // user is not authenticated
        return <Navigate to="/" />;
    }
    return children;
};
  