'use client';

import { Container, Paper } from '@mui/material';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ProjectForm from '@/components/app/proyectos/ProyectoCrearForm';
import { useNewProjectForm } from '@/hooks/proyectos/useCrearProyectoForm';
import ErrorDialog from '@/components/common/Dialogs/ErrorDialog';
import NoticeDialog from '@/components/common/Dialogs/NoticeDialog';
import Loading from '@/components/common/Dialogs/Loading';
import { Box, Typography } from '@mui/material';

export default function NewProjectPage() {
  const form = useNewProjectForm();

  if (form.loading) return <Loading />;

  return (
    <DashboardLayout>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1" color="text.primary" fontWeight={700}>
            Crear Nuevo Proyecto
          </Typography>
        </Box>
        <Paper sx={{ p: 3, mb: 4, backgroundColor: 'background.paper' }}>
          <ProjectForm
            titulo={form.titulo}
            descripcion={form.descripcion}
            objetivo={form.objetivo}
            contexto={form.contexto}
            palabrasClave={form.palabrasClave}
            newKeyword={form.newKeyword}
            error={null}
            loading={form.loading}
            onChangeTitulo={form.setTitulo}
            onChangeDescripcion={form.setDescripcion}
            onChangeObjetivo={form.setObjetivo}
            onChangeContexto={form.setContexto}
            onChangeNewKeyword={form.setNewKeyword}
            onAddKeyword={form.handleAddKeyword}
            onRemoveKeyword={form.handleRemoveKeyword}
            onCancel={form.handleCancel}
            onSubmit={form.handleSave}
          />

          <NoticeDialog
            open={form.successDialogOpen}
            onClose={() => form.setSuccessDialogOpen(false)}
            title="Proyecto creado"
            message="El proyecto se ha creado correctamente."
            type="success"
            buttonText="Aceptar"
          />

          <ErrorDialog
            open={form.errorDialogOpen}
            onClose={() => form.setErrorDialogOpen(false)}
            title="Error al crear el proyecto"
            message={form.errorMessage}
          />
        </Paper>
      </Container>
    </DashboardLayout>
  );
}
