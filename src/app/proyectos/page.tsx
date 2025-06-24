"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Box } from "@mui/material";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Loading from "@/components/common/Dialogs/Loading";
import ProyectosHeader from "@/components/appComponents/proyectos/ProyectosHeader";
import ProyectosEmptyState from "@/components/appComponents/proyectos/ProyectosEmptyState";
import ProyectosGrid from "@/components/appComponents/proyectos/ProyectosGrid";
import { useProyectoLista } from "@/hooks/proyectos/useProyectoAll";

// Carga diferida (sin SSR) de los componentes pesados
const ProyectoForm = dynamic(() => import("@/components/appComponents/proyectos/ProyectoForm"), {
  ssr: false,
});
const NoticeDialog = dynamic(() => import("@/components/common/Dialogs/NoticeDialog"), {
  ssr: false,
});

export default function ProyectosPage() {
  const { proyectos, loading, error, refetch } = useProyectoLista();

  const [crearOpen, setCrearOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");
  const [noticeType, setNoticeType] = useState<"success" | "error">("info");

  //Efecto general para mostar notificaciones
  const showNotice = (type: "success" | "error", title: string, message: string) => {
    setNoticeType(type);
    setNoticeTitle(title);
    setNoticeMessage(message);
    setNoticeOpen(true);
  };

  //Acción: Abrir Modal de creación de Proyecto
  const handleCreateProject = () => {
    setCrearOpen(true);
  };

  //Mensaje de éxito al crear Proyecto
  const handleSuccess = () => {
    setCrearOpen(false);
    showNotice("success", "Proyecto creado", "El proyecto se ha creado correctamente.");
    refetch();
  };

  if (loading) return <Loading />;

  return (
    <DashboardLayout>
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header de la página, incluye botón de creación */}
        <ProyectosHeader onCreate={handleCreateProject} />

        {/* Sección para cargar el Grid de proyectos, si existen */}
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
      {crearOpen && (
        <ProyectoForm
          modo="crear"
          open={crearOpen}
          onClose={() => setCrearOpen(false)}
          onSuccess={handleSuccess}
        />
      )}

      {/* Diálogo de notificación general */}
      {noticeOpen && (
        <NoticeDialog
          open={noticeOpen}
          onClose={() => setNoticeOpen(false)}
          title={noticeTitle}
          message={noticeMessage}
          type={noticeType}
          buttonText="Entendido"
        />
      )}
    </DashboardLayout>
  );
}
