'use client';

import { Box } from '@mui/material';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import Loading from '@/components/common/Dialogs/Loading';
import ErrorDialog from '@/components/common/Dialogs/ErrorDialog';
import ProyectosHeader from '@/components/app/proyectos/ProyectosHeader';
import ProyectosEmptyState from '@/components/app/proyectos/ProyectosEmptyState';
import ProyectosGrid from '@/components/app/proyectos/ProyectosGrid';
import { useCargarProyectos } from '@/hooks/proyectos/useCargarProyectos';

export default function ProyectosPage() {
  const {
    proyectos,
    loading,
    errorDialogOpen,
    setErrorDialogOpen,
    errorTitle,
    errorMessage,
    handleCreateProject,
  } = useCargarProyectos();

  if (loading) return <Loading />;

  return (
    <DashboardLayout>
      <Box sx={{ mt: 4, mb: 4 }}>
        <ProyectosHeader onCreate={handleCreateProject} />

        {proyectos.length === 0 ? (
          <ProyectosEmptyState onCreate={handleCreateProject} />
        ) : (
          <ProyectosGrid proyectos={proyectos} />
        )}
      </Box>

      <ErrorDialog
        open={errorDialogOpen}
        onClose={() => setErrorDialogOpen(false)}
        title={errorTitle}
        message={errorMessage}
      />
    </DashboardLayout>
  );
}
