import { useState, FC, useEffect } from 'react';
import {
  Box, Paper, Button, Card, CardContent,
  Grid, Typography, Alert, Stack, LinearProgress
} from '@mui/material';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import api from '../../services/api';

interface TrendDay {
  date: string;
  revenue: number;
  quantity: number;
  price: number;
}

interface ProductBreakdownItem {
  productId: number;
  productName: string;
  totalQuantity: number;
  totalRevenue: number;
}

interface ProductPieItem {
  name: string;
  value: number;
  revenue: number;
}

interface DailySalesReportType {
  totalRevenue: number;
  totalSales: number;
  avgPricePerLiter: number;
  aiInsight: string;
  dailyTrendData: TrendDay[];
  productBreakdown: ProductBreakdownItem[];
  productPieData: ProductPieItem[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#f44336', '#795548'];

const DailySalesReport: FC = () => {
  const [report, setReport] = useState<DailySalesReportType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Auto-fetch last 7 days on component mount
  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async (): Promise<void> => {
    setLoading(true);
    try {
      const today = new Date();
      const endDate = today.toISOString().slice(0, 10);
      const startDate = new Date(today.getTime() - 6 * 86400000).toISOString().slice(0, 10);
      
      console.log(`📊 Fetching last 7 days: ${startDate} to ${endDate}`);
      
      const res = await api.get<DailySalesReportType>(
        `/reports/daily-sales?startDate=${startDate}&endDate=${endDate}`
      );
      
      console.log('✅ Report received:', res.data);
      setReport(res.data);
    } catch (error) {
      console.error('❌ Error fetching daily sales report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2}>
          <Button 
            variant="contained" 
            onClick={fetchReport} 
            disabled={loading}
          >
            {loading ? '⏳ Loading...' : '📊 Generate Last 7 Days Report'}
          </Button>
        </Stack>
      </Paper>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {report && (
        <>
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

          {/* AI Insight */}
          {report.aiInsight && (
            <Alert severity="info" sx={{ mb: 3 }}>
              🤖 <strong>AI Insight:</strong> {report.aiInsight}
            </Alert>
          )}

          {/* Line Chart - Daily Trend (Chronologically Ordered) */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              📈 Daily Sales Trend (Correct Date Order)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={report.dailyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 11 }} 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8884d8" 
                  name="Revenue (₹)" 
                  strokeWidth={2}
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="quantity" 
                  stroke="#82ca9d" 
                  name="Quantity (L)" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>

          {/* Pie Chart - Product Sales Share */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              🥧 Product-wise Sales Share (All Products)
            </Typography>
            {report.productPieData.length === 0 ? (
              <Alert severity="warning">No product data available</Alert>
            ) : (
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
                  <Tooltip formatter={(value: number) => `${value?.toFixed(0)}L`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Paper>

          {/* Bar Chart - Product Breakdown */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              📊 Product-wise Sales Breakdown (Revenue & Quantity)
            </Typography>
            {report.productBreakdown.length === 0 ? (
              <Alert severity="warning">No product breakdown data</Alert>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={report.productBreakdown.map((p) => ({
                    name: p.productName,
                    quantity: p.totalQuantity,
                    revenue: p.totalRevenue,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="quantity" fill="#8884d8" name="Quantity (L)" />
                  <Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" name="Revenue (₹)" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>

          {/* Product Details Table */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              📋 Detailed Product Breakdown
            </Typography>
            {report.productBreakdown.length === 0 ? (
              <Alert severity="warning">No product data available</Alert>
            ) : (
              <Box sx={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#f5f5f5' }}>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Product Name</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Total Quantity (L)</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Total Revenue (₹)</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Avg Price/L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.productBreakdown.map((product, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '10px' }}><strong>{product.productName}</strong></td>
                        <td style={{ padding: '10px' }}>{product.totalQuantity.toFixed(2)}</td>
                        <td style={{ padding: '10px' }}>₹{product.totalRevenue.toLocaleString('en-IN')}</td>
                        <td style={{ padding: '10px' }}>
                          {product.totalQuantity > 0
                            ? `₹${(product.totalRevenue / product.totalQuantity).toFixed(2)}`
                            : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            )}
          </Paper>
        </>
      )}
    </Box>
  );
};

export default DailySalesReport;
