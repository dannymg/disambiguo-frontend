'use client';

import { CircularProgress, Box } from '@mui/material';

export default function Loading() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      width="100vw"
      bgcolor={'theme.palette.background.default'}
    >
      <CircularProgress size={60} color='primary' thickness={4.5} sx={{ color: 'primary.main' }}/>
    </Box>
  );
}
