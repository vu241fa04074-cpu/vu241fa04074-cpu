import { createContext, useState, useEffect } from "react";
import { registerUser, loginUser, getMe } from "../api/authApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      getMe()
        .then((data) => setUser(data))
        .catch(() => {
          setToken(null);
          setUser(null);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    setToken(data.token);
    setUser(data.user || data);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user || data));
    return data;
  };

  const register = async (info) => {
    const data = await registerUser(info);
    setToken(data.token);
    setUser(data.user || data);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user || data));
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
