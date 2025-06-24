import { proyectoService } from "./proyectoService";

export const versionService = {
  // Verificar si un númeroID ya existe en la lista de requisitos de un proyecto
  async checkNumeroID(proyectoId: string, identificador: string): Promise<boolean> {
    console.log("Verificando identificador:", identificador);
    try {
      const proyecto = await proyectoService.getProyectoById(proyectoId);

      if (!proyecto || !proyecto.listaRequisitos) {
        console.warn("El proyecto no tiene requisitos registrados.");
        return false;
      }

      // Verifica si ya existe un númeroID en listaRequisitos
      const existe = proyecto.listaRequisitos.some(
        (versionRequisito) => versionRequisito.identificador === identificador
      );

      console.log("NumeroID existe:", existe);

      return existe;
    } catch (error) {
      console.error("Error al verificar numeroID:", error);
      return false; // En caso de error, asumimos que no existe
    }
  },
};
