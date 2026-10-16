import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TOKEN_KEY } from "../api/client";
import { loginApi, registerApi, meApi } from "../api/services";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY))); // validating stored token
  const [authMessage, setAuthMessage] = useState("");

  // Store / remove the token
  const saveSession = useCallback((data) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
    setAuthMessage("");
  }, []);

  const logout = useCallback((message = "") => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setAuthMessage(typeof message === "string" ? message : "");
  }, []);

  const login = useCallback(async (credentials) => saveSession(await loginApi(credentials)), [saveSession]);
  const register = useCallback(async (payload) => saveSession(await registerApi(payload)), [saveSession]);

  // On first load, check that a stored token is still valid
  useEffect(() => {
    if (!token) return;
    let active = true;
    meApi()
      .then((data) => active && setUser(data.user))
      .catch(() => active && logout("Please login again."))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Unauthorized / expired token reported by the axios interceptor
  useEffect(() => {
    const onUnauthorized = (e) => {
      logout(e.detail?.message || "Session expired. Please login again.");
      navigate("/login", { replace: true });
    };
    window.addEventListener("auth:unauthorized", onUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", onUnauthorized);
  }, [logout, navigate]);

  const value = useMemo(
    () => ({ user, token, loading, isAuthenticated: Boolean(user), authMessage, login, register, logout }),
    [user, token, loading, authMessage, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
