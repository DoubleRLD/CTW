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
  const [checkingAuth, setCheckingAuth] = useState(!!token);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

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
        logout();
      })
      .finally(() => setCheckingAuth(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Shared by login and verifyEmail — both endpoints return
  // { token, user } and mean the same thing: "you're now signed in."
  function establishSession(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }

  const login = useCallback(async (email, password) => {
    const data = await authApi.login(email, password);
    establishSession(data);
  }, []);

  // Deliberately does NOT establish a session — the backend doesn't
  // issue a token on register. The account exists but can't log in
  // until the email link is verified. Returns the raw response so
  // Register.jsx can show the "check your email" message (and, in dev
  // mode, the devVerificationLink for testing without real email).
  const register = useCallback(async (payload) => {
    return authApi.register(payload);
  }, []);

  // Verifying an email logs the user in immediately — smoother than
  // sending them back to a manual login screen right after they just
  // proved ownership of the inbox.
  const verifyEmail = useCallback(async (token) => {
    const data = await authApi.verifyEmail(token);
    establishSession(data);
    return data;
  }, []);

  const resendVerification = useCallback(async (email) => {
    return authApi.resendVerification(email);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        register,
        verifyEmail,
        resendVerification,
        logout,
        isAuthenticated: !!token,
        checkingAuth,
      }}
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
