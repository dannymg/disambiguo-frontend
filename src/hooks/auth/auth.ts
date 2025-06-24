import axiosInstance from "@/lib/axios";
import axios from "axios";
import { User, AuthResponse } from "@/types/entities";

// El ID del rol "Analista" en la BD
const ANALISTA_ID = parseInt(process.env.ROL_ANALISTA_ID || "1");
// const ANALISTA_NAME = process.env.ROL_ANALISTA_NAME || '';
console.log("ANALISTA_ID:", ANALISTA_ID);

// Interceptor: Define el token de autenticación en el header de las peticiones
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const jwt = localStorage.getItem("jwt");
      if (jwt) {
        config.headers.Authorization = `Bearer ${jwt}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Manejar errores de autenticación
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Limpiar localStorage si el token es inválido
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

const handleAuthError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;

    // Verificar si hay un mensaje de error detallado
    const message =
      responseData?.error?.message ||
      responseData?.message ||
      `Error de autenticación (${error.response?.status || "Desconocido"})`;

    console.error("Error en la autenticación:", error.response?.status, message);
    throw new Error(message);
  }

  console.error("Error desconocido en la autenticación:", error);
  throw error;
};

// Obtener la información del usuario actual
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await axiosInstance.get<User>("/users/me?populate=role");
    console.log("getCurrentUser:", response.data);
    return response.data;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
};

// Verificar rol "Analista"
export const checkIsAnalista = async (): Promise<boolean> => {
  try {
    const currentUser = await getCurrentUser();
    console.log("Rol del usuario actual:", currentUser.role?.id);
    return currentUser.role?.id === ANALISTA_ID;
  } catch (error) {
    console.error("Error al verificar rol:", error);
    return false;
  }
};

// Iniciar sesión
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>("/auth/local", {
      identifier: email,
      password,
    });

    if (response.data.user) {
      localStorage.setItem("jwt", response.data.jwt);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    console.log("login:", response.data);
    return response.data;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
};

// Registrar nuevo "Analista"
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
    console.log("register:", response.data);

    if (response.data.user) {
      // Rolasignado por defecto: authenticated
      // Asignar el rol "Analista"
      // await axiosInstance.put(`/users/${response.data.user.id}`, {
      //   role: ANALISTA_ID,
      //   //Para estrctura completa de rol > name: ANALISTA_NAME,
      // });
      console.log("Rol asignado:", ANALISTA_ID);

      localStorage.setItem("jwt", response.data.jwt);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      console.log("Rol asignado:", response.data.user.role);
    }

    return response.data;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
};

// Cerrar sesión
export const logout = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    console.log("logout");
  }
};
