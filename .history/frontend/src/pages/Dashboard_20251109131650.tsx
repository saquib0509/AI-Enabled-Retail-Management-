import { useState, FC, useEffect } from 'react';
import {
  Box,
  Paper,
  Card,
  CardContent,
  Grid,
  Typography,
  Alert,
  Stack,
  Chip,
  Button,
  LinearProgress,
  Container,
  CircularProgress,
} from '@mui/material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import CrowdDetectionWidget from '../components/CrowdDetectionWidget';

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
    // Refresh every 5 minutes
    const interval = setInterval(fetchDashboard, 300000);
    return () => clearInterval(interval);
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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!dashboard) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Failed to load dashboard. Please try refreshing.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: '#1a237e',
            mb: 1,
          }}
        >
          Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: 'gray' }}>
          Last updated: {new Date().toLocaleTimeString()}
        </Typography>
      </Box>

      {/* AI BRIEF - TOP PRIORITY */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <AutoAwesomeIcon fontSize="large" />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {dashboard.aiBrief}
          </Typography>
        </Stack>
      </Paper>

      {/* CRITICAL ALERTS */}
      {dashboard.criticalAlerts.length > 0 && (
        <Stack spacing={1} sx={{ mb: 3 }}>
          {dashboard.criticalAlerts.map((alert, idx) => {
            const isError =
              alert.toLowerCase().includes('critical') ||
              alert.toLowerCase().includes('error');
            return (
              <Alert key={idx} severity={isError ? 'error' : 'warning'} sx={{ borderRadius: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  {isError ? <ErrorIcon /> : <WarningIcon />}
                  <Typography sx={{ fontWeight: 500 }}>
                    {alert.replace(/🚨/g, '').replace(/⚠️/g, '').trim()}
                  </Typography>
                </Stack>
              </Alert>
            );
          })}
        </Stack>
      )}

      {/* TOP KPI CARDS */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Today's Revenue */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Typography color="textSecondary" variant="body2" sx={{ fontWeight: 500 }}>
                Today's Revenue
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: '#667eea',
                  fontWeight: 'bold',
                  mt: 1,
                }}
              >
                ₹{dashboard.todayRevenue?.toLocaleString('en-IN') || '0'}
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1 }}>
                {dashboard.revenueVsYesterday >= 0 ? (
                  <>
                    <TrendingUpIcon fontSize="small" sx={{ color: '#4CAF50' }} />
                    <Typography variant="body2" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                      +{dashboard.revenueVsYesterday?.toFixed(1)}%
                    </Typography>
                  </>
                ) : (
                  <>
                    <TrendingDownIcon fontSize="small" sx={{ color: '#FF6B6B' }} />
                    <Typography variant="body2" sx={{ color: '#FF6B6B', fontWeight: 'bold' }}>
                      {dashboard.revenueVsYesterday?.toFixed(1)}%
                    </Typography>
                  </>
                )}
                <Typography variant="caption" sx={{ color: 'gray', ml: 'auto' }}>
                  vs yesterday
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Today's Sales */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Typography color="textSecondary" variant="body2" sx={{ fontWeight: 500 }}>
                Today's Sales
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: '#FF6B9D',
                  fontWeight: 'bold',
                  mt: 1,
                }}
              >
                {dashboard.todayQuantity?.toFixed(2) || '0'} L
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Chip label="Active" size="small" color="success" variant="outlined" />
                <Typography variant="caption" sx={{ color: 'gray' }}>
                  7-day avg: {dashboard.avgDaily7Days?.toFixed(2)}L
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Team Attendance */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Typography color="textSecondary" variant="body2" sx={{ fontWeight: 500 }}>
                Team Attendance
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  mt: 1,
                  color:
                    dashboard.attendanceToday >= 80
                      ? '#4CAF50'
                      : dashboard.attendanceToday >= 60
                        ? '#FF9800'
                        : '#F44336',
                }}
              >
                {dashboard.attendanceToday?.toFixed(0)}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={dashboard.attendanceToday}
                sx={{
                  mt: 1,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    background:
                      dashboard.attendanceToday >= 80
                        ? '#4CAF50'
                        : dashboard.attendanceToday >= 60
                          ? '#FF9800'
                          : '#F44336',
                    borderRadius: 3,
                  },
                }}
              />
              <Typography variant="body2" sx={{ mt: 1, color: 'gray', fontSize: 12 }}>
                {dashboard.presentToday} / {dashboard.totalEmployees} present
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Product */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Typography color="textSecondary" variant="body2" sx={{ fontWeight: 500 }}>
                Top Product (7 days)
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: '#4CAF50',
                  fontWeight: 'bold',
                  mt: 1,
                }}
              >
                {dashboard.topProduct7Days || 'N/A'}
              </Typography>
              <Chip label="Best Seller" size="small" color="success" sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Crowd Detection & Stock Alerts Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Crowd Detection Widget */}
        <Grid item xs={12} md={6}>
          <CrowdDetectionWidget />
        </Grid>

        {/* Stock Status */}
        <Grid item xs={12} md={6}>
          {dashboard.stockAlerts.length > 0 ? (
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2, height: '100%' }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: 'bold',
                }}
              >
                Stock Status
              </Typography>
              <Stack spacing={1.5}>
                {dashboard.stockAlerts.slice(0, 4).map((alert, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      p: 1.5,
                      background:
                        alert.status === 'CRITICAL'
                          ? '#ffebee'
                          : alert.status === 'WARNING'
                            ? '#fff3e0'
                            : '#e8f5e9',
                      borderRadius: 1,
                      borderLeft: `4px solid ${
                        alert.status === 'CRITICAL'
                          ? '#F44336'
                          : alert.status === 'WARNING'
                            ? '#FF9800'
                            : '#4CAF50'
                      }`,
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                      <Typography variant="h6">{alert.emoji}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', flex: 1 }}>
                        {alert.product}
                      </Typography>
                      <Chip
                        label={alert.status}
                        size="small"
                        variant="filled"
                        sx={{
                          background:
                            alert.status === 'CRITICAL'
                              ? '#F44336'
                              : alert.status === 'WARNING'
                                ? '#FF9800'
                                : '#4CAF50',
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      />
                    </Stack>
                    <Typography variant="caption" sx={{ color: 'gray' }}>
                      Days left: {alert.daysUntilEmpty} | Current: {alert.currentStock?.toFixed(0)}L
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          ) : (
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
              <Alert severity="success">All stock levels are optimal</Alert>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* AI RECOMMENDATIONS */}
      {dashboard.recommendations.length > 0 && (
        <Paper
          sx={{
            p: 3,
            mb: 3,
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <AutoAwesomeIcon sx={{ fontSize: 28, flexShrink: 0 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1.5 }}>
                AI Recommendations
              </Typography>
              <Stack spacing={0.8}>
                {dashboard.recommendations.map((rec, idx) => (
                  <Stack direction="row" spacing={1} alignItems="flex-start" key={idx}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: 16, mt: 0.3 }}>
                      •
                    </Typography>
                    <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                      {rec}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Paper>
      )}

      {/* QUICK LINKS TO DETAILED REPORTS */}
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 'bold',
          }}
        >
          View Detailed Reports
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate('/reports')}
              sx={{
                py: 1.5,
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                textTransform: 'none',
              }}
            >
              Daily Sales
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate('/reports')}
              sx={{
                py: 1.5,
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                textTransform: 'none',
              }}
            >
              Monthly Performance
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate('/reports')}
              sx={{
                py: 1.5,
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                textTransform: 'none',
              }}
            >
              Stock Movement
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate('/reports')}
              sx={{
                py: 1.5,
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                textTransform: 'none',
              }}
            >
              Price Trends
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate('/reports')}
              sx={{
                py: 1.5,
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                textTransform: 'none',
              }}
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
