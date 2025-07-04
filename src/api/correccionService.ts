import axiosInstance from "@/lib/axios";
import { getCurrentUser } from "@/hooks/auth/auth";
import { handleAxiosError } from "@/lib/handleAxiosError";

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
    } catch (error) {
      handleAxiosError(error);
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
    } catch (error) {
      handleAxiosError(error);
    }
  },
};
