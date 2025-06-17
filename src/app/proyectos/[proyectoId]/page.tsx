'use client';

import { Container, Box, Typography, Button, Stack, IconButton } from '@mui/material';
import { ArrowBack as ArrowBackIcon, UploadFile as UploadFileIcon } from '@mui/icons-material';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ProyectoCardExtendido from '@/components/app/proyectos/ProyectoCardExtendido';
import ProyectoEditarDialog from '@/components/app/proyectos/ProyectoEditarDialog';
import RequisitosTable from '@/components/app/requisitos/RequisitosTable';
import Loading from '@/components/common/Dialogs/Loading';
import useDetallesProyecto from '@/hooks/proyectos/useDetallesProyecto';
import { useRouter } from 'next/navigation';

export default function ProyectoPage() {
  const router = useRouter();
  const {
    proyecto,
    loading,
    error,
    isAnalista,
    editDialogOpen,
    editData,
    openEditDialog,
    closeEditDialog,
    updateProyecto,
    updateField,
    newKeyword,
    setNewKeyword,
    addKeyword,
    removeKeyword,
    requisitosFuncionales,
    requisitosNoFuncionales,
    handleCreateRequisito,
    handleEditRequisito,
    handleDeleteRequisito,
  } = useDetallesProyecto();

  const handleGoBack = () => router.back();

  if (loading) return <Loading />;
  if (!proyecto) return <Typography variant="h6">Proyecto no encontrado.</Typography>;

  return (
    <DashboardLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <IconButton onClick={handleGoBack} color="primary" sx={{ mb: 2 }}>
          <ArrowBackIcon />
        </IconButton>

        {/* Tarjeta del proyecto */}
        <ProyectoCardExtendido
          titulo={proyecto.titulo}
          descripcion={proyecto.descripcion}
          objetivo={proyecto.objetivo}
          contexto={proyecto.contexto}
          palabrasClave={proyecto.palabrasClave || []}
          onEdit={openEditDialog}
        />

        {/* Acciones sobre requisitos */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h5">Listado de requisitos</Typography>
          {isAnalista && (
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<UploadFileIcon />}
                onClick={() => router.push(`/proyectos/${proyecto.id}/requisitos/subir`)}
              >
                Subir CSV
              </Button>
              <Button variant="contained" onClick={handleCreateRequisito}>
                Crear requisito
              </Button>
            </Stack>
          )}
        </Box>

        {/* Tablas de requisitos */}
        <RequisitosTable
          title="Requisitos Funcionales (RF)"
          data={requisitosFuncionales}
          onEdit={handleEditRequisito}
          onDelete={handleDeleteRequisito}
          isAnalista={isAnalista}
        />
        <RequisitosTable
          title="Requisitos No Funcionales (RNF)"
          data={requisitosNoFuncionales}
          onEdit={handleEditRequisito}
          onDelete={handleDeleteRequisito}
          isAnalista={isAnalista}
        />

        {/* Modal de edición */}
        <ProyectoEditarDialog
          open={editDialogOpen}
          onClose={closeEditDialog}
          titulo={editData.titulo || ''}
          descripcion={editData.descripcion || ''}
          objetivo={editData.objetivo || ''}
          contexto={editData.contexto || ''}
          palabrasClave={editData.palabrasClave || []}
          newKeyword={newKeyword}
          error={error}
          loading={false}
          onChangeTitulo={(val) => updateField('titulo', val)}
          onChangeDescripcion={(val) => updateField('descripcion', val)}
          onChangeObjetivo={(val) => updateField('objetivo', val)}
          onChangeContexto={(val) => updateField('contexto', val)}
          onChangeNewKeyword={setNewKeyword}
          onAddKeyword={addKeyword}
          onRemoveKeyword={removeKeyword}
          onSubmit={(e) => {
            e.preventDefault();
            updateProyecto();
          }}
        />
      </Container>
    </DashboardLayout>
  );
}
