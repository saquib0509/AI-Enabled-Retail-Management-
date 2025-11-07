import { useState, FC } from 'react';
import {
  Box, Paper, TextField, Button, Card, CardContent,
  Grid, Typography, Alert, Stack
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import api from '../../services/api';
import { StockReport as StockReportType } from './types';

const StockMovementReport: FC = () => {
  const [startDate, setStartDate] = useState<string>('2025-11-01');
  const [endDate, setEndDate] = useState<string>('2025-11-06');
  const [report, setReport] = useState<StockReportType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchReport = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await api.get<StockReportType>(
        `/reports/stock-movement?startDate=${startDate}&endDate=${endDate}`
      );
      setReport(res.data);
    } catch (error) {
      console.error('Error fetching stock report:', error);
    }
    setLoading(false);
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <TextField
            type="date"
            label="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            type="date"
            label="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <Button variant="contained" onClick={fetchReport} disabled={loading}>
            Generate Report
          </Button>
        </Stack>
      </Paper>

      {report && (
        <>
          {report.aiAlert && (
            <Alert
              severity={report.aiAlert.includes('REORDER') ? 'error' : 'success'}
              sx={{ mb: 3 }}
            >
              {report.aiAlert}
            </Alert>
          )}

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">Avg Daily Consumption</Typography>
                  <Typography variant="h6">{report.avgDailyConsumption?.toFixed(2)} L</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">Days Until Stock Empty</Typography>
                  <Typography variant="h6">{report.estimatedDaysUntilStockEmpty?.toFixed(1)} days</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Stock Levels</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={report.stockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="openingStock" fill="#8884d8" name="Opening Stock" />
                <Bar dataKey="closingStock" fill="#82ca9d" name="Closing Stock" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default StockMovementReport;
