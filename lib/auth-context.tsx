"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  clearToken,
  getMe,
  getToken,
  setToken,
  UNAUTHORIZED_EVENT,
} from "./api";
import type { User } from "./types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login(token: string, user: { email: string; name: string }): void;
  logout(): void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Avoid double-redirecting on rapid 401s.
  const loggingOut = useRef(false);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    setTokenState(null);
    if (!loggingOut.current) {
      loggingOut.current = true;
      router.replace("/login");
      // Allow future logouts once navigation settles.
      setTimeout(() => {
        loggingOut.current = false;
      }, 500);
    }
  }, [router]);

  const login = useCallback(
    (newToken: string, info: { email: string; name: string }) => {
      setToken(newToken);
      setTokenState(newToken);
      // Optimistic user from the auth response; refined by getMe() below.
      setUser((prev) =>
        prev
          ? prev
          : { id: 0, name: info.name, email: info.email, role: "USER" },
      );
      // Pull the canonical profile in the background.
      getMe()
        .then(setUser)
        .catch(() => {
          /* getMe failure is non-fatal here; 401s are handled globally */
        });
    },
    [],
  );

  // On mount: validate any persisted token by loading the profile.
  useEffect(() => {
    const stored = getToken();
    if (!stored) {
      setIsLoading(false);
      return;
    }
    setTokenState(stored);
    getMe()
      .then((me) => setUser(me))
      .catch(() => {
        clearToken();
        setUser(null);
        setTokenState(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // React to global 401s emitted by the API client.
  useEffect(() => {
    const handler = () => {
      if (getToken()) logout();
    };
    window.addEventListener(UNAUTHORIZED_EVENT, handler);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handler);
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
