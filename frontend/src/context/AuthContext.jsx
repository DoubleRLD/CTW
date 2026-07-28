import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { authApi } from "../api/auth";
import { api, setSessionExpiredHandler } from "../api/client";

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

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

  // Wired to client.js so any authenticated request that comes back
  // 401 (expired/invalidated token) clears the session and sends the
  // person back to login with an explanatory message, instead of every
  // subsequent request just failing silently in the background.
  useEffect(() => {
    setSessionExpiredHandler(() => {
      logout();
      if (!window.location.pathname.startsWith("/login")) {
        window.location.assign("/login?sessionExpired=1");
      }
    });
  }, [logout]);

  useEffect(() => {
    if (!token) {
      setCheckingAuth(false);
      return;
    }

    if (DEMO_MODE && token === "demo-token") {
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

// Local demo mode for frontend testing only. Turned on by VITE_DEMO_MODE=true in frontend/.env.local.
const startDemoSession = useCallback((payload = {}) => {
  const demoUser = {
    id: 1,
    name: payload.name || "Demo Student",
    email: payload.email || "demo@student.edu",
    role: "student",
  };

  localStorage.setItem("token", "demo-token");
  localStorage.setItem("user", JSON.stringify(demoUser));

  setToken("demo-token");
  setUser(demoUser);

  return {
    token: "demo-token",
    user: demoUser,
  };
}, []);

const login = useCallback(
  async (email, password) => {
    try {
      const data = await authApi.login(email, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);

      return data;
    } catch (error) {
      if (DEMO_MODE) {
        return startDemoSession({
          email,
          name: "Demo Student",
        });
      }

      throw error;
    }
  },
  [startDemoSession]
);

  // Deliberately does NOT establish a session — the backend doesn't
  // issue a token on register. The account exists but can't log in
  // until the email link is verified. Returns the raw response so
  // Register.jsx can show the "check your email" message (and, in dev
  // mode, the devVerificationLink for testing without real email).
  const register = useCallback(
    async (payload) => {
      if (DEMO_MODE) {
        return startDemoSession({
          email: payload.email,
          name: payload.name || "Demo Student",
        });
      }
  
      return authApi.register(payload);
    },
    [startDemoSession]
  );

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
