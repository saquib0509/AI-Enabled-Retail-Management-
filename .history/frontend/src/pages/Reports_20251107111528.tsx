import { Box, Typography, Paper, Stack, Button } from '@mui/material';

const Reports = () => {
  return (
    <Box>
      <Typography variant="h5" fontWeight={800} color="primary.main" sx={{mb:3}}>Reports & Analytics</Typography>
      <Stack spacing={3}>
        <Paper elevation={2} sx={{p:3}}>
          <Typography fontWeight={700} fontSize={17} mb={1}>Sales Analytics</Typography>
          <Typography color="text.secondary" mb={2}>No sales analytics loaded. (Future: chart/summary will show here.)</Typography>
          <Button variant="outlined" disabled>Load Data (coming soon)</Button>
        </Paper>
        <Paper elevation={2} sx={{p:3}}>
          <Typography fontWeight={700} fontSize={17} mb={1}>Inventory Analytics</Typography>
          <Typography color="text.secondary" mb={2}>No inventory analytics loaded. (Future: chart/summary will show here.)</Typography>
          <Button variant="outlined" disabled>Load Data (coming soon)</Button>
        </Paper>
      </Stack>
    </Box>
  );
};
export default Reports;
