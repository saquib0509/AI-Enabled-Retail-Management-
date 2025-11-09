import { useState, FC, useEffect } from 'react';
import {
  Box, Paper, TextField, Button, Card, CardContent,
  Grid, Typography, Alert, Stack, LinearProgress, Chip
} from '@mui/material';
import {
  LineChart, Line, ComposedChart, Bar, BarChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import api from '../../services/api';

interface MonthlyReportType {
  currentMonthRevenue: number;
  previousMonthRevenue: number;
  yearAgoRevenue: number;
  monthOnMonthGrowth: number;
  yearOnYearGrowth: number;
  dailyPerformance: any[];
  monthlyComparison: any[];
  bestDay: any;
  worstDay: any;
  avgDailyRevenue: number;
  avgDailySales: number;
  aiInsights: {
    growthTrend: string;
    trendEmoji: string;
    yoyPerformance: string;
    healthScore: number;
    healthStatus: string;
    projectedMonthlyRevenue: number;
    summary: string;
  };
}

const MonthlyPerformanceReport: FC = () => {
  const today = new Date();
  const [year, setYear] = useState<number>(today.getFullYear());
  const [month, setMonth] = useState<number>(today.getMonth() + 1);
  const [report, setReport] = useState<MonthlyReportType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await api.get<MonthlyReportType>(
        `/reports/monthly-performance?year=${year}&month=${month}`
      );
      setReport(res.data);
    } catch (error) {
      console.error('Error fetching monthly report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            type="number"
            label="Year"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            inputProps={{ min: 2020, max: 2099 }}
          />
          <TextField
            type="number"
            label="Month"
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            inputProps={{ min: 1, max: 12 }}
          />
          <Button variant="contained" onClick={fetchReport} disabled={loading}>
            {loading ? 'Loading...' : 'Generate Monthly Report'}
          </Button>
        </Stack>
      </Paper>

      {report && (
        <>
          {/* AI INSIGHTS - PROMINENTLY DISPLAYED */}
          <Paper
            sx={{
              p: 3,
              mb: 3,
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white'
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <AutoAwesomeIcon fontSize="large" />
              <Typography variant="h5" fontWeight="bold">
                AI Monthly Performance Analysis
              </Typography>
            </Stack>

            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
              {report.aiInsights.summary}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption">Growth Trend</Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="h6" fontWeight="bold">
                      {report.aiInsights.trendEmoji}
                    </Typography>
                    <Typography variant="body2">{report.aiInsights.growthTrend}</Typography>
                  </Stack>
                  <Typography variant="body2">
                    {report.monthOnMonthGrowth >= 0 ? '+' : ''}{report.monthOnMonthGrowth?.toFixed(1)}% MoM
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption">YoY Performance</Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                    {report.yearOnYearGrowth >= 0 ? (
                      <TrendingUpIcon fontSize="small" />
                    ) : (
                      <TrendingDownIcon fontSize="small" />
                    )}
                    <Typography variant="body2">{report.aiInsights.yoyPerformance}</Typography>
                  </Stack>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption">Health Score</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {report.aiInsights.healthScore?.toFixed(0)}/100
                  </Typography>
                  <Chip
                    label={report.aiInsights.healthStatus}
                    size="small"
                    sx={{
                      mt: 1,
                      bgcolor:
                        report.aiInsights.healthStatus === 'Excellent'
                          ? '#4CAF50'
                          : report.aiInsights.healthStatus === 'Good'
                          ? '#FFC107'
                          : '#FF6B6B',
                      color: 'white'
                    }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption">Projected Revenue</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    ₹{report.aiInsights.projectedMonthlyRevenue?.toLocaleString('en-IN')}
                  </Typography>
                  <Typography variant="body2">(at current pace)</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Summary Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="body2">Current Month Revenue</Typography>
                  <Typography variant="h6">₹{report.currentMonthRevenue?.toLocaleString('en-IN')}</Typography>
                  <Typography variant="body2" sx={{ color: report.monthOnMonthGrowth >= 0 ? 'green' : 'red' }}>
                    {report.monthOnMonthGrowth >= 0 ? '+' : ''}{report.monthOnMonthGrowth?.toFixed(1)}% vs last month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="body2">Previous Month Revenue</Typography>
                  <Typography variant="h6">₹{report.previousMonthRevenue?.toLocaleString('en-IN')}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="body2">Year Ago Revenue</Typography>
                  <Typography variant="h6">₹{report.yearAgoRevenue?.toLocaleString('en-IN')}</Typography>
                  <Typography variant="body2" sx={{ color: report.yearOnYearGrowth >= 0 ? 'green' : 'red' }}>
                    {report.yearOnYearGrowth >= 0 ? '+' : ''}{report.yearOnYearGrowth?.toFixed(1)}% YoY
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="body2">Avg Daily Revenue</Typography>
                  <Typography variant="h6">₹{report.avgDailyRevenue?.toLocaleString('en-IN')}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Daily Performance Chart */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              📈 Daily Performance This Month
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={report.dailyPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" label={{ value: 'Day of Month', position: 'insideBottomRight', offset: -5 }} />
                <YAxis yAxisId="left" label={{ value: 'Revenue (₹)', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'Quantity (L)', angle: 90, position: 'insideRight' }} />
                <Tooltip />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="revenue" fill="#f5576c" stroke="#f5576c" name="Revenue" opacity={0.6} />
                <Line yAxisId="right" type="monotone" dataKey="quantity" stroke="#82ca9d" name="Quantity" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </Paper>

          {/* 6-Month Comparison */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              📊 6-Month Performance Comparison
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={report.monthlyComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" fill="#f093fb" name="Revenue (₹)" />
                <Line yAxisId="right" type="monotone" dataKey="sales" stroke="#4CAF50" name="Sales (L)" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>

          {/* Best & Worst Days */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <TrendingUpIcon />
                    <Typography variant="h6">Best Day</Typography>
                  </Stack>
                  <Typography variant="body1">
                    {report.bestDay ? new Date(report.bestDay.date).toLocaleDateString() : 'N/A'}
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    ₹{report.bestDay?.revenue?.toLocaleString('en-IN')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <TrendingDownIcon />
                    <Typography variant="h6">Worst Day</Typography>
                  </Stack>
                  <Typography variant="body1">
                    {report.worstDay ? new Date(report.worstDay.date).toLocaleDateString() : 'N/A'}
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    ₹{report.worstDay?.revenue?.toLocaleString('en-IN')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Health Score Progress */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              💪 Business Health Indicator
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="body2">Overall Health</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {report.aiInsights.healthScore?.toFixed(0)}/100
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={report.aiInsights.healthScore}
                sx={{
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 6,
                    background:
                      report.aiInsights.healthScore >= 80
                        ? 'linear-gradient(to right, #4CAF50, #8BC34A)'
                        : report.aiInsights.healthScore >= 60
                        ? 'linear-gradient(to right, #FFC107, #FF9800)'
                        : 'linear-gradient(to right, #FF6B6B, #FF5252)'
                  }
                }}
              />
            </Box>
            <Alert severity={
              report.aiInsights.healthStatus === 'Excellent'
                ? 'success'
                : report.aiInsights.healthStatus === 'Good'
                ? 'info'
                : 'warning'
            }>
              Status: <strong>{report.aiInsights.healthStatus}</strong>
            </Alert>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default MonthlyPerformanceReport;
