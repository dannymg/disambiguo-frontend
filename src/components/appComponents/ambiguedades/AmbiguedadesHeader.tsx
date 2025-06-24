import { Box, Typography } from "@mui/material";

interface HeaderProps {
  title: string;
  subtitle: string;
}

export default function AmbiguedadesHeader({ title, subtitle }: HeaderProps) {
  return (
    <Box mb={4}>
      <Typography variant="h4" component="h1" color="text.primary" fontWeight={700} gutterBottom>
        {title}
      </Typography>
      <Typography variant="h6" component="h2" color="text.secondary">
        {subtitle}
      </Typography>
    </Box>
  );
}
