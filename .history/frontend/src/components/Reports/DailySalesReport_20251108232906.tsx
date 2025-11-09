import { useState, FC, useEffect } from 'react';
import {
  Box, Paper, Button, Card, CardContent,
  Grid, Typography, Alert, Stack, Chip
} from '@mui/material';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import api from '../../services/api';

interface DailySalesReportType {
  totalRevenue: number;
  totalSales: number;
  avgPricePerLiter: number;
  dailyTrendData: any[];
  productBreakdown: any[];
  productPieData: any[];
  aiInsights: {
    topProduct: string;
    topProductSales: number;
    revenueTrend: string;
    trendPercentage: number;
    bestDay: string;
    bestDayRevenue: number;
    lowPerformingProducts: string[];
    revenuePerLiter: number;
    summary: string;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#f44336', '#795548'];

const DailySalesReport: FC = () => {
  const [report, setReport] = useState<DailySalesReportType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async (): Promise<void> => {
    setLoading(true);
    try {
      const today = new Date();
      const endDate = today.toISOString().slice(0, 10);
      const startDate = new Date(today.getTime() - 6 * 86400000).toISOString().slice(0, 10);
      
      const res = await api.get<DailySalesReportType>(
        `/reports/daily-sales?startDate=${startDate}&endDate=${endDate}`
      );
      
      setReport(res.data);
    } catch (error) {
      console.error('Error fetching daily sales report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Button variant="contained" onClick={fetchReport} disabled={loading}>
          {loading ? 'Loading...' : 'Generate Last 7 Days Report'}
        </Button>
      </Paper>

      {report && (
        <>
          {/* AI INSIGHTS - PROMINENTLY DISPLAYED */}
          <Paper 
            sx={{ 
              p: 3, 
              mb: 3, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <AutoAwesomeIcon fontSize="large" />
              <Typography variant="h5" fontWeight="bold">
                AI-Powered Insights
              </Typography>
            </Stack>
            
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
              {report.aiInsights.summary}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption">Top Product</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {report.aiInsights.topProduct}
                  </Typography>
                  <Typography variant="body2">
                    {report.aiInsights.topProductSales.toFixed(0)} L sold
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption">Revenue Trend</Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {report.aiInsights.revenueTrend === 'increasing' ? (
                      <TrendingUpIcon color="success" />
                    ) : (
                      <TrendingDownIcon color="error" />
                    )}
                    <Typography variant="h6" fontWeight="bold">
                      {report.aiInsights.revenueTrend}
                    </Typography>
                  </Stack>
                  <Typography variant="body2">
                    {report.aiInsights.trendPercentage?.toFixed(1)}% change
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption">Best Day</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {new Date(report.aiInsights.bestDay).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    ₹{report.aiInsights.bestDayRevenue?.toLocaleString('en-IN')}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption">Avg Revenue/L</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    ₹{report.aiInsights.revenuePerLiter?.toFixed(2)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {report.aiInsights.lowPerformingProducts.length > 0 && (
              <Alert severity="warning" sx={{ mt: 2, bgcolor: 'rgba(255,255,255,0.9)' }}>
                <Typography variant="body2">
                  <strong>Products with no sales:</strong> {report.aiInsights.lowPerformingProducts.join(', ')}
                </Typography>
              </Alert>
            )}
          </Paper>

          {/* Summary Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="body2">Total Revenue</Typography>
                  <Typography variant="h6">₹{report.totalRevenue?.toLocaleString('en-IN')}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="body2">Total Sales</Typography>
                  <Typography variant="h6">{report.totalSales?.toFixed(2)} L</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="body2">Avg Price/Liter</Typography>
                  <Typography variant="h6">₹{report.avgPricePerLiter?.toFixed(2)}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="body2">Period</Typography>
                  <Typography variant="h6">Last 7 Days</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Line Chart */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Daily Sales Trend</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={report.dailyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue (₹)" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="quantity" stroke="#82ca9d" name="Quantity (L)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>

          {/* Pie Chart */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Product Sales Distribution</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={report.productPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value?.toFixed(0)}L`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {report.productPieData.map((_, idx) => (
                    <Cell key={`slice-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>

          {/* Product Details Table (ALL PRODUCTS) */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>📋 All Products Performance</Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#f5f5f5' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Product</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Quantity (L)</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Revenue (₹)</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Avg Price/L</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {report.productBreakdown.map((product, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px' }}><strong>{product.productName}</strong></td>
                      <td style={{ padding: '10px' }}>
                        {product.totalQuantity === 0 ? (
                          <Chip label="No Sales" size="small" color="warning" />
                        ) : (
                          product.totalQuantity.toFixed(2)
                        )}
                      </td>
                      <td style={{ padding: '10px' }}>₹{product.totalRevenue.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '10px' }}>
                        {product.totalQuantity > 0
                          ? `₹${(product.totalRevenue / product.totalQuantity).toFixed(2)}`
                          : 'N/A'}
                      </td>
                      <td style={{ padding: '10px' }}>
                        {product.totalQuantity > 0 ? (
                          <Chip label="Active" size="small" color="success" />
                        ) : (
                          <Chip label="Inactive" size="small" color="default" />
                        )}
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

export default DailySalesReport;
