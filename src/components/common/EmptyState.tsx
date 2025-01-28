import { Box, Typography, Button } from "@mui/material"

interface EmptyStateProps {
  title: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ title, action }: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        textAlign: "center",
      }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        {title}
      </Typography>
      {action && (
        <Button variant="contained" color="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </Box>
  )
}

