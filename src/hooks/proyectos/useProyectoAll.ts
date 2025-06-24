import { useEffect, useState, useCallback } from "react";
import { proyectoService } from "@/api/proyectoService";
import { Proyecto } from "@/types/entities";

export function useProyectoLista() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProyectos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await proyectoService.getAllProyectos();
      setProyectos(data);
    } catch (err: any) {
      console.error("Error al cargar proyectos:", err);
      setError("No se pudo obtener la lista de proyectos. Intenta nuevamente más tarde.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProyectos();
  }, [fetchProyectos]);

  return {
    proyectos,
    loading,
    error,
    refetch: fetchProyectos,
  };
}
