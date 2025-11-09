import { useState, FC, useEffect } from 'react';
import {
  Box, Paper, Button, Card, CardContent,
  Grid, Typography, Alert, Stack, LinearProgress, Chip
} from '@mui/material';
import {
  ComposedChart, Line, Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart
} from 'recharts';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import api from '../../services/api';

interface RevenueVsExpenseReportType {
  totalRevenue: number;
  avgDailyRevenue: number;
  totalSalaryExpense: number;
  estimatedOtherExpenses: number;
  totalExpense: number;
  netProfit: number;
  profitMargin: number;
  expenseToRevenueRatio: number;
  expenseBreakdown: any[];
  dailyPerformance: any[];
  comparisonData: any[];
  profitPerEmployee: number;
  revenuePerEmployee: number;
  operationalEfficiency: number;
  workingDays: number;
  aiInsights: {
    healthStatus: string;
    healthEmoji: string;
    expenseControl: string;
    salaryBurdenStatus: string;
    salaryBurdenPercent: number;
    recommendations: string;
    growthPotential: string;
    summary: string;
  };
}

const COLORS = ['#4CAF50', '#FF6B6B'];

const RevenueVsExpenseReport: FC = () => {
  const [report, setReport] = useState<RevenueVsExpenseReportType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async (): Promise<void> => {
    setLoading(true);
    try {
      const today = new Date();
      const endDate = today.toISOString().slice(0, 10);
      const startDate = new Date(today.getTime() - 29 * 86400000).toISOString().slice(0, 10); // Last 30 days

      const res = await api.get<RevenueVsExpenseReportType>(
        `/reports/revenue-vs-expense?startDate=${startDate}&endDate=${endDate}`
      );
      setReport(res.data);
    } catch (error) {
      console.error('Error fetching financial report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Button variant="contained" onClick={fetchReport} disabled={loading} startIcon={<AccountBalanceIcon />}>
          {loading ? 'Loading...' : 'Generate Financial Report'}
        </Button>
      </Paper>

      {report && (
        <>
          {/* AI INSIGHTS - PROMINENTLY DISPLAYED */}
          <Paper
            sx={{
              p: 3,
              mb: 3,
              background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
              color: 'white'
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <AutoAwesomeIcon fontSize="large" />
              <Typography variant="h5" fontWeight="bold">
                AI Financial Intelligence
              </Typography>
            </Stack>

            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
              {report.aiInsights.summary}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption">Financial Health</Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ mt: 0.5 }}>
                    {report.aiInsights.healthEmoji}
                  </Typography>
                  <Typography variant="body2">
                    {report.aiInsights.healthStatus}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption">Expense Control</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {report.aiInsights.expenseControl.split(' - ')[0]}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem', mt: 0.5 }}>
                    {report.expenseToRevenueRatio?.toFixed(1)}% of revenue
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption">Salary Burden</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {report.aiInsights.salaryBurdenPercent?.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem', mt: 0.5 }}>
                    {report.aiInsights.salaryBurdenStatus}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption">Growth Potential</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {report.aiInsights.growthPotential.split(' - ')[0]}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Recommendations Alert */}
            <Alert severity="info" sx={{ mt: 2, bgcolor: 'rgba(255,255,255,0.95)' }}>
              <Typography variant="body2">
                <strong>💡 Action Items:</strong> {report.aiInsights.recommendations}
              </Typography>
            </Alert>
          </Paper>

          {/* Key Metrics Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <TrendingUpIcon color="success" />
                    <Typography color="textSecondary" variant="body2">Total Revenue</Typography>
                  </Stack>
                  <Typography variant="h6" sx={{ color: '#4CAF50' }}>
                    ₹{report.totalRevenue?.toLocaleString('en-IN')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <TrendingDownIcon color="error" />
                    <Typography color="textSecondary" variant="body2">Total Expense</Typography>
                  </Stack>
                  <Typography variant="h6" sx={{ color: '#FF6B6B' }}>
                    ₹{report.totalExpense?.toLocaleString('en-IN')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="body2">Net Profit</Typography>
                  <Typography variant="h6" sx={{ color: report.netProfit >= 0 ? '#4CAF50' : '#FF6B6B', fontWeight: 'bold' }}>
                    ₹{report.netProfit?.toLocaleString('en-IN')}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: report.profitMargin >= 0 ? '#4CAF50' : '#FF6B6B' }}>
                    Margin: {report.profitMargin?.toFixed(1)}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="body2">Operational Efficiency</Typography>
                  <Typography variant="h6">{report.operationalEfficiency?.toFixed(1)}%</Typography>
                  <Chip
                    label={
                      report.operationalEfficiency > 60
                        ? 'Excellent'
                        : report.operationalEfficiency > 40
                        ? 'Good'
                        : 'Fair'
                    }
                    size="small"
                    color={report.operationalEfficiency > 60 ? 'success' : report.operationalEfficiency > 40 ? 'warning' : 'error'}
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Profit Margin Progress */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>📊 Profitability Overview</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2">Profit Margin</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {report.profitMargin?.toFixed(1)}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(Math.max(report.profitMargin + 50, 0), 100)}
                    sx={{
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 6,
                        background:
                          report.profitMargin > 30
                            ? 'linear-gradient(to right, #4CAF50, #8BC34A)'
                            : report.profitMargin > 10
                            ? 'linear-gradient(to right, #FFC107, #FF9800)'
                            : 'linear-gradient(to right, #FF6B6B, #FF5252)'
                      }
                    }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2">Expense Ratio</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {report.expenseToRevenueRatio?.toFixed(1)}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(report.expenseToRevenueRatio, 100)}
                    sx={{
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 6,
                        background:
                          report.expenseToRevenueRatio < 40
                            ? 'linear-gradient(to right, #4CAF50, #8BC34A)'
                            : report.expenseToRevenueRatio < 60
                            ? 'linear-gradient(to right, #FFC107, #FF9800)'
                            : 'linear-gradient(to right, #FF6B6B, #FF5252)'
                      }
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Revenue vs Expense Comparison Chart */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>📈 Daily Revenue vs Expense Trend</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={report.dailyPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dateLabel" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value?.toFixed(0)}`} />
                <Legend />
                <Area type="monotone" dataKey="revenue" fill="#4CAF50" stroke="#2E7D32" name="Revenue" opacity={0.6} />
                <Line type="monotone" dataKey="expense" stroke="#FF6B6B" name="Expense" strokeWidth={2} />
                <Line type="monotone" dataKey="profit" stroke="#2196F3" name="Profit" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </Paper>

          {/* Expense Breakdown Pie Chart */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>🥧 Expense Breakdown</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={report.expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percentage }) => `${category}: ${percentage?.toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value?.toLocaleString('en-IN')}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>

          {/* Revenue vs Expense Comparison Bar Chart */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>📊 Revenue vs Expense Comparison</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  {
                    name: 'Financial Summary',
                    Revenue: report.totalRevenue,
                    Expense: report.totalExpense,
                    Profit: report.netProfit
                  }
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value?.toLocaleString('en-IN')}`} />
                <Legend />
                <Bar dataKey="Revenue" fill="#4CAF50" />
                <Bar dataKey="Expense" fill="#FF6B6B" />
                <Bar dataKey="Profit" fill="#2196F3" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>

          {/* Detailed Financial Summary */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>💼 Payroll Metrics</Typography>
                <Stack spacing={1.5}>
                  <Box>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2">Total Salary Expense</Typography>
                      <Typography variant="body2" fontWeight="bold">₹{report.totalSalaryExpense?.toLocaleString('en-IN')}</Typography>
                    </Stack>
                  </Box>
                  <Box>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2">Profit per Employee</Typography>
                      <Typography variant="body2" fontWeight="bold">₹{report.profitPerEmployee?.toLocaleString('en-IN')}</Typography>
                    </Stack>
                  </Box>
                  <Box>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2">Revenue per Employee</Typography>
                      <Typography variant="body2" fontWeight="bold">₹{report.revenuePerEmployee?.toLocaleString('en-IN')}</Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>📈 Performance Metrics</Typography>
                <Stack spacing={1.5}>
                  <Box>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2">Avg Daily Revenue</Typography>
                      <Typography variant="body2" fontWeight="bold">₹{report.avgDailyRevenue?.toLocaleString('en-IN')}</Typography>
                    </Stack>
                  </Box>
                  <Box>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2">Operating Days</Typography>
                      <Typography variant="body2" fontWeight="bold">{report.workingDays}</Typography>
                    </Stack>
                  </Box>
                  <Box>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2">Operational Costs</Typography>
                      <Typography variant="body2" fontWeight="bold">₹{report.estimatedOtherExpenses?.toLocaleString('en-IN')}</Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default RevenueVsExpenseReport;
