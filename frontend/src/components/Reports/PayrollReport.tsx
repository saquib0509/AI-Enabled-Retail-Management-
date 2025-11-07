import { useState, FC } from 'react';
import {
  Box, Paper, Button, Card, CardContent,
  Grid, Typography, Alert
} from '@mui/material';
import api from '../../services/api';
import { PayrollReport as PayrollReportType } from './types';

const PayrollReport: FC = () => {
  const [report, setReport] = useState<PayrollReportType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchReport = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await api.get<PayrollReportType>(`/reports/payroll`);
      setReport(res.data);
    } catch (error) {
      console.error('Error fetching payroll report:', error);
    }
    setLoading(false);
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Button variant="contained" onClick={fetchReport} disabled={loading}>
          Generate Payroll Report
        </Button>
      </Paper>

      {report && (
        <>
          {report.aiAlert && (
            <Alert severity="error" sx={{ mb: 3 }}>
              ⚠️ {report.aiAlert}
            </Alert>
          )}

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">Total Payroll</Typography>
                  <Typography variant="h6">₹{report.totalSalary?.toLocaleString('en-IN')}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">Pending Payments</Typography>
                  <Typography variant="h6" color={report.pendingPayments > 0 ? 'error' : 'success'}>
                    {report.pendingPayments} employees
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default PayrollReport;
