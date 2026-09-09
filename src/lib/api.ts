// Cliente da API PHP (Hostinger). Quando a API não responde
// (ex.: preview local), o app usa o modo local com localStorage.

const TOKEN_KEY = "smartcell:admin:token";
const TIMEOUT_MS = 6000;

export const getToken = (): string | null =>
  typeof window === "undefined" ? null : window.sessionStorage.getItem(TOKEN_KEY);

export const setToken = (token: string | null) => {
  if (token) window.sessionStorage.setItem(TOKEN_KEY, token);
  else window.sessionStorage.removeItem(TOKEN_KEY);
};

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = false,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...(options.headers as Record<string, string>),
    };
    if (auth) {
      const token = getToken();
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch(`/api/${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      // SPA fallback devolveu HTML: API não existe neste ambiente
      throw new Error("API indisponível");
    }
    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data?.error || "Erro na API") as Error & { status?: number };
      err.status = res.status;
      throw err;
    }
    return data as T;
  } finally {
    clearTimeout(timer);
  }
}

export type ApiProduct = {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  compatibility?: string[];
  promo?: boolean;
  discount?: number;
  promoTag?: string;
};

/** null = API indisponível (modo local) */
export const fetchProducts = async (): Promise<ApiProduct[] | null> => {
  try {
    const data = await request<ApiProduct[]>("products.php");
    return Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
};

export const apiLogin = async (user: string, pass: string): Promise<string> => {
  const data = await request<{ token: string }>("login.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user, pass }),
  });
  return data.token;
};

export const apiSaveProduct = async (p: ApiProduct): Promise<void> => {
  await request("products.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(p),
  }, true);
};

export const apiSeedProducts = async (products: ApiProduct[]): Promise<void> => {
  await request("products.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ products }),
  }, true);
};

export const apiDeleteProduct = async (id: string): Promise<void> => {
  await request(`products.php?id=${encodeURIComponent(id)}`, { method: "DELETE" }, true);
};

export const apiClearProducts = async (): Promise<void> => {
  await request("products.php?all=1", { method: "DELETE" }, true);
};

export const apiUploadImage = async (file: File): Promise<string> => {
  const form = new FormData();
  form.append("file", file);
  const data = await request<{ url: string }>(
    "upload.php",
    { method: "POST", body: form },
    true,
  );
  return data.url;
};
