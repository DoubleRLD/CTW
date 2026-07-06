import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { authApi } from "../api/auth";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  // Starts true whenever a token exists, so protected UI can wait for
  // validation instead of briefly flashing a "logged out" state on
  // every page refresh.
  const [checkingAuth, setCheckingAuth] = useState(!!token);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  // On mount, if a token is saved, confirm it's still valid by hitting
  // /api/auth/me — a token can outlive its actual validity (expired,
  // or the user was deleted server-side) while still sitting in
  // localStorage looking legitimate.
  useEffect(() => {
    if (!token) {
      setCheckingAuth(false);
      return;
    }
    api
      .get("/auth/me", { auth: true })
      .then((data) => {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      })
      .catch(() => {
        // Token is invalid/expired — clear it rather than leaving the
        // app in a state where localStorage and reality disagree.
        logout();
      })
      .finally(() => setCheckingAuth(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authApi.login(email, password);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }, []);

  const register = useCallback(async (payload) => {
    const data = await authApi.register(payload);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, user, login, register, logout, isAuthenticated: !!token, checkingAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
