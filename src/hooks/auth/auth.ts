import axiosInstance from "@/lib/axios";
import { handleAxiosError } from "@/lib/handleAxiosError";
import { User, AuthResponse } from "@/types";

// El ID del rol "Analista" en la BD
const ANALISTA_ID = parseInt(process.env.ROL_ANALISTA_ID || "1");
if (process.env.NODE_ENV !== "production") {
  console.log("⭐ANALISTA_ID:", ANALISTA_ID);
}

// 🔐 Interceptor: Define el token de autenticación en el header de las peticiones
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      config.headers.Authorization = `Bearer ${jwt}`;
    }
  }
  return config;
}, Promise.reject);

// 🚨 Manejo de errores de autenticación
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

// 🔁 Reutilizar almacenamiento de sesión
const setStorage = (auth: AuthResponse) => {
  if (auth.user) {
    localStorage.setItem("jwt", auth.jwt);
    localStorage.setItem("user", JSON.stringify(auth.user));
  }
};

// 📌 Obtener el usuario actual
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await axiosInstance.get<User>("/users/me?populate=role");
    if (process.env.NODE_ENV !== "production") {
      console.log("📌 getCurrentUser:", response.data);
    }
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// 🧾 Verificar si el usuario es "Analista"
export const checkIsAnalista = (user: User): boolean => {
  return user.role?.id === ANALISTA_ID;
};

// 🔐 Login
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>("/auth/local", {
      identifier: email,
      password,
    });

    setStorage(response.data);
    if (process.env.NODE_ENV !== "production") {
      console.log("🔐 Login:", response.data);
    }
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// 🆕 Registro de nuevo Analista
export const register = async (
  username: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>("/auth/local/register", {
      username,
      email,
      password,
    });

    setStorage(response.data);

    if (process.env.NODE_ENV !== "production") {
      console.log("🔐 Register:", response.data);
    }

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// 🔓 Logout
export const logout = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    console.log("🔐 Logout");
  }
};
