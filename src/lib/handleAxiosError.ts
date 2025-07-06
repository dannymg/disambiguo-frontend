import { isAxiosError } from "axios";

export function handleAxiosError(error: unknown): never {
  if (isAxiosError(error)) {
    console.error("❌ Axios error:", error.response?.data || error.message);
    throw error;
  }

  const mensaje = (error as Error)?.message || "Error desconocido";
  console.error("❌ Axios error:", mensaje);
  throw error as Error;
}
