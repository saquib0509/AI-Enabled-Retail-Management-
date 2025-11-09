import { useState, FC, useEffect } from 'react';
import {
  Box, Paper, TextField, Button, Card, CardContent,
  Grid, Typography, Alert, Stack, LinearProgress, Chip
} from '@mui/material';
import {
  ComposedChart, Line, Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import api from '../../services/api';

interface PriceTrendReportType {
  priceData: any[];
  avgPrice: number;
  maxPrice: number;
  minPrice: number;
  volatility: number;
  standardDeviation: number;
  priceChange?: number;
  priceChangePercent?: number;
  avgQuantity: number;
  priceElasticity: number;
  totalRevenue: number;
  avgRevenue: number;
  lowPriceDays: number;
  mediumPriceDays: number;
  highPriceDays: number;
  aiInsights: {
    volatilityStatus: string;
    volatilityEmoji: string;
    elasticityAnalysis: string;
    demandResponse: string;
    pricingRecommendation: string;
    pricePosition: string;
    pricePercentile: number;
    revenueStatus: string;
    summary: string;
  };
}

const COLORS = ['#4CAF50', '#FFC107', '#FF6B6B'];

const PriceTrendReport: FC = () => {
  const [startDate, setStartDate] = useState<string>('2025-11-01');
  const [endDate, setEndDate] = useState<string>('2025-11-07');
  const [report, setReport] = useState<PriceTrendReportType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await api.get<PriceTrendReportType>(
        `/reports/price-trend?startDate=${startDate}&endDate=${endDate}`
      );
      setReport(res.data);
    } catch (error) {
      console.error('Error fetching price trend report:', error);
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
            {loading ? 'Loading...' : 'Generate Price Report'}
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
              background: 'linear-gradient(135deg, #FF6B9D 0%, #C44569 100%)',
              color: 'white'
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <AutoAwesomeIcon fontSize="large" />
              <Typography variant="h5" fontWeight="bold">
                AI Pricing Intelligence
              </Typography>
            </Stack>

            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
              {report.aiInsights.summary}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption">Price Volatility</Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ mt: 0.5 }}>
                    {report.aiInsights.volatilityEmoji}
                  </Typography>
                  <Typography variant="body2">
                    {report.aiInsights.volatilityStatus}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, fontSize: '0.75rem' }}>
                    Volatility: {report.volatility?.toFixed(1)}%
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption">Price Elasticity</Typography>
                  <Typography variant="body2" fontWeight="bold" sx={{ mt: 1 }}>
                    {report.aiInsights.elasticityAnalysis.split(' - ')[0]}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem', mt: 0.5 }}>
                    {report.aiInsights.demandResponse}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption">Current Price Position</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {report.aiInsights.pricePosition.split(' - ')[0]}
                  </Typography>
                  <Typography variant="body2">
                    Percentile: {report.aiInsights.pricePercentile?.toFixed(0)}%
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption">Revenue Status</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {report.aiInsights.revenueStatus.split(' - ')[0]}
                  </Typography>
                  <Typography variant="body2">
                    Total: ₹{report.totalRevenue?.toLocaleString('en-IN')}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Recommendation Alert */}
            <Alert severity="info" sx={{ mt: 2, bgcolor: 'rgba(255,255,255,0.95)' }}>
              <Typography variant="body2">
                <strong>Pricing Strategy:</strong> {report.aiInsights.pricingRecommendation}
              </Typography>
            </Alert>
          </Paper>

          {/* Summary Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={2}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="body2">Current Price</Typography>
                  <Typography variant="h6">₹{report.priceData?.[report.priceData.length - 1]?.price?.toFixed(2)}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="body2">Avg Price</Typography>
                  <Typography variant="h6">₹{report.avgPrice?.toFixed(2)}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="body2">Max Price</Typography>
                  <Typography variant="h6" sx={{ color: '#FF6B6B' }}>₹{report.maxPrice?.toFixed(2)}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="body2">Min Price</Typography>
                  <Typography variant="h6" sx={{ color: '#4CAF50' }}>₹{report.minPrice?.toFixed(2)}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="body2">Volatility</Typography>
                  <Typography variant="h6">{report.volatility?.toFixed(1)}%</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="body2">Elasticity</Typography>
                  <Typography variant="h6">{report.priceElasticity?.toFixed(2)}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Price Trend Chart with Quantity */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Price & Quantity Correlation
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={report.priceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dateLabel" />
                <YAxis yAxisId="left" label={{ value: 'Price (₹)', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'Quantity (L)', angle: 90, position: 'insideRight' }} />
                <Tooltip />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="price" fill="#FF6B9D" stroke="#C44569" name="Price" opacity={0.6} />
                <Line yAxisId="right" type="monotone" dataKey="quantity" stroke="#4CAF50" name="Quantity" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </Paper>

          {/* Price Distribution Pie Chart */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Days by Price Category
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Low Price Days', value: report.lowPriceDays },
                    { name: 'Medium Price Days', value: report.mediumPriceDays },
                    { name: 'High Price Days', value: report.highPriceDays }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>

          {/* Price Statistics */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Price Range Analysis</Typography>
                <Stack spacing={1.5}>
                  <Box>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="body2">Min: ₹{report.minPrice?.toFixed(2)}</Typography>
                      <Typography variant="body2">Max: ₹{report.maxPrice?.toFixed(2)}</Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={100}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          backgroundColor: '#FFD700'
                        }
                      }}
                    />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Range: ₹{(report.maxPrice - report.minPrice)?.toFixed(2)}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Volatility Assessment</Typography>
                <Stack spacing={1.5}>
                  <Box>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="body2">Volatility</Typography>
                      <Typography variant="body2" fontWeight="bold">{report.volatility?.toFixed(1)}%</Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(report.volatility, 100)}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          backgroundColor: report.volatility > 20 ? '#FF6B6B' : '#4CAF50'
                        }
                      }}
                    />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Std Dev: ₹{report.standardDeviation?.toFixed(2)}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          {/* Detailed Price Table */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              📋 Daily Price Details
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#f5f5f5' }}>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Price (₹)</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Quantity (L)</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Revenue (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {report.priceData.map((day, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px' }}>{day.dateLabel}</td>
                      <td style={{ padding: '10px', fontWeight: 'bold' }}>₹{day.price?.toFixed(2)}</td>
                      <td style={{ padding: '10px' }}>{day.quantity?.toFixed(2)}</td>
                      <td style={{ padding: '10px', color: '#4CAF50', fontWeight: 'bold' }}>
                        ₹{day.revenue?.toLocaleString('en-IN')}
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

export default PriceTrendReport;
