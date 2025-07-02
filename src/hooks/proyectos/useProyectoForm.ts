import { useState, useEffect } from "react";
import { proyectoService } from "@/api/proyectoService";
import { getCurrentUser } from "@/hooks/auth/auth";
import { Proyecto } from "@/types";

interface UseProyectoFormProps {
  initialValues?: Proyecto;
  onSuccess: () => void;
}

export function useProyectoForm({ initialValues, onSuccess }: UseProyectoFormProps) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [contexto, setContexto] = useState("");
  const [palabrasClave, setPalabrasClave] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos si se trata de edición
  useEffect(() => {
    if (initialValues) {
      setTitulo(initialValues.titulo || "");
      setDescripcion(initialValues.descripcion || "");
      setObjetivo(initialValues.objetivo || "");
      setContexto(initialValues.contexto || "");
      setPalabrasClave(initialValues.palabrasClave || []);
    }
  }, [initialValues]);

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      setPalabrasClave([...palabrasClave, newKeyword.trim()]);
      setNewKeyword("");
    }
  };

  const handleRemoveKeyword = (index: number) => {
    setPalabrasClave(palabrasClave.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !titulo.trim() ||
      !descripcion.trim() ||
      !objetivo.trim() ||
      !contexto.trim() ||
      palabrasClave.length === 0
    ) {
      setError("Todos los campos son obligatorios, incluyendo al menos una palabra clave.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const currentUser = await getCurrentUser();

      if (initialValues) {
        // UPDATE
        const payload = {
          titulo: titulo.trim(),
          descripcion: descripcion.trim(),
          objetivo: objetivo.trim(),
          contexto: contexto.trim(),
          palabrasClave,
          version: (initialValues.version || 0) + 1,
        };
        await proyectoService.updateProyecto(initialValues.documentId, payload);
      } else {
        // CREATE
        await proyectoService.createProyecto({
          titulo: titulo.trim(),
          descripcion: descripcion.trim(),
          objetivo: objetivo.trim(),
          contexto: contexto.trim(),
          palabrasClave,
          version: 1,
          esActivo: true,
          listaRequisitos: [],
          creadoPor: currentUser.email,
        });
      }

      onSuccess();
    } catch (err: any) {
      const mensaje = err?.response?.data?.error?.message || "Error al guardar el proyecto.";
      setError(mensaje);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitulo("");
    setDescripcion("");
    setObjetivo("");
    setContexto("");
    setPalabrasClave([]);
    setNewKeyword("");
    setError(null);
  };

  return {
    // campos
    titulo,
    setTitulo,
    descripcion,
    setDescripcion,
    objetivo,
    setObjetivo,
    contexto,
    setContexto,
    palabrasClave,
    newKeyword,
    setNewKeyword,

    // control
    loading,
    error,
    resetForm,

    // acciones
    handleAddKeyword,
    handleRemoveKeyword,
    handleSubmit,
  };
}
