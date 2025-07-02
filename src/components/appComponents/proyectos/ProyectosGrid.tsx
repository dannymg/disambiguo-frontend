import { Grid } from "@mui/material";
import { Proyecto } from "@/types";
import ProjectCard from "@/components/appComponents/proyectos/ProyectoCard";

interface Props {
  proyectos: Proyecto[];
}

export default function ProyectosGrid({ proyectos }: Props) {
  return (
    <Grid container spacing={3}>
      {proyectos.map((proyecto) => (
        <Grid item xs={12} sm={6} md={4} key={proyecto.id}>
          <ProjectCard proyecto={proyecto} />
        </Grid>
      ))}
    </Grid>
  );
}
