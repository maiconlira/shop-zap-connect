import { useCallback, useEffect, useState } from "react";

const SESSION_KEY = "smartcell:admin:session";
const ADMIN_USER = "smartcell";
const ADMIN_PASS = "smart123";

const isAuthed = () => {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(SESSION_KEY) === "1";
};

export const useAdminAuth = () => {
  const [authed, setAuthed] = useState<boolean>(() => isAuthed());

  useEffect(() => {
    const onStorage = () => setAuthed(isAuthed());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = useCallback((user: string, pass: string) => {
    if (user.trim() === ADMIN_USER && pass === ADMIN_PASS) {
      window.sessionStorage.setItem(SESSION_KEY, "1");
      setAuthed(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    window.sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  }, []);

  return { authed, login, logout };
};
