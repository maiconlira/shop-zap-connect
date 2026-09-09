import { useCallback, useEffect, useState } from "react";
import { apiLogin, getToken, setToken } from "@/lib/api";

// Credenciais de fallback quando a API não está disponível (modo local)
const ADMIN_USER = "smartcell";
const ADMIN_PASS = "smart123";
const LOCAL_TOKEN = "local-mode";

const isAuthed = () => !!getToken();

export const useAdminAuth = () => {
  const [authed, setAuthed] = useState<boolean>(() => isAuthed());

  useEffect(() => {
    const onStorage = () => setAuthed(isAuthed());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = useCallback(async (user: string, pass: string) => {
    // Tenta autenticar no servidor (banco de dados da hospedagem)
    try {
      const token = await apiLogin(user.trim(), pass);
      setToken(token);
      setAuthed(true);
      return true;
    } catch (err) {
      const status = (err as Error & { status?: number }).status;
      // 401 = credenciais erradas no servidor — não tenta fallback
      if (status === 401) return false;
      // API indisponível (preview/local): modo local
      if (user.trim() === ADMIN_USER && pass === ADMIN_PASS) {
        setToken(LOCAL_TOKEN);
        setAuthed(true);
        return true;
      }
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setAuthed(false);
  }, []);

  return { authed, login, logout };
};
