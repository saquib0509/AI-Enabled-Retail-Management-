import { useState, FC } from 'react';
import {
  Box, Paper, TextField, Button, Card, CardContent,
  Grid, Typography, Alert, Stack
} from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import api from '../../services/api';
import { DailySalesReport as DailySalesReportType } from './types';

const DailySalesReport: FC = () => {
  const [startDate, setStartDate] = useState<string>('2025-11-01');
  const [endDate, setEndDate] = useState<string>('2025-11-06');
  const [report, setReport] = useState<DailySalesReportType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchReport = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await api.get<DailySalesReportType>(
        `/reports/daily-sales?startDate=${startDate}&endDate=${endDate}`
      );
      setReport(res.data);
    } catch (error) {
      console.error('Error fetching daily sales report:', error);
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
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">Total Revenue</Typography>
                  <Typography variant="h6">₹{report.totalRevenue?.toLocaleString('en-IN')}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">Total Sales</Typography>
                  <Typography variant="h6">{report.totalSales?.toFixed(2)} L</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">Avg Price/Liter</Typography>
                  <Typography variant="h6">₹{report.avgPricePerLiter?.toFixed(2)}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">Transactions</Typography>
                  <Typography variant="h6">{report.transactionCount}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {report.aiInsight && (
            <Alert severity="info" sx={{ mb: 3 }}>
              🤖 {report.aiInsight}
            </Alert>
          )}

          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Daily Sales Trend</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={report.dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue (₹)" />
                <Line type="monotone" dataKey="sales" stroke="#82ca9d" name="Sales (L)" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default DailySalesReport;
