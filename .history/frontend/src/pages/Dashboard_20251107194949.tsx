import { useState, FC, useEffect } from 'react';
import {
  Box, Paper, Card, CardContent, Grid, Typography, Alert, Stack, Chip, Button,
  LinearProgress, Container
} from '@mui/material';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

interface DashboardData {
  todayRevenue: number;
  todayQuantity: number;
  todayStock: number;
  revenueVsYesterday: number;
  revenue7Days: number;
  avgDaily7Days: number;
  topProduct7Days: string;
  attendanceToday: number;
  presentToday: number;
  totalEmployees: number;
  stockAlerts: any[];
  criticalAlerts: string[];
  aiBrief: string;
  recommendations: string[];
}

const Dashboard: FC = () => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get<DashboardData>('/dashboard');
      setDashboard(res.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Typography>Loading dashboard...</Typography>;
  if (!dashboard) return <Typography>Failed to load dashboard</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* AI BRIEF - TOP PRIORITY */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <AutoAwesomeIcon fontSize="large" />
          <Typography variant="h6">{dashboard.aiBrief}</Typography>
        </Stack>
      </Paper>

      {/* CRITICAL ALERTS */}
      {dashboard.criticalAlerts.length > 0 && (
        <Stack spacing={1} sx={{ mb: 3 }}>
          {dashboard.criticalAlerts.map((alert, idx) => (
            <Alert key={idx} severity={alert.includes('🚨') ? 'error' : 'warning'}>
              <Stack direction="row" alignItems="center" spacing={1}>
                {alert.includes('🚨') ? <ErrorIcon /> : <WarningIcon />}
                <Typography>{alert}</Typography>
              </Stack>
            </Alert>
          ))}
        </Stack>
      )}

      {/* TOP KPI CARDS */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" variant="body2">Today's Revenue</Typography>
              <Typography variant="h5" sx={{ color: '#667eea', fontWeight: 'bold', mt: 1 }}>
                ₹{dashboard.todayRevenue?.toLocaleString('en-IN')}
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1 }}>
                {dashboard.revenueVsYesterday >= 0 ? (
                  <>
                    <TrendingUpIcon fontSize="small" sx={{ color: '#4CAF50' }} />
                    <Typography variant="body2" sx={{ color: '#4CAF50' }}>
                      +{dashboard.revenueVsYesterday?.toFixed(1)}%
                    </Typography>
                  </>
                ) : (
                  <>
                    <TrendingDownIcon fontSize="small" sx={{ color: '#FF6B6B' }} />
                    <Typography variant="body2" sx={{ color: '#FF6B6B' }}>
                      {dashboard.revenueVsYesterday?.toFixed(1)}%
                    </Typography>
                  </>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" variant="body2">Today's Sales</Typography>
              <Typography variant="h5" sx={{ color: '#FF6B9D', fontWeight: 'bold', mt: 1 }}>
                {dashboard.todayQuantity?.toFixed(0)} L
              </Typography>
              <Chip label="Active" size="small" color="success" sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" variant="body2">Team Attendance</Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>
                {dashboard.attendanceToday?.toFixed(0)}%
              </Typography>
              <LinearProgress variant="determinate" value={dashboard.attendanceToday} sx={{ mt: 1 }} />
              <Typography variant="body2" sx={{ mt: 1, color: 'gray' }}>
                {dashboard.presentToday} / {dashboard.totalEmployees} present
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" variant="body2">Top Product</Typography>
              <Typography variant="h5" sx={{ color: '#4CAF50', fontWeight: 'bold', mt: 1 }}>
                {dashboard.topProduct7Days}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: 'gray' }}>
                Last 7 days
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* STOCK ALERTS */}
      {dashboard.stockAlerts.length > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>📦 Stock Status</Typography>
          <Grid container spacing={1}>
            {dashboard.stockAlerts.map((alert, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Card sx={{ background: alert.status === 'CRITICAL' ? '#ffebee' : alert.status === 'WARNING' ? '#fff3e0' : '#e8f5e9' }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <Typography variant="h6">{alert.emoji}</Typography>
                      <Typography variant="body2" fontWeight="bold">{alert.product}</Typography>
                    </Stack>
                    <Typography variant="body2" color="textSecondary">Status: {alert.status}</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Days until empty: <strong>{alert.daysUntilEmpty}</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      Current: <strong>{alert.currentStock?.toFixed(0)}L</strong>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* AI RECOMMENDATIONS */}
      <Paper sx={{ p: 2, mb: 3, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
        <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mb: 2 }}>
          <AutoAwesomeIcon />
          <div>
            <Typography variant="h6">AI Recommendations</Typography>
            <Stack spacing={1} sx={{ mt: 1 }}>
              {dashboard.recommendations.map((rec, idx) => (
                <Typography key={idx} variant="body2">{rec}</Typography>
              ))}
            </Stack>
          </div>
        </Stack>
      </Paper>

      {/* QUICK LINKS TO DETAILED REPORTS */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>📊 View Detailed Reports</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/reports')}
              sx={{ py: 1.5 }}
            >
              Daily Sales
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/reports')}
              sx={{ py: 1.5 }}
            >
              Monthly Performance
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/reports')}
              sx={{ py: 1.5 }}
            >
              Stock Movement
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/reports')}
              sx={{ py: 1.5 }}
            >
              Price Trends
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/reports')}
              sx={{ py: 1.5 }}
            >
              Financials
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Dashboard;
