import Link from 'next/link'
import { Card, CardContent, Typography, Button } from '@mui/material'

interface ProjectCardProps {
  id: string
  title: string
  description: string
}

export default function ProjectCard({ id, title, description }: ProjectCardProps) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <Button component={Link} href={`/project/${id}`} sx={{ m: 2 }}>
        Ver detalles
      </Button>
    </Card>
  )
}

