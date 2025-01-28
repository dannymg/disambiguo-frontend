"use client"

import { useRouter } from "next/navigation"
import { Container, Grid } from "@mui/material"
import { PageHeader } from "@/components/common/PageHeader"
import  ProjectCard from "@/components/ui/others/ProjectCard"
import DashboardLayout from "@/components/ui/others/DashBoardLayout"

const mockProjects = [
  {
    id: 1,
    title: "Desarrollo de aplicación web Tienda",
    description: "Sistema web para gestionar los productos de una tienda online de venta de ropa.",
  },
  {
    id: 2,
    title: "Aplicación móvil llamadas",
    description: "Aplicación móvil para gestionar llamadas y contactos.",
  },
  {
    id: 3,
    title: "Sistema de Registro",
    description: "Sistema de registro y autenticación de usuarios.",
  },
]

export default function ProjectsPage() {
  const router = useRouter()

  return (
    <DashboardLayout>
      <Container maxWidth="lg">
        <PageHeader
          title="Mis Proyectos"
          action={{
            label: "Crear Proyecto",
            onClick: () => router.push("/proyectos/crear"),
          }}
        />
        <Grid container spacing={3}>
          {mockProjects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <ProjectCard
                title={project.title}
                description={project.description}
                onView={() => router.push(`/proyectos/${project.id}`)}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </DashboardLayout>
  )
}
