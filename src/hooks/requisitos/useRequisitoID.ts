import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { requisitoService } from "@/api/requisitoService";
import { VersionRequisito } from "@/types/entities";

export function useRequisitoID(proyectoId: string, identificador: string | null) {
  const router = useRouter();

  const [requisitoVersion, setRequisitoVersion] = useState<VersionRequisito | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [noticeOpen, setNoticeOpen] = useState(false);
  const [noticeType, setNoticeType] = useState<"success" | "error">("info");
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const fetchRequisito = async () => {
    if (!proyectoId || !identificador) return;

    try {
      setLoading(true);
      const data = await requisitoService.getRequisitoByIdentificador(proyectoId, identificador);
      setRequisitoVersion(data);
      setError(null);
    } catch (err) {
      console.error("Error al obtener el requisito:", err);
      setError("No se pudo cargar el requisito.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequisito();
  }, [proyectoId, identificador]);

  // const updateRequisito = async (datos: any) => {
  //   if (!requisitoVersion?.documentId) return;

  //   try {
  //     await requisitoService.updateRequisito(datos, requisitoVersion.documentId);
  //     await fetchRequisito();
  //     showNotice('success', 'Requisito actualizado', 'Los cambios fueron guardados.');
  //   } catch (err) {
  //     console.error(err);
  //     showNotice('error', 'Error al actualizar', 'No se pudieron guardar los cambios.');
  //   }
  // };

  // const deleteRequisito = async () => {
  //   if (!requisitoVersion?.documentId) return;

  //   try {
  //     setConfirmDeleteOpen(false);
  //     setLoadingDelete(true);

  //     await requisitoService.deleteRequisitoYVersiones(requisitoVersion.documentId);

  //     setLoadingDelete(false);
  //     showNotice('success', 'Requisito eliminado', 'El requisito fue eliminado correctamente.');
  //   } catch (err) {
  //     setLoadingDelete(false);
  //     console.error('Error al eliminar el requisito:', err);
  //     showNotice('error', 'Error al eliminar', 'No se pudo eliminar el requisito.');
  //   }
  // };

  const showNotice = (type: "success" | "error", title: string, message: string) => {
    setNoticeType(type);
    setNoticeTitle(title);
    setNoticeMessage(message);
    setNoticeOpen(true);
  };

  const closeNotice = () => {
    setNoticeOpen(false);
  };

  return {
    requisito: requisitoVersion,
    loading,
    error,
    refetch: fetchRequisito,

    //updateRequisito,
    deleteRequisito,
    confirmDeleteOpen,
    setConfirmDeleteOpen,
    loadingDelete,

    noticeOpen,
    noticeType,
    noticeTitle,
    noticeMessage,
    showNotice,
    closeNotice,
  };
}
