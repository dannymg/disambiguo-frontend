import axiosInstance from "@/lib/axios";
import { handleAxiosError } from "@/lib/handleAxiosError";
import { User, AuthResponse } from "@/types";

const ANALISTA_ID = process.env.NEXT_PUBLIC_ROL_ANALISTA_ID
  ? parseInt(process.env.NEXT_PUBLIC_ROL_ANALISTA_ID, 10)
  : undefined;

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      config.headers.Authorization = `Bearer ${jwt}`;
    }
  }
  return config;
}, Promise.reject);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && [401, 403].includes(error.response?.status)) {
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      window.dispatchEvent(new CustomEvent("auth:session-expired"));
    }
    return Promise.reject(error);
  }
);

const setStorage = (auth: AuthResponse) => {
  if (typeof window !== "undefined" && auth.user) {
    localStorage.setItem("jwt", auth.jwt);
    localStorage.setItem("user", JSON.stringify(auth.user));
  }
};

export const persistUser = (user: User) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user));
  }
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await axiosInstance.get<User>("/users/me?populate=role");
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const checkIsAnalista = (user: User): boolean => {
  const roleName = user.role?.name?.toLowerCase();
  const roleType = user.role?.type?.toLowerCase();

  return Boolean(
    (ANALISTA_ID && user.role?.id === ANALISTA_ID) ||
      roleName === "analista" ||
      roleType === "analyst" ||
      roleType === "analista"
  );
};

export const ensureAnalista = async (): Promise<User> => {
  const currentUser = await getCurrentUser();

  if (!checkIsAnalista(currentUser)) {
    throw new Error("No tienes permisos para realizar esta operación.");
  }

  return currentUser;
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>("/auth/local", {
      identifier: email,
      password,
    });

    setStorage(response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

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
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const logout = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
  }
};
