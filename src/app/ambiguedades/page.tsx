"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material"
import { proyectoService } from "@/api/proyectoService"
import type { Proyecto } from "@/types/entities"
import DashboardLayout from "@/components/layouts/DashboardLayout"
import Loading from "@/components/common/Dialogs/Loading"

export default function AmbiguedadPage() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const data = await proyectoService.getAllProyectos()
        setProyectos(data)
      } catch (error) {
        console.error("Error al cargar proyectos:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProyectos()
  }, [])

  if (loading) return <Loading />
  if (!proyectos || proyectos.length === 0)
    return (
      <DashboardLayout>
        <Typography variant="h5" color="error">
          No se encontraron proyectos disponibles.
        </Typography>
      </DashboardLayout>
    )

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Analizar ambigüedad
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Escoja un proyecto para analizar las ambigüedades
        </Typography>
        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell align="center">Total requisitos</TableCell>
                <TableCell align="center">R. no revisados</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {proyectos.map((proyecto, index) => {
                const totalRequisitos = proyecto.listaRequisitos?.length || 0
                const requisitosPendientes =
                  proyecto.listaRequisitos?.filter(
                    (req) => req.requisito?.[0]?.estadoRevision === "PENDIENTE"
                  ).length || 0

                return (
                  <TableRow key={proyecto.documentId}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{proyecto.titulo}</TableCell>
                    <TableCell align="center">{totalRequisitos}</TableCell>
                    <TableCell align="center">{requisitosPendientes}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => router.push(`/ambiguedades/${proyecto.documentId}/seleccionar`)}
                      >
                        Revisar
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </DashboardLayout>
  )
}