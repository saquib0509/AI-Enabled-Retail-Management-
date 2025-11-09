import { useState, FC, useEffect } from 'react';
import {
  Box, Paper, TextField, Button, Card, CardContent,
  Grid, Typography, Alert, Stack, LinearProgress, Chip
} from '@mui/material';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import WarningIcon from '@mui/icons-material/Warning';
import api from '../../services/api';

interface EmployeeAttendanceData {
  employeeId: number;
  employeeName: string;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  totalDays: number;
  attendancePercentage: number;
}

interface AttendanceReportType {
  employeeAttendanceData: EmployeeAttendanceData[];
  overallAttendance: number;
  totalEmployees: number;
  highAttendanceCount: number;
  lowAttendanceCount: number;
  statusDistribution: any[];
  aiInsights: {
    bestAttendee: string;
    bestAttendeePercentage: number;
    worstAttendee: string;
    worstAttendeePercentage: number;
    attendanceHealth: string;
    lowAttendanceEmployees: string[];
    absenteeismAlert: string;
    summary: string;
  };
}

const COLORS = ['#4CAF50', '#FF6B6B', '#FFC107'];

const EmployeeAttendanceReport: FC = () => {
  const [startDate, setStartDate] = useState<string>('2025-11-01');
  const [endDate, setEndDate] = useState<string>('2025-11-07');
  const [report, setReport] = useState<AttendanceReportType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await api.get<AttendanceReportType>(
        `/reports/employee-attendance?startDate=${startDate}&endDate=${endDate}`
      );
      setReport(res.data);
    } catch (error) {
      console.error('Error fetching attendance report:', error);
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
            {loading ? 'Loading...' : 'Generate Attendance Report'}
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
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <AutoAwesomeIcon fontSize="large" />
              <Typography variant="h5" fontWeight="bold">
                AI Attendance Intelligence
              </Typography>
            </Stack>

            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
              {report.aiInsights.summary}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption">Best Attendee</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {report.aiInsights.bestAttendee}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TrendingUpIcon fontSize="small" />
                    <Typography variant="body2">
                      {report.aiInsights.bestAttendeePercentage?.toFixed(1)}%
                    </Typography>
                  </Stack>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption">Worst Attendee</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {report.aiInsights.worstAttendee}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TrendingDownIcon fontSize="small" />
                    <Typography variant="body2">
                      {report.aiInsights.worstAttendeePercentage?.toFixed(1)}%
                    </Typography>
                  </Stack>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption">Attendance Health</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {report.aiInsights.attendanceHealth}
                  </Typography>
                  <Typography variant="body2">
                    Team overall: {report.overallAttendance?.toFixed(1)}%
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption">At Risk Employees</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {report.lowAttendanceCount}
                  </Typography>
                  <Typography variant="body2">
                    Below 80% attendance
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Absenteeism Alert */}
            <Alert severity="warning" sx={{ mt: 2, bgcolor: 'rgba(255,255,255,0.9)' }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <WarningIcon />
                <Typography variant="body2">{report.aiInsights.absenteeismAlert}</Typography>
              </Stack>
            </Alert>
          </Paper>

          {/* Summary Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="body2">Total Employees</Typography>
                  <Typography variant="h6">{report.totalEmployees}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="body2">Overall Attendance</Typography>
                  <Typography variant="h6">{report.overallAttendance?.toFixed(1)}%</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="body2">High Attendance</Typography>
                  <Typography variant="h6">{report.highAttendanceCount} (≥90%)</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="body2">Low Attendance</Typography>
                  <Typography variant="h6">{report.lowAttendanceCount} (&lt;80%)</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Pie Chart - Status Distribution */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Attendance Status Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={report.statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, percentage }) => `${status}: ${percentage?.toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {report.statusDistribution.map((_, idx) => (
                    <Cell key={`slice-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} days`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>

          {/* Bar Chart - Employee Attendance */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Employee Attendance Breakdown
            </Typography>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={report.employeeAttendanceData.map((e) => ({
                  name: e.employeeName,
                  present: e.presentDays,
                  absent: e.absentDays,
                  leave: e.leaveDays,
                  percentage: e.attendancePercentage
                }))}
                margin={{ bottom: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={150}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" fill="#4CAF50" name="Present" />
                <Bar dataKey="absent" fill="#FF6B6B" name="Absent" />
                <Bar dataKey="leave" fill="#FFC107" name="Leave" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>

          {/* Employee Details Table */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Detailed Employee Attendance
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#f5f5f5' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Employee Name</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Present</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Absent</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Leave</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Total Days</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Attendance %</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {report.employeeAttendanceData.map((emp, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px' }}>
                        <strong>{emp.employeeName}</strong>
                      </td>
                      <td style={{ padding: '10px' }}>{emp.presentDays}</td>
                      <td style={{ padding: '10px' }}>{emp.absentDays}</td>
                      <td style={{ padding: '10px' }}>{emp.leaveDays}</td>
                      <td style={{ padding: '10px' }}>{emp.totalDays}</td>
                      <td style={{ padding: '10px' }}>
                        <Stack spacing={0.5}>
                          <Typography variant="body2" fontWeight="bold">
                            {emp.attendancePercentage?.toFixed(1)}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={emp.attendancePercentage}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: '#e0e0e0',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                                backgroundColor:
                                  emp.attendancePercentage >= 90
                                    ? '#4CAF50'
                                    : emp.attendancePercentage >= 80
                                    ? '#FFC107'
                                    : '#FF6B6B'
                              }
                            }}
                          />
                        </Stack>
                      </td>
                      <td style={{ padding: '10px' }}>
                        {emp.attendancePercentage >= 90 ? (
                          <Chip label="Excellent" size="small" color="success" />
                        ) : emp.attendancePercentage >= 80 ? (
                          <Chip label="Good" size="small" color="warning" />
                        ) : (
                          <Chip label="At Risk" size="small" color="error" />
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

export default EmployeeAttendanceReport;
