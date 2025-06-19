'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Container, Box, Typography, Button, Stack, IconButton
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  UploadFile as UploadFileIcon
} from '@mui/icons-material';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import ProyectoCardExtendido from '@/components/appComponents/proyectos/ProyectoCardExtendido';
import RequisitosTable from '@/components/appComponents/requisitos/RequisitosTable';
import Loading from '@/components/common/Dialogs/Loading';

import { useProyectoID } from '@/hooks/proyectos/useProyectoID';
import { requisitoService } from '@/api/requisitoService';
import { Requisito, VersionRequisito } from '@/types/entities';
import { useRouter } from 'next/navigation';

// 🔹 Carga diferida de componentes pesados
const ProyectoForm = dynamic(() => import('@/components/appComponents/proyectos/ProyectoForm'), { ssr: false });
const RequisitoForm = dynamic(() => import('@/components/appComponents/requisitos/RequisitoForm'), { ssr: false });
const RequisitoSubirDialog = dynamic(() => import('@/components/appComponents/requisitos/RequisitoSubirDialog'), { ssr: false });
const NoticeDialog = dynamic(() => import('@/components/common/Dialogs/NoticeDialog'), { ssr: false });
const ConfirmDialog = dynamic(() => import('@/components/common/Dialogs/ConfimDialog'), { ssr: false });
const RequisitoVersionDialog = dynamic(() => import('@/components/appComponents/requisitos/RequisitoVersionDialog'), { ssr: false });


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
  const [crearRequisitoOpen, setCrearRequisitoOpen] = useState(false);
  const [importarOpen, setImportarOpen] = useState(false);
  const [requisitoSeleccionado, setRequisitoSeleccionado] = useState<VersionRequisito | null>(null);
  const [requisitoAEliminar, setRequisitoAEliminar] = useState<VersionRequisito | null>(null);
  const [loadingDeleteReq, setLoadingDeleteReq] = useState(false);
  const [versionDialogOpen, setVersionDialogOpen] = useState(false);
  const [versionesDisponibles, setVersionesDisponibles] = useState<Requisito[]>([]);
  const [versionActivaId, setVersionActivaId] = useState<string>('');

  const requisitosActivos = (proyecto?.listaRequisitos || [])
    .map((vr): VersionRequisito | null => {
      const lista = vr.requisito;
      if (!lista || lista.length === 0) return null;

      const activo = lista.find((r) => r.esVersionActiva === true);
      if (!activo) return null;

      return {
        ...vr,
        requisito: [activo] // forzamos que solo haya uno
      };
    })
    .filter((r): r is VersionRequisito => r !== null);

  // 🔸 Separar por tipo RF y RNF
  const requisitosFuncionales = requisitosActivos.filter((r) =>
    r.identificador?.startsWith('RF')
  );

  const requisitosNoFuncionales = requisitosActivos.filter((r) =>
    r.identificador?.startsWith('RNF')
  );

  const handleEditSuccess = () => {
    setEditOpen(false);
    setRequisitoSeleccionado(null);
    showNotice('success', 'Requisito actualizado', 'Los cambios fueron guardados.');
    refetch();
  };

  const handleRequisitoCreado = () => {
    setCrearRequisitoOpen(false);
    showNotice('success', 'Requisito creado', 'El requisito fue creado correctamente.');
    refetch();
  };

  const handleRequisitosImportados = (cantidad: number) => {
    setImportarOpen(false);
    showNotice('success', 'Importación completa', `${cantidad} requisitos importados correctamente.`);
    refetch();
  };

  const handleEditarRequisito = (requisito: VersionRequisito) => {
    setRequisitoSeleccionado(requisito);
    setEditOpen(true);
  };

  const handleDeleteRequisito = async () => {
    if (!requisitoAEliminar || !proyecto?.documentId) return;

    try {
      await requisitoService.deleteRequisitoYVersiones(requisitoAEliminar.documentId);
      showNotice('success', 'Requisito eliminado', 'Se eliminó correctamente el requisito.');
      refetch();
    } catch (err) {
      console.error(err);
      showNotice('error', 'Error al eliminar', 'No se pudo eliminar el requisito.');
    } finally {
      setLoadingDeleteReq(false);
      setRequisitoAEliminar(null);
    }
  };

  const handleCambiarVersion = async (req: VersionRequisito) => {
    setRequisitoSeleccionado(req);
    const versiones = await requisitoService.getAllRequisitosByIdentificador(req.identificador!, proyecto.documentId);
    setVersionesDisponibles(versiones);
    const activa = versiones.find((r) => r.esVersionActiva);
    if (activa) setVersionActivaId(activa.documentId);
    setVersionDialogOpen(true);
  };

  const confirmarCambioVersion = async (nuevoActivoId: string) => {
    if (!requisitoSeleccionado?.identificador) return;

    try {
      await requisitoService.setVersionActiva(nuevoActivoId, requisitoSeleccionado.identificador);
      showNotice('success', 'Versión actualizada', 'La versión activa fue actualizada correctamente.');
      refetch();
    } catch (err) {
      console.error(err);
      showNotice('error', 'Error', 'No se pudo actualizar la versión activa.');
    } finally {
      setVersionDialogOpen(false);
      setRequisitoSeleccionado(null);
    }
  };


  if (loading || loadingDelete || loadingDeleteReq) return <Loading />;
  if (!proyecto) return <Typography variant="h6">Proyecto no encontrado.</Typography>;

  return (
    <DashboardLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <IconButton onClick={() => router.back()} color="primary" sx={{ mb: 2 }}>
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

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Listado de requisitos</Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<UploadFileIcon />}
              onClick={() => setImportarOpen(true)}
            >
              Subir CSV
            </Button>
            <Button variant="contained" onClick={() => setCrearRequisitoOpen(true)}>
              Crear requisito
            </Button>
          </Stack>
        </Box>


        <RequisitosTable
          title="Requisitos Funcionales (RF)"
          data={requisitosFuncionales}
          isAnalista={true}
          onEdit={handleEditarRequisito}
          onDelete={(req) => setRequisitoAEliminar(req)}
          onChangeVersion={handleCambiarVersion}
        />

        <RequisitosTable
          title="Requisitos No Funcionales (RNF)"
          data={requisitosNoFuncionales}
          isAnalista={true}
          onEdit={handleEditarRequisito}
          onDelete={(req) => setRequisitoAEliminar(req)}
          onChangeVersion={handleCambiarVersion}
        />

        {editOpen && !requisitoSeleccionado && (
          <ProyectoForm
            modo="editar"
            open={true}
            onClose={() => setEditOpen(false)}
            initialValues={proyecto}
            onSuccess={() => {
              setEditOpen(false);
              showNotice('success', 'Proyecto actualizado', 'Los cambios fueron guardados correctamente.');
              refetch();
            }}
          />
        )}

        {editOpen && requisitoSeleccionado && (
          <RequisitoForm
            open={true}
            onClose={() => {
              setEditOpen(false);
              setRequisitoSeleccionado(null);
            }}
            onSuccess={handleEditSuccess}
            modo="editar"
            proyectoId={proyecto.documentId}
            initialValues={requisitoSeleccionado}
          />
        )}

        {crearRequisitoOpen && (
          <RequisitoForm
            open={true}
            onClose={() => setCrearRequisitoOpen(false)}
            onSuccess={handleRequisitoCreado}
            modo="crear"
            proyectoId={proyecto.documentId}
          />
        )}

        {importarOpen && (
          <RequisitoSubirDialog
            open={true}
            onClose={() => setImportarOpen(false)}
            proyectoId={proyecto.documentId}
            onSuccess={handleRequisitosImportados}
          />
        )}

        <RequisitoVersionDialog
          open={versionDialogOpen}
          onClose={() => setVersionDialogOpen(false)}
          versiones={versionesDisponibles}
          activoId={versionActivaId}
          onSelect={confirmarCambioVersion}
        />

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

        <ConfirmDialog
          open={!!requisitoAEliminar}
          onClose={() => setRequisitoAEliminar(null)}
          onConfirm={handleDeleteRequisito}
          title="Eliminar Requisito"
          message={`¿Estás seguro de que deseas eliminar el requisito ${requisitoAEliminar?.identificador}? Esta acción no se puede deshacer.`}
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
