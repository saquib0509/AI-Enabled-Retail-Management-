import { useState, FC, useEffect } from 'react';
import {
  Box, Paper, TextField, Button, Card, CardContent,
  Grid, Typography, Alert, Stack, LinearProgress, Chip
} from '@mui/material';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import WarningIcon from '@mui/icons-material/Warning';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import StorageIcon from '@mui/icons-material/Storage';
import api from '../../services/api';

interface StockReportType {
  stockData: any[];
  totalConsumption: number;
  avgDailyConsumption: number;
  maxDailyConsumption: number;
  minDailyConsumption: number;
  currentStock: number;
  openingStock: number;
  daysUntilEmpty: number;
  daysUntilCritical: number;
  totalDelivery: number;
  deliveryDaysCount: number;
  stockTrend: string;
  stockChange: number;
  aiInsights: {
    healthStatus: string;
    healthEmoji: string;
    reorderUrgency: string;
    consumptionPattern: string;
    variancePercent: number;
    projectionAlert: string;
    deliveryStatus: string;
    summary: string;
  };
}

const StockMovementReport: FC = () => {
  const [startDate, setStartDate] = useState<string>('2025-11-01');
  const [endDate, setEndDate] = useState<string>('2025-11-07');
  const [report, setReport] = useState<StockReportType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await api.get<StockReportType>(
        `/reports/stock-movement?startDate=${startDate}&endDate=${endDate}`
      );
      setReport(res.data);
    } catch (error) {
      console.error('❌ Error fetching stock report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2}>
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
            {loading ? '⏳ Loading...' : '📦 Generate Stock Report'}
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
              background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
              color: 'white'
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <AutoAwesomeIcon fontSize="large" />
              <Typography variant="h5" fontWeight="bold">
                AI Inventory Intelligence
              </Typography>
            </Stack>

            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
              {report.aiInsights.summary}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption">Stock Health</Typography>
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
                  <Typography variant="caption">Reorder Action</Typography>
                  <Typography variant="body2" fontWeight="bold" sx={{ mt: 1 }}>
                    {report.aiInsights.reorderUrgency}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption">Days Until Empty</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {report.daysUntilEmpty < 1000 ? report.daysUntilEmpty?.toFixed(1) : '∞'}
                  </Typography>
                  <Typography variant="body2">
                    at current pace
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption">Consumption Pattern</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {report.aiInsights.consumptionPattern.split(' - ')[0]}
                  </Typography>
                  <Typography variant="body2">
                    Var: {report.aiInsights.variancePercent?.toFixed(1)}%
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Critical Alert */}
            {report.daysUntilCritical < 3 && (
              <Alert severity="error" sx={{ mt: 2, bgcolor: 'rgba(255,255,255,0.95)' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <WarningIcon />
                  <Typography variant="body2">
                    <strong>CRITICAL ALERT:</strong> {report.aiInsights.projectionAlert}
                  </Typography>
                </Stack>
              </Alert>
            )}
          </Paper>

          {/* Summary Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <StorageIcon color="primary" />
                    <Typography color="textSecondary" variant="body2">Current Stock</Typography>
                  </Stack>
                  <Typography variant="h6">{report.currentStock?.toFixed(2)}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="body2">Avg Daily Consumption</Typography>
                  <Typography variant="h6">{report.avgDailyConsumption?.toFixed(2)}</Typography>
                  <Typography variant="body2" sx={{ color: 'gray' }}>
                    (Max: {report.maxDailyConsumption?.toFixed(2)})
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <LocalShippingIcon color="success" />
                    <Typography color="textSecondary" variant="body2">Total Delivery</Typography>
                  </Stack>
                  <Typography variant="h6">{report.totalDelivery?.toFixed(2)}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="body2">Stock Trend</Typography>
                  <Chip
                    label={report.stockTrend}
                    color={report.stockChange > 0 ? 'success' : report.stockChange < 0 ? 'error' : 'default'}
                    variant="outlined"
                    sx={{ mt: 1 }}
                  />
                  <Typography variant="body2" sx={{ mt: 1, color: report.stockChange > 0 ? 'green' : 'red' }}>
                    {report.stockChange > 0 ? '+' : ''}{report.stockChange?.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Stock Level Progress */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              📊 Stock Level Status
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2">Current Stock</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {report.currentStock?.toFixed(2)} / {report.openingStock?.toFixed(2)}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={report.openingStock > 0 ? (report.currentStock / report.openingStock) * 100 : 0}
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 6,
                      background:
                        (report.currentStock / report.openingStock) * 100 > 50
                          ? 'linear-gradient(to right, #4CAF50, #8BC34A)'
                          : (report.currentStock / report.openingStock) * 100 > 25
                          ? 'linear-gradient(to right, #FFC107, #FF9800)'
                          : 'linear-gradient(to right, #FF6B6B, #FF5252)'
                    }
                  }}
                />
              </Box>
            </Stack>
          </Paper>

          {/* Stock Trend Chart */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              📈 Stock Level Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={report.stockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dateLabel" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="closingStock"
                  fill="#4CAF50"
                  stroke="#2E7D32"
                  name="Closing Stock"
                  opacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="openingStock"
                  fill="#FF9800"
                  stroke="#E65100"
                  name="Opening Stock"
                  opacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>

          {/* Consumption vs Delivery */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              📊 Daily Consumption vs Delivery
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={report.stockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dateLabel" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="consumption" fill="#FF6B6B" name="Consumption" />
                <Bar dataKey="delivery" fill="#4CAF50" name="Delivery" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>

          {/* Detailed Stock Table */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              📋 Daily Stock Details
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#f5f5f5' }}>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Opening</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Consumption</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Delivery</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Closing</th>
                  </tr>
                </thead>
                <tbody>
                  {report.stockData.map((day, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px' }}>{day.dateLabel}</td>
                      <td style={{ padding: '10px' }}>{day.openingStock?.toFixed(2)}</td>
                      <td style={{ padding: '10px', color: '#FF6B6B', fontWeight: 'bold' }}>
                        -{day.consumption?.toFixed(2)}
                      </td>
                      <td style={{ padding: '10px', color: '#4CAF50', fontWeight: 'bold' }}>
                        +{day.delivery?.toFixed(2)}
                      </td>
                      <td style={{ padding: '10px', fontWeight: 'bold' }}>
                        {day.closingStock?.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default StockMovementReport;
