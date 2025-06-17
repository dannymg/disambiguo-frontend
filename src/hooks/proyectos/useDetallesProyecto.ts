import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { proyectoService } from "@/api/proyecto-service";
import { Proyecto, VersionRequisito } from "@/types/entities";
import { useAuth } from "@/hooks/auth/AuthProvider";

export default function useProyectoEditor() {
  const { proyectoId } = useParams() as { proyectoId: string };
  const router = useRouter();
  const { isAnalista } = useAuth();

  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [requisitos, setRequisitos] = useState<VersionRequisito[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<Proyecto>>({});
  const [newKeyword, setNewKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar proyecto
  useEffect(() => {
    const fetchProyecto = async () => {
      if (!proyectoId) return;
      try {
        setLoading(true);
        const data = await proyectoService.getProyectoById(proyectoId);
        setProyecto(data);
        setRequisitos(data.listaRequisitos || []);
      } catch (err) {
        setError("Error al cargar el proyecto.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProyecto();
  }, [proyectoId]);

  // CRUD Proyecto
  const openEditDialog = () => {
    if (proyecto) setEditData(proyecto);
    setEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setError(null);
  };

  const updateProyecto = async () => {
    if (!proyecto || !proyectoId) return;
    try {
      setLoading(true);
      editData.version = (proyecto.version || 0) + 1;
      console.log("Updating proyecto with data:", editData);
      await proyectoService.updateProyecto(proyectoId, editData);
      const updated = await proyectoService.getProyectoById(proyectoId);
      setProyecto(updated);
      setRequisitos(updated.listaRequisitos || []);
      setEditDialogOpen(false);
      setLoading(false);
    } catch (err) {
      setError("Error al guardar los cambios.");
      console.error(err);
    }
  };

  const updateField = (field: keyof Proyecto, value: string) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  // Palabras clave
  const addKeyword = () => {
    if (newKeyword.trim()) {
      const updated = [...(editData.palabrasClave || []), newKeyword.trim()];
      setEditData({ ...editData, palabrasClave: updated });
      setNewKeyword("");
    }
  };

  const removeKeyword = (index: number) => {
    const updated = editData.palabrasClave?.filter((_, i) => i !== index) || [];
    setEditData({ ...editData, palabrasClave: updated });
  };

  // Requisitos
  const handleEditRequisito = (id: number) => {
    router.push(`/proyectos/${proyectoId}/requisitos/${id}/editar`);
  };

  const handleDeleteRequisito = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este requisito?")) {
      // Aquí podrías hacer la petición DELETE real si la tienes
      setRequisitos((prev) => prev.filter((req) => req.id !== id));
    }
  };

  const requisitosFuncionales = requisitos.filter((r) =>
    r.identificador?.startsWith("RF")
  );
  const requisitosNoFuncionales = requisitos.filter((r) =>
    r.identificador?.startsWith("RNF")
  );

  return {
    // Estado general
    proyecto,
    requisitos,
    loading,
    error,
    isAnalista,

    // Edición del proyecto
    editData,
    editDialogOpen,
    openEditDialog,
    closeEditDialog,
    updateProyecto,
    updateField,

    // Palabras clave
    newKeyword,
    setNewKeyword,
    addKeyword,
    removeKeyword,

    // Requisitos
    handleEditRequisito,
    handleDeleteRequisito,
    requisitosFuncionales,
    requisitosNoFuncionales,
  };
}
