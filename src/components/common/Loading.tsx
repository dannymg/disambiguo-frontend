import { CircularProgress, Box , Container} from '@mui/material';
import DashboardLayout from '@/components/ui/others/DashBoardLayout';

export default function Loading() {
  return (
    <DashboardLayout>
    <Container>
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    </Container>
  </DashboardLayout>
  );
}

