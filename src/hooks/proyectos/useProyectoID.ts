import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { proyectoService } from '@/api/proyectoService';
import { Proyecto } from '@/types/entities';

export function useProyectoID() {
  const { proyectoId } = useParams() as { proyectoId: string };
  const router = useRouter();

  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [noticeOpen, setNoticeOpen] = useState(false);
  const [noticeType, setNoticeType] = useState<'success' | 'error'>('info');
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [redirectAfterNotice, setRedirectAfterNotice] = useState(false);


  const fetchProyecto = async () => {
    try {
      setLoading(true);
      const data = await proyectoService.getProyectoById(proyectoId);
      setProyecto(data);
      setError(null);
    } catch (err: any) {
      console.error('Error al obtener el proyecto:', err);
      setError('No se pudo cargar el proyecto.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProyecto();
  }, [proyectoId]);

  const updateProyecto = async (datos: Partial<Proyecto>) => {
    if (!proyecto?.documentId) return;

    try {
      await proyectoService.updateProyecto(proyecto.documentId, datos);
      await fetchProyecto();
      showNotice('success', 'Proyecto actualizado', 'Los cambios fueron guardados.');
    } catch (err: any) {
      console.error(err);
      showNotice('error', 'Error al actualizar', 'No se pudieron guardar los cambios.');
    }
  };

  const deleteProyecto = async () => {
    if (!proyecto?.documentId) return;

    try {
      setConfirmDeleteOpen(false);
      setLoadingDelete(true);

      await proyectoService.deleteProyecto(proyecto.documentId);

      setLoadingDelete(false);
      setRedirectAfterNotice(true);
     showNotice('success', 'Proyecto eliminado', 'El proyecto fue eliminado correctamente.');
    } catch (err) {
      setLoadingDelete(false);
      console.log('Error al eliminar el proyecto:', err);
      showNotice('error', 'Error al eliminar', 'No se pudo eliminar el proyecto.');
    }
  };

  const showNotice = (
    type: 'success' | 'error',
    title: string,
    message: string
  ) => {
    setNoticeType(type);
    setNoticeTitle(title);
    setNoticeMessage(message);
    setNoticeOpen(true);
  };

const closeNotice = () => {
  setNoticeOpen(false);
  if (redirectAfterNotice) {
    setRedirectAfterNotice(false);
    router.push('/proyectos');
  }
};

  return {
    proyecto,
    loading,
    error,
    refetch: fetchProyecto,

    // Edición
    updateProyecto,

    // Eliminación
    confirmDeleteOpen,
    setConfirmDeleteOpen,
    deleteProyecto,
    loadingDelete,

    // Notificación
    noticeOpen,
    noticeType,
    noticeTitle,
    noticeMessage,
    showNotice,
    closeNotice,
  };
}
