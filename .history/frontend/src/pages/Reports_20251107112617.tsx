import { useState, FC } from 'react';
import {
  Box, Paper, Tabs, Tab, TextField, Button, Card, CardContent,
  Grid, Typography, LinearProgress, Alert, Stack
} from '@mui/material';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import api from '../services/api';

// Type Definitions
interface DailyData {
  date: string;
  revenue: number;
  sales: number;
}
interface StockData {
  date: string;
  openingStock: number;
  closingStock: number;
  consumption: number;
}
interface PriceData {
  date: string;
  pricePerLiter: number;
  salesVolume: number;
}
interface EmployeeAttendance {
  employeeName: string;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  attendancePercentage: number;
}
interface ComparisonData {
  category: string;
  amount: number;
}
interface DailySalesReport {
  totalRevenue: number;
  totalSales: number;
  avgPricePerLiter: number;
  transactionCount: number;
  dailyData: DailyData[];
  aiInsight: string;
}
interface MonthlyReport {
  currentMonthRevenue: number;
  previousMonthRevenue: number;
  growthPercentage: number;
  bestDay: {
    entryDate: string;
    dailyRevenue: number;
  };
  worstDay: {
    entryDate: string;
    dailyRevenue: number;
  };
  aiPrediction: string;
}
interface StockReport {
  stockData: StockData[];
  avgDailyConsumption: number;
  estimatedDaysUntilStockEmpty: number;
  aiAlert: string;
}
interface PriceReport {
  priceData: PriceData[];
  avgPrice: number;
  maxPrice: number;
  minPrice: number;
  volatility: number;
  aiElasticityInsight: string;
}
interface RevenueExpenseReport {
  totalRevenue: number;
  totalExpense: number;
  netProfit: number;
  profitMargin: number;
  comparisonData: ComparisonData[];
  aiInsight: string;
}
interface AttendanceReport {
  employeeAttendanceData: EmployeeAttendance[];
  aiAlert: string;
}
interface PayrollReport {
  totalSalary: number;
  pendingPayments: number;
  salaryData: Array<{
    employeeId: number;
    baseSalary: number;
    netSalary: number;
    status: string;
    paymentMethod: string;
  }>;
  aiAlert?: string;
}
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const COLORS: string[] = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const TabPanel: FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const Reports: FC = () => {
  const [tabValue, setTabValue] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>('2025-11-01');
  const [endDate, setEndDate] = useState<string>('2025-11-06');
  const [year, setYear] = useState<number>(2025);
  const [month, setMonth] = useState<number>(11);

  const [dailySalesReport, setDailySalesReport] = useState<DailySalesReport | null>(null);
  const [monthlyReport, setMonthlyReport] = useState<MonthlyReport | null>(null);
  const [stockReport, setStockReport] = useState<StockReport | null>(null);
  const [priceReport, setPriceReport] = useState<PriceReport | null>(null);
  const [revenueExpenseReport, setRevenueExpenseReport] = useState<RevenueExpenseReport | null>(null);
  const [attendanceReport, setAttendanceReport] = useState<AttendanceReport | null>(null);
  const [payrollReport, setPayrollReport] = useState<PayrollReport | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  // ========== OPERATIONAL REPORTS ==========
  const fetchDailySalesReport = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await api.get<DailySalesReport>(
        `/reports/daily-sales?startDate=${startDate}&endDate=${endDate}`
      );
      setDailySalesReport(res.data);
    } catch (error) {
      console.error('Error fetching daily sales report:', error);
    }
    setLoading(false);
  };
  const fetchMonthlyReport = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await api.get<MonthlyReport>(
        `/reports/monthly-performance?year=${year}&month=${month}`
      );
      setMonthlyReport(res.data);
    } catch (error) {
      console.error('Error fetching monthly report:', error);
    }
    setLoading(false);
  };
  const fetchStockReport = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await api.get<StockReport>(
        `/reports/stock-movement?startDate=${startDate}&endDate=${endDate}`
      );
      setStockReport(res.data);
    } catch (error) {
      console.error('Error fetching stock report:', error);
    }
    setLoading(false);
  };
  const fetchPriceReport = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await api.get<PriceReport>(
        `/reports/price-trend?startDate=${startDate}&endDate=${endDate}`
      );
      setPriceReport(res.data);
    } catch (error) {
      console.error('Error fetching price report:', error);
    }
    setLoading(false);
  };
  const fetchRevenueExpenseReport = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await api.get<RevenueExpenseReport>(
        `/reports/revenue-vs-expense?startDate=${startDate}&endDate=${endDate}`
      );
      setRevenueExpenseReport(res.data);
    } catch (error) {
      console.error('Error fetching revenue/expense report:', error);
    }
    setLoading(false);
  };
  const fetchAttendanceReport = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await api.get<AttendanceReport>(
        `/reports/employee-attendance?startDate=${startDate}&endDate=${endDate}`
      );
      setAttendanceReport(res.data);
    } catch (error) {
      console.error('Error fetching attendance report:', error);
    }
    setLoading(false);
  };
  const fetchPayrollReport = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await api.get<PayrollReport>(`/reports/payroll`);
      setPayrollReport(res.data);
    } catch (error) {
      console.error('Error fetching payroll report:', error);
    }
    setLoading(false);
  };
  const handleTabChange = (event: React.SyntheticEvent, newValue: number): void => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={800} color="primary.main" sx={{ mb: 3 }}>
        📊 AI-Powered Reports & Analytics
      </Typography>
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="📈 Daily Sales" id="tab-0" aria-controls="tabpanel-0" />
        <Tab label="📅 Monthly Performance" id="tab-1" aria-controls="tabpanel-1" />
        <Tab label="📦 Stock Movement" id="tab-2" aria-controls="tabpanel-2" />
        <Tab label="💰 Price Trend" id="tab-3" aria-controls="tabpanel-3" />
        <Tab label="💹 Revenue vs Expense" id="tab-4" aria-controls="tabpanel-4" />
        <Tab label="👥 Employee Attendance" id="tab-5" aria-controls="tabpanel-5" />
        <Tab label="💵 Payroll" id="tab-6" aria-controls="tabpanel-6" />
      </Tabs>
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Daily Sales */}
      <TabPanel value={tabValue} index={0}>
        <Box>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <TextField type="date" label="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} InputLabelProps={{ shrink: true }} />
              <TextField type="date" label="End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} InputLabelProps={{ shrink: true }} />
              <Button variant="contained" onClick={fetchDailySalesReport}>Generate Report</Button>
            </Stack>
          </Paper>
          {dailySalesReport && (
            <>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary">Total Revenue</Typography>
                      <Typography variant="h6">₹{dailySalesReport.totalRevenue?.toLocaleString('en-IN')}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary">Total Sales</Typography>
                      <Typography variant="h6">{dailySalesReport.totalSales?.toFixed(2)} L</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary">Avg Price/Liter</Typography>
                      <Typography variant="h6">₹{dailySalesReport.avgPricePerLiter?.toFixed(2)}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary">Transactions</Typography>
                      <Typography variant="h6">{dailySalesReport.transactionCount}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              {dailySalesReport.aiInsight && (
                <Alert severity="info" sx={{ mb: 3 }}>
                  🤖 {dailySalesReport.aiInsight}
                </Alert>
              )}
              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Daily Sales Trend</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailySalesReport.dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue (₹)" />
                    <Line type="monotone" dataKey="sales" stroke="#82ca9d" name="Sales (L)" />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </>
          )}
        </Box>
      </TabPanel>

      {/* Monthly Performance */}
      <TabPanel value={tabValue} index={1}>
        <Box>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <TextField
                type="number"
                label="Year"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
              />
              <TextField
                type="number"
                label="Month"
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                inputProps={{ min: 1, max: 12 }}
              />
              <Button variant="contained" onClick={fetchMonthlyReport}>
                Generate Report
              </Button>
            </Stack>
          </Paper>
          {monthlyReport && (
            <>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary">Current Month Revenue</Typography>
                      <Typography variant="h6">
                        ₹{monthlyReport.currentMonthRevenue?.toLocaleString('en-IN')}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1, color: monthlyReport.growthPercentage >= 0 ? 'green' : 'red' }}>
                        {monthlyReport.growthPercentage >= 0 ? '📈' : '📉'} {monthlyReport.growthPercentage?.toFixed(2)}% vs last month
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary">Previous Month</Typography>
                      <Typography variant="h6">
                        ₹{monthlyReport.previousMonthRevenue?.toLocaleString('en-IN')}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              {monthlyReport.aiPrediction && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  🤖 <strong>AI Prediction:</strong> {monthlyReport.aiPrediction}
                </Alert>
              )}
            </>
          )}
        </Box>
      </TabPanel>

      {/* Stock Movement */}
      <TabPanel value={tabValue} index={2}>
        <Box>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <TextField type="date" label="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} InputLabelProps={{ shrink: true }} />
              <TextField type="date" label="End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} InputLabelProps={{ shrink: true }} />
              <Button variant="contained" onClick={fetchStockReport}>Generate Report</Button>
            </Stack>
          </Paper>
          {stockReport && (
            <>
              {stockReport.aiAlert && (
                <Alert severity={stockReport.aiAlert.includes("REORDER") ? "error" : "success"} sx={{ mb: 3 }}>
                  {stockReport.aiAlert}
                </Alert>
              )}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary">Avg Daily Consumption</Typography>
                      <Typography variant="h6">{stockReport.avgDailyConsumption?.toFixed(2)} L</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary">Days Until Stock Empty</Typography>
                      <Typography variant="h6">{stockReport.estimatedDaysUntilStockEmpty?.toFixed(1)} days</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Stock Levels</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stockReport.stockData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="openingStock" fill="#8884d8" name="Opening Stock" />
                    <Bar dataKey="closingStock" fill="#82ca9d" name="Closing Stock" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </>
          )}
        </Box>
      </TabPanel>

      {/* Price Trend */}
      <TabPanel value={tabValue} index={3}>
        <Box>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <TextField type="date" label="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} InputLabelProps={{ shrink: true }} />
              <TextField type="date" label="End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} InputLabelProps={{ shrink: true }} />
              <Button variant="contained" onClick={fetchPriceReport}>Generate Report</Button>
            </Stack>
          </Paper>
          {priceReport && (
            <>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary">Avg Price</Typography>
                      <Typography variant="h6">₹{priceReport.avgPrice?.toFixed(2)}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary">Max Price</Typography>
                      <Typography variant="h6">₹{priceReport.maxPrice?.toFixed(2)}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary">Min Price</Typography>
                      <Typography variant="h6">₹{priceReport.minPrice?.toFixed(2)}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary">Volatility</Typography>
                      <Typography variant="h6">{priceReport.volatility?.toFixed(2)}%</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              {priceReport.aiElasticityInsight && (
                <Alert severity="info" sx={{ mb: 3 }}>
                  🤖 <strong>AI Elasticity Insight:</strong> {priceReport.aiElasticityInsight}
                </Alert>
              )}
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Price Trend Analysis</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={priceReport.priceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="pricePerLiter" stroke="#8884d8" name="Price/Liter (₹)" />
                    <Line yAxisId="right" type="monotone" dataKey="salesVolume" stroke="#82ca9d" name="Sales Volume (L)" />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </>
          )}
        </Box>
      </TabPanel>

      {/* Revenue vs Expense */}
      <TabPanel value={tabValue} index={4}>
        <Box>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <TextField type="date" label="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} InputLabelProps={{ shrink: true }} />
              <TextField type="date" label="End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} InputLabelProps={{ shrink: true }} />
              <Button variant="contained" onClick={fetchRevenueExpenseReport}>Generate Report</Button>
            </Stack>
          </Paper>
          {revenueExpenseReport && (
            <>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary">Total Revenue</Typography>
                      <Typography variant="h6">₹{revenueExpenseReport.totalRevenue?.toLocaleString('en-IN')}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary">Total Expense</Typography>
                      <Typography variant="h6">₹{revenueExpenseReport.totalExpense?.toLocaleString('en-IN')}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary">Net Profit (Margin)</Typography>
                      <Typography variant="h6">
                        ₹{revenueExpenseReport.netProfit?.toLocaleString('en-IN')} ({revenueExpenseReport.profitMargin?.toFixed(2)}%)
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              {revenueExpenseReport.aiInsight && (
                <Alert severity="info" sx={{ mb: 3 }}>
                  🤖 <strong>AI Financial Insight:</strong> {revenueExpenseReport.aiInsight}
                </Alert>
              )}
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Revenue vs Expense Breakdown</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={revenueExpenseReport.comparisonData}
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
                      formatter={(value: number) =>
                        `₹${value?.toLocaleString('en-IN')}`
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </>
          )}
        </Box>
      </TabPanel>

      {/* Employee Attendance */}
      <TabPanel value={tabValue} index={5}>
        <Box>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <TextField type="date" label="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} InputLabelProps={{ shrink: true }} />
              <TextField type="date" label="End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} InputLabelProps={{ shrink: true }} />
              <Button variant="contained" onClick={fetchAttendanceReport}>Generate Report</Button>
            </Stack>
          </Paper>
          {attendanceReport && (
            <>
              {attendanceReport.aiAlert && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                  🤖 {attendanceReport.aiAlert}
                </Alert>
              )}
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Employee Attendance Details</Typography>
                {attendanceReport.employeeAttendanceData?.map((emp: EmployeeAttendance, idx: number) => (
                  <Box key={idx} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography fontWeight={600}>{emp.employeeName}</Typography>
                      <Typography variant="body2">{emp.attendancePercentage?.toFixed(1)}%</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={emp.attendancePercentage} sx={{ mb: 1 }} />
                    <Typography variant="caption">
                      ✓ {emp.presentDays} Present | ✗ {emp.absentDays} Absent | 🏥 {emp.leaveDays} Leave
                    </Typography>
                  </Box>
                ))}
              </Paper>
            </>
          )}
        </Box>
      </TabPanel>

      {/* Payroll */}
      <TabPanel value={tabValue} index={6}>
        <Box>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Button variant="contained" onClick={fetchPayrollReport}>Generate Payroll Report</Button>
          </Paper>
          {payrollReport && (
            <>
              {payrollReport.aiAlert && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  ⚠️ {payrollReport.aiAlert}
                </Alert>
              )}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary">Total Payroll</Typography>
                      <Typography variant="h6">₹{payrollReport.totalSalary?.toLocaleString('en-IN')}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary">Pending Payments</Typography>
                      <Typography variant="h6" color={payrollReport.pendingPayments > 0 ? 'error' : 'success'}>
                        {payrollReport.pendingPayments} employees
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </>
          )}
        </Box>
      </TabPanel>
    </Box>
  );
};

export default Reports;
