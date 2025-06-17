'use client';

import { useState } from 'react';
import { Container, Box, Typography, Button, Stack, IconButton } from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  UploadFile as UploadFileIcon,
} from '@mui/icons-material';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ProyectoCardExtendido from '@/components/app/proyectos/ProyectoCardExtendido';
import RequisitosTable from '@/components/app/requisitos/RequisitosTable';
import Loading from '@/components/common/Dialogs/Loading';
import ConfirmDialog from '@/components/common/Dialogs/ConfimDialog';
import NoticeDialog from '@/components/common/Dialogs/NoticeDialog';
import ProyectoForm from '@/components/app/proyectos/ProyectoForm';
import { useProyectoID } from '@/hooks/proyectos/useProyectoID';
import { useRouter } from 'next/navigation';

export default function ProyectoPage() {
  const router = useRouter();

  const {
    proyecto,
    loading,
    refetch,

    confirmDeleteOpen,
    setConfirmDeleteOpen,
    deleteProyecto,
    loadingDelete,

    noticeOpen,
    noticeType,
    noticeTitle,
    noticeMessage,
    showNotice,
    closeNotice,
  } = useProyectoID();

  const [editOpen, setEditOpen] = useState(false);

  const handleGoBack = () => router.back();

  const requisitosFuncionales = proyecto?.listaRequisitos?.filter(r =>
    r.identificador?.startsWith("RF")
  ) || [];

  const requisitosNoFuncionales = proyecto?.listaRequisitos?.filter(r =>
    r.identificador?.startsWith("RNF")
  ) || [];

  const handleEditSuccess = () => {
    setEditOpen(false);
    showNotice(
      'success',
      'Proyecto actualizado',
      'Los cambios fueron guardados correctamente.'
    );
    refetch();
  };

  if (loading || loadingDelete) return <Loading />;
  if (!proyecto) return <Typography variant="h6">Proyecto no encontrado.</Typography>;

  return (
    <DashboardLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <IconButton onClick={handleGoBack} color="primary" sx={{ mb: 2 }}>
          <ArrowBackIcon />
        </IconButton>

        <ProyectoCardExtendido
          titulo={proyecto.titulo}
          descripcion={proyecto.descripcion}
          objetivo={proyecto.objetivo}
          contexto={proyecto.contexto}
          palabrasClave={proyecto.palabrasClave || []}
          onEdit={() => setEditOpen(true)}
          onDelete={() => setConfirmDeleteOpen(true)}
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h5">Listado de requisitos</Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<UploadFileIcon />}
              onClick={() => router.push(`/proyectos/${proyecto.id}/requisitos/subir`)}
            >
              Subir CSV
            </Button>
            <Button
              variant="contained"
              onClick={() => router.push(`/proyectos/${proyecto.id}/requisitos/crear`)}
            >
              Crear requisito
            </Button>
          </Stack>
        </Box>

        <RequisitosTable
          title="Requisitos Funcionales (RF)"
          data={requisitosFuncionales}
          onEdit={(id) => router.push(`/proyectos/${proyecto.id}/requisitos/${id}/editar`)}
          onDelete={() => {}}
          isAnalista={true}
        />
        <RequisitosTable
          title="Requisitos No Funcionales (RNF)"
          data={requisitosNoFuncionales}
          onEdit={(id) => router.push(`/proyectos/${proyecto.id}/requisitos/${id}/editar`)}
          onDelete={() => {}}
          isAnalista={true}
        />

        {/* Modal de edición reutilizable */}
        <ProyectoForm
          modo="editar"
          open={editOpen}
          onClose={() => setEditOpen(false)}
          initialValues={proyecto}
          onSuccess={handleEditSuccess}
        />

        {/* Confirmación de eliminación */}
        <ConfirmDialog
          open={confirmDeleteOpen}
          onClose={() => setConfirmDeleteOpen(false)}
          onConfirm={deleteProyecto}
          title="Eliminar Proyecto"
          message="¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer."
          confirmText="Eliminar"
          cancelText="Cancelar"
          severity="warning"
        />

        <NoticeDialog
          open={noticeOpen}
          onClose={closeNotice}
          title={noticeTitle}
          message={noticeMessage}
          type={noticeType}
        />
      </Container>
    </DashboardLayout>
  );
}
