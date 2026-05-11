import { Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import PageHeader from "@/components/common/PageHeader";

interface Props {
  onCreate: () => void;
}

export default function ProyectosHeader({ onCreate }: Props) {
  return (
    <PageHeader
      title="Mis proyectos"
      subtitle="Administra tus proyectos y requisitos antes de ejecutar análisis de ambigüedad."
      actions={
        <Button
          variant="contained"
          color="primary"
          sx={{ fontWeight: 600 }}
          startIcon={<AddIcon />}
          onClick={onCreate}>
          Crear proyecto
        </Button>
      }
    />
  );
}
