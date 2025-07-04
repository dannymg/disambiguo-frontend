import { AxiosError } from "axios";

export function handleAxiosError(error: unknown): never {
  const err = error as AxiosError<any>;
  console.error("❌ Axios error:", err.response?.data || err.message);
  throw err;
}
