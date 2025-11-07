import { useState, FC } from 'react';
import {
  Box, Paper, TextField, Button, Card, CardContent,
  Grid, Typography, Alert, Stack
} from '@mui/material';
import api from '../../services/api';
import { MonthlyReport as MonthlyReportType } from './types';

const MonthlyPerformanceReport: FC = () => {
  const [year, setYear] = useState<number>(2025);
  const [month, setMonth] = useState<number>(11);
  const [report, setReport] = useState<MonthlyReportType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchReport = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await api.get<MonthlyReportType>(
        `/reports/monthly-performance?year=${year}&month=${month}`
      );
      setReport(res.data);
    } catch (error) {
      console.error('Error fetching monthly report:', error);
    }
    setLoading(false);
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <TextField
            type="number"
            label="Year"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
          />
          <TextField
            type="number"
            label="Month"
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            inputProps={{ min: 1, max: 12 }}
          />
          <Button variant="contained" onClick={fetchReport} disabled={loading}>
            Generate Report
          </Button>
        </Stack>
      </Paper>

      {report && (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">Current Month Revenue</Typography>
                  <Typography variant="h6">₹{report.currentMonthRevenue?.toLocaleString('en-IN')}</Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      color: report.growthPercentage >= 0 ? 'green' : 'red'
                    }}
                  >
                    {report.growthPercentage >= 0 ? '📈' : '📉'} {report.growthPercentage?.toFixed(2)}% vs last month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">Previous Month</Typography>
                  <Typography variant="h6">₹{report.previousMonthRevenue?.toLocaleString('en-IN')}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {report.aiPrediction && (
            <Alert severity="success" sx={{ mb: 3 }}>
              🤖 <strong>AI Prediction:</strong> {report.aiPrediction}
            </Alert>
          )}
        </>
      )}
    </Box>
  );
};

export default MonthlyPerformanceReport;
