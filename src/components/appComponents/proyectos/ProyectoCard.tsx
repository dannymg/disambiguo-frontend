import { Card, CardContent, CardActions, Typography, Button, Chip, Box } from "@mui/material";
import { Proyecto } from "@/types/entities";
import { useRouter } from "next/navigation";
import { Visibility } from "@mui/icons-material"; // Iconos adicionales

interface ProjectCardProps {
  proyecto: Proyecto;
}

export default function ProyectoCard({ proyecto }: ProjectCardProps) {
  const router = useRouter();

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.25s ease, box-shadow 0.25s ease", // Animación suave
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: (theme) => theme.shadows[3], // Sombra más pronunciada
        },
        borderRadius: 4, // Bordes redondeados
        overflow: "hidden", // Asegura que el contenido no se desborde
        backgroundColor: (theme) => theme.palette.background.paper,
      }}>
      <CardContent sx={{ flexGrow: 1, pt: 2 }}>
        {/* Título del proyecto */}
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: (theme) => theme.palette.primary.main,
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 1,
          }}>
          {proyecto.titulo}
        </Typography>

        {/* Descripción del proyecto */}
        <Typography
          variant="body2"
          color="text.secondary"
          paragraph
          sx={{
            maxHeight: 60,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            mb: 2,
          }}>
          {proyecto.descripcion}
        </Typography>

        {/* Chips de estado y versión */}
        <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
          <Chip
            label={`v${proyecto.version}.0`}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
          <Chip
            label={proyecto.esActivo ? "Activo" : "Inactivo"}
            size="small"
            color={proyecto.esActivo ? "success" : "default"}
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
        </Box>
      </CardContent>

      {/* Acciones */}
      <CardActions sx={{ display: "flex", justifyContent: "flex-end", mt: "auto", pb: 2, pr: 2 }}>
        <Button
          size="small"
          variant="contained"
          color="primary"
          startIcon={<Visibility />}
          onClick={() => router.push(`/proyectos/${proyecto.documentId}`)}
          sx={{
            textTransform: "none", // Texto sin mayúsculas
            transition: "transform 0.2s ease",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}>
          Ver detalles
        </Button>
      </CardActions>
    </Card>
  );
}
