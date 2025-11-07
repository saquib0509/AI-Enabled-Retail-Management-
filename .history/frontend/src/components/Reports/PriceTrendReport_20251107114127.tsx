import { useState, FC } from 'react';
import {
  Box, Paper, TextField, Button, Card, CardContent,
  Grid, Typography, Alert, Stack
} from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import api from '../../services/api';
import { PriceReport as PriceReportType } from './types';

const PriceTrendReport: FC = () => {
  const [startDate, setStartDate] = useState<string>('2025-11-01');
  const [endDate, setEndDate] = useState<string>('2025-11-06');
  const [report, setReport] = useState<PriceReportType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchReport = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await api.get<PriceReportType>(
        `/reports/price-trend?startDate=${startDate}&endDate=${endDate}`
      );
      setReport(res.data);
    } catch (error) {
      console.error('Error fetching price report:', error);
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
            <Grid item xs={12} sm={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">Avg Price</Typography>
                  <Typography variant="h6">₹{report.avgPrice?.toFixed(2)}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">Max Price</Typography>
                  <Typography variant="h6">₹{report.maxPrice?.toFixed(2)}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">Min Price</Typography>
                  <Typography variant="h6">₹{report.minPrice?.toFixed(2)}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">Volatility</Typography>
                  <Typography variant="h6">{report.volatility?.toFixed(2)}%</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {report.aiElasticityInsight && (
            <Alert severity="info" sx={{ mb: 3 }}>
              🤖 <strong>AI Elasticity Insight:</strong> {report.aiElasticityInsight}
            </Alert>
          )}

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Price Trend Analysis</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={report.priceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="pricePerLiter"
                  stroke="#8884d8"
                  name="Price/Liter (₹)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="salesVolume"
                  stroke="#82ca9d"
                  name="Sales Volume (L)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default PriceTrendReport;
