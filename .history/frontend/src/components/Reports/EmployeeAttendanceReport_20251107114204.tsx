import { useState, FC } from 'react';
import {
  Box, Paper, TextField, Button, Card, CardContent,
  Typography, Alert, Stack, LinearProgress
} from '@mui/material';
import api from '../../services/api';
import { AttendanceReport as AttendanceReportType } from './types';

const EmployeeAttendanceReport: FC = () => {
  const [startDate, setStartDate] = useState<string>('2025-11-01');
  const [endDate, setEndDate] = useState<string>('2025-11-06');
  const [report, setReport] = useState<AttendanceReportType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchReport = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await api.get<AttendanceReportType>(
        `/reports/employee-attendance?startDate=${startDate}&endDate=${endDate}`
      );
      setReport(res.data);
    } catch (error) {
      console.error('Error fetching attendance report:', error);
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
          {report.aiAlert && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              🤖 {report.aiAlert}
            </Alert>
          )}

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Employee Attendance Details</Typography>
            {report.employeeAttendanceData?.map((emp, idx) => (
              <Box key={idx} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography fontWeight={600}>{emp.employeeName}</Typography>
                  <Typography variant="body2">{emp.attendancePercentage?.toFixed(1)}%</Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={emp.attendancePercentage}
                  sx={{ mb: 1 }}
                />
                <Typography variant="caption">
                  ✓ {emp.presentDays} Present | ✗ {emp.absentDays} Absent | 🏥 {emp.leaveDays} Leave
                </Typography>
              </Box>
            ))}
          </Paper>
        </>
      )}
    </Box>
  );
};

export default EmployeeAttendanceReport;
