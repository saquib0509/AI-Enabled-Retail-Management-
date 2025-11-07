import { useState, FC } from 'react';
import {
  Box, Paper, TextField, Button, Card, CardContent,
  Grid, Typography, Alert, Stack
} from '@mui/material';
import {
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import api from '../../services/api';
import { RevenueExpenseReport as RevenueExpenseReportType } from './types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const RevenueVsExpenseReport: FC = () => {
  const [startDate, setStartDate] = useState<string>('2025-11-01');
  const [endDate, setEndDate] = useState<string>('2025-11-06');
  const [report, setReport] = useState<RevenueExpenseReportType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchReport = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await api.get<RevenueExpenseReportType>(
        `/reports/revenue-vs-expense?startDate=${startDate}&endDate=${endDate}`
      );
      setReport(res.data);
    } catch (error) {
      console.error('Error fetching revenue/expense report:', error);
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
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">Total Revenue</Typography>
                  <Typography variant="h6">₹{report.totalRevenue?.toLocaleString('en-IN')}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">Total Expense</Typography>
                  <Typography variant="h6">₹{report.totalExpense?.toLocaleString('en-IN')}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">Net Profit (Margin)</Typography>
                  <Typography variant="h6">
                    ₹{report.netProfit?.toLocaleString('en-IN')} ({report.profitMargin?.toFixed(2)}%)
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {report.aiInsight && (
            <Alert severity="info" sx={{ mb: 3 }}>
              🤖 <strong>AI Financial Insight:</strong> {report.aiInsight}
            </Alert>
          )}

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Revenue vs Expense Breakdown</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={report.comparisonData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, amount }) =>
                    `${category}: ₹${amount?.toLocaleString('en-IN')}`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `₹${value?.toLocaleString('en-IN')}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default RevenueVsExpenseReport;
