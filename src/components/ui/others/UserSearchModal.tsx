'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, TextField, List, ListItemText, ListItemButton } from '@mui/material'

interface User {
  id: string
  name: string
  email: string
}

interface UserSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectUser: (user: User) => void
}

export default function UserSearchModal({ isOpen, onClose, onSelectUser }: UserSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    if (isOpen) {
      // Aquí iría la lógica para obtener los usuarios de Strapi v5
      // Por ahora, usaremos datos de ejemplo
      setUsers([
        { id: '1', name: 'Usuario 1', email: 'usuario1@example.com' },
        { id: '2', name: 'Usuario 2', email: 'usuario2@example.com' },
        { id: '3', name: 'Usuario 3', email: 'usuario3@example.com' },
      ])
    }
  }, [isOpen])

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Buscar Usuarios</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="search"
          label="Buscar por nombre o email"
          type="text"
          fullWidth
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <List sx={{ pt: 0 }}>
          {filteredUsers.map((user) => (
            <ListItemButton onClick={() => onSelectUser(user)} key={user.id}>
              <ListItemText primary={user.name} secondary={user.email} />
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  )
}

