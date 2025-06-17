'use client';

import { useState } from 'react';
import { Box } from '@mui/material';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import Loading from '@/components/common/Dialogs/Loading';
import NoticeDialog from '@/components/common/Dialogs/NoticeDialog';
import ProyectosHeader from '@/components/app/proyectos/ProyectosHeader';
import ProyectosEmptyState from '@/components/app/proyectos/ProyectosEmptyState';
import ProyectosGrid from '@/components/app/proyectos/ProyectosGrid';
import ProyectoForm from '@/components/app/proyectos/ProyectoForm';
import { useProyectoLista } from '@/hooks/proyectos/useProyectoAll';

export default function ProyectosPage() {
  const {
    proyectos,
    loading,
    error,
    refetch,
  } = useProyectoLista();

  const [crearOpen, setCrearOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');
  const [noticeType, setNoticeType] = useState<'success' | 'error'>('info');

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

  const handleCreateProject = () => {
    setCrearOpen(true);
  };

  const handleSuccess = () => {
    setCrearOpen(false);
    showNotice('success', 'Proyecto creado', 'El proyecto se ha creado correctamente.');
    refetch();
  };

  if (loading) return <Loading />;

  return (
    <DashboardLayout>
      <Box sx={{ mt: 4, mb: 4 }}>
        <ProyectosHeader onCreate={handleCreateProject} />

        {error ? (
          <NoticeDialog
            open={true}
            onClose={() => setNoticeOpen(false)}
            title="Error al cargar proyectos"
            message={error}
            type="error"
          />
        ) : proyectos.length === 0 ? (
          <ProyectosEmptyState onCreate={handleCreateProject} />
        ) : (
          <ProyectosGrid proyectos={proyectos} />
        )}
      </Box>

      {/* Modal para crear proyecto */}
      <ProyectoForm
        modo="crear"
        open={crearOpen}
        onClose={() => setCrearOpen(false)}
        onSuccess={handleSuccess}
      />

      {/* Diálogo de notificación general */}
      <NoticeDialog
        open={noticeOpen}
        onClose={() => setNoticeOpen(false)}
        title={noticeTitle}
        message={noticeMessage}
        type={noticeType}
        buttonText="Entendido"
      />
    </DashboardLayout>
  );
}
