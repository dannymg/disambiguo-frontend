import axiosInstance from "@/lib/axios";
import { getCurrentUser } from "@/hooks/auth/auth";
import { AxiosError } from "axios";

export const correccionService = {
  //Actualizar corrección
  async actualizarCorreccion(documentId: string, nuevaDescripcion: string, comentario: string) {
    const user = await getCurrentUser();

    const payload = {
      data: {
        textoGenerado: nuevaDescripcion,
        esModificada: true,
        comentarioModif: comentario,
        modificadoPor: user.email,
      },
    };

    console.log("📦 Payload de actualización de corrección:", payload);

    try {
      const response = await axiosInstance.put(`/correcciones/${documentId}`, payload);
      console.log("✔️ Correccion acutalizada", response.data.data);
      return response.data.data;
    } catch (err: unknown) {
      if ((err as AxiosError).isAxiosError) {
        const axiosErr = err as AxiosError;
        console.error(
          "❌ Error actualizando corrección:",
          axiosErr.response?.data || axiosErr.message
        );
      } else {
        console.error("❌ Error inesperado:", err);
      }
      throw err;
    }
  },

  async actualizarEsAceptada(documentId: string, estado: boolean) {
    console.log("Actualizando Corrección - Estado esAceptada: ", estado);

    const payload = {
      data: {
        esAceptada: estado,
      },
    };

    try {
      await axiosInstance.put(`/correcciones/${documentId}`, payload);
    } catch (err: unknown) {
      if ((err as AxiosError).isAxiosError) {
        const axiosErr = err as AxiosError;
        console.error(
          "❌ Error al actualizar estado de aceptación:",
          axiosErr.response?.data || axiosErr.message
        );
      } else {
        console.error("❌ Error inesperado:", err);
      }
      throw err;
    }
  },
};
