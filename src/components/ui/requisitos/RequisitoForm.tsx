'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import { createVersionRequisito, updateVersionRequisito, VersionRequisito } from '@/services/requisito-service'

interface RequisitoFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  proyectoId: string
  versionRequisito?: VersionRequisito
}

export default function RequisitoForm({ isOpen, onClose, onSubmit, proyectoId, versionRequisito }: RequisitoFormProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    prioridad: '',
    version: 1,
    esVersionActiva: true,
    estadoRevision: 'pendiente'
  })

  useEffect(() => {
    if (versionRequisito) {
      setFormData({
        nombre: versionRequisito.attributes.requisito.data.attributes.nombre,
        descripcion: versionRequisito.attributes.requisito.data.attributes.descripcion,
        prioridad: versionRequisito.attributes.requisito.data.attributes.prioridad,
        version: versionRequisito.attributes.version,
        esVersionActiva: versionRequisito.attributes.esVersionActiva,
        estadoRevision: versionRequisito.attributes.estadoRevision
      })
    }
  }, [versionRequisito])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let response
      if (versionRequisito) {
        response = await updateVersionRequisito(versionRequisito.id.toString(), {
          requisito: {
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            prioridad: formData.prioridad
          },
          version: formData.version,
          esVersionActiva: formData.esVersionActiva,
          estadoRevision: formData.estadoRevision
        })
      } else {
        response = await createVersionRequisito({
          requisito: {
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            prioridad: formData.prioridad
          },
          version: formData.version,
          esVersionActiva: formData.esVersionActiva,
          estadoRevision: formData.estadoRevision,
          proyecto: proyectoId
        })
      }
      onSubmit(response.data)
      onClose()
    } catch (error) {
      console.error('Error submitting requisito:', error)
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{versionRequisito ? 'Editar Requisito' : 'Crear Nuevo Requisito'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="nombre"
            label="Nombre"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            id="descripcion"
            label="Descripción"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            required
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="prioridad-label">Prioridad</InputLabel>
            <Select
              labelId="prioridad-label"
              id="prioridad"
              value={formData.prioridad}
              label="Prioridad"
              onChange={(e) => setFormData({ ...formData, prioridad: e.target.value })}
              required
            >
              <MenuItem value="alta">Alta</MenuItem>
              <MenuItem value="media">Media</MenuItem>
              <MenuItem value="baja">Baja</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

