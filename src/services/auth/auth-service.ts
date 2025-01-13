import axiosInstance from "@/services/lib/axios";
import { AxiosError } from "axios";
import { User, AuthResponse } from "@/types/entities";

const ROL_ANALISTA_ID = parseInt(process.env.NEXT_PUBLIC_STRAPI_ID_ROL_ANALISTA || '0', 10);

// Agregar token al header de Authorization
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Manejar errores de autenticación
const handleAuthError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.error?.message || 'Error de autenticación';
    throw new Error(message);
  }
  throw error;
};

// Obtener la información del usuario actual
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await axiosInstance.get<User>('/users/me?populate=role');
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
    return currentUser.role?.id === ROL_ANALISTA_ID;
  } catch (error) {
    console.error('Error al verificar rol:', error);
    return false;
  }
};

// Iniciar sesión
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>('/auth/local', {
      identifier: email,
      password,
    });

    if (response.data.user) {
      localStorage.setItem('token', response.data.jwt);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
};

// Registrar nuevo usuario "Analista"
export const register = async (
  username: string, 
  email: string, 
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>('/auth/local/register', {
      username,
      email,
      password,
    });

    if (response.data.user) {
      // Asignar el rol "Analista"
      await axiosInstance.put(`/users/${response.data.user.id}`, {
        role: ROL_ANALISTA_ID,
      });

      localStorage.setItem('token', response.data.jwt);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
};

// Cerrar sesión
export const logout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};
