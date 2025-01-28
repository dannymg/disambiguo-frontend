import { Typography, Box, Button } from "@mui/material"

interface PageHeaderProps {
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: "500" }}>
          {title}
        </Typography>
        {action && (
          <Button variant="contained" color="primary" onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </Box>
      {description && (
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      )}
    </Box>
  )
}
