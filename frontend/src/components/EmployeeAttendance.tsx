import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Stack,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../services/api";

interface Employee {
  id: number;
  name: string;
}

interface Attendance {
  id: number;
  employeeId: number;
  employeeName: string;
  attendanceDate: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: string;
  durationHours: number | null;
  notes: string;
}

interface AttendanceForm {
  id?: number;
  employeeId: number | "";
  attendanceDate: string;
  checkInTime: string;
  checkOutTime: string;
  status: string;
  notes: string;
}

const EmployeeAttendance: React.FC = () => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: number | null }>({
    open: false,
    id: null,
  });
  const [message, setMessage] = useState({ text: "", severity: "success" as "success" | "error" });

  // Get today's date
  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState<AttendanceForm>({
    employeeId: "",
    attendanceDate: today,
    checkInTime: "09:00",
    checkOutTime: "18:00",
    status: "Present",
    notes: "",
  });

  // Filter to today's date only
  const [filters, setFilters] = useState({
    date: today,
  });

  // Load employees and attendance on mount
  useEffect(() => {
    loadEmployees();
    loadAttendanceForToday();
  }, []);

  // Reload when date filter changes
  useEffect(() => {
    loadAttendanceForToday();
  }, [filters.date]);

  const loadEmployees = async () => {
    try {
      const res = await api.get("/employees");
      const activeEmployees = res.data.filter((emp: any) => emp.status === "Active");
      setEmployees(activeEmployees);
    } catch (err) {
      console.error("Failed to load employees", err);
    }
  };

  // Load attendance for TODAY only
  const loadAttendanceForToday = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/attendance/date-range?startDate=${filters.date}&endDate=${filters.date}`
      );
      setAttendances(res.data);
    } catch (err) {
      console.error("Failed to load attendance", err);
      setAttendances([]);
    }
    setLoading(false);
  };

  const handleOpenDialog = () => {
    setForm({
      employeeId: "",
      attendanceDate: today,
      checkInTime: "09:00",
      checkOutTime: "18:00",
      status: "Present",
      notes: "",
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target as any;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.employeeId) {
      setMessage({ text: "Please select an employee", severity: "error" });
      return;
    }

    try {
      const payload = {
        employeeId: form.employeeId,
        attendanceDate: form.attendanceDate,
        checkInTime: form.checkInTime ? form.checkInTime + ":00" : null,
        checkOutTime: form.checkOutTime ? form.checkOutTime + ":00" : null,
        status: form.status,
        notes: form.notes,
      };

      if (form.id) {
        await api.put(`/attendance/${form.id}`, payload);
        setMessage({ text: "Attendance updated successfully!", severity: "success" });
      } else {
        await api.post("/attendance", payload);
        setMessage({ text: "Attendance marked successfully!", severity: "success" });
      }

      setOpenDialog(false);
      loadAttendanceForToday();
    } catch (err) {
      setMessage({ text: "Failed to save attendance", severity: "error" });
    }
  };

  const handleEdit = (attendance: Attendance) => {
    setForm({
      id: attendance.id,
      employeeId: attendance.employeeId,
      attendanceDate: attendance.attendanceDate,
      checkInTime: attendance.checkInTime ? attendance.checkInTime.slice(0, 5) : "",
      checkOutTime: attendance.checkOutTime ? attendance.checkOutTime.slice(0, 5) : "",
      status: attendance.status,
      notes: attendance.notes,
    });
    setOpenDialog(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteConfirm({ open: true, id });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.id) return;
    try {
      await api.delete(`/attendance/${deleteConfirm.id}`);
      setMessage({ text: "Attendance deleted successfully!", severity: "success" });
      loadAttendanceForToday();
    } catch (err) {
      setMessage({ text: "Failed to delete attendance", severity: "error" });
    }
    setDeleteConfirm({ open: false, id: null });
  };

  const getStatusColor = (status: string): any => {
    switch (status) {
      case "Present":
        return "success";
      case "Absent":
        return "error";
      case "Late":
        return "warning";
      case "Leave":
        return "info";
      default:
        return "default";
    }
  };

  // Count stats for today
  const presentCount = attendances.filter((a) => a.status === "Present").length;
  const absentCount = attendances.filter((a) => a.status === "Absent").length;
  const lateCount = attendances.filter((a) => a.status === "Late").length;

  return (
    <Box>
      {message.text && (
        <Alert severity={message.severity} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      {/* Today's Summary */}
      <Paper sx={{ p: 3, mb: 3, backgroundColor: "#f5f5f5" }}>
        <Stack direction="row" spacing={4}>
          <Box>
            <Typography variant="h6" color="primary">
              {presentCount}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Present
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" style={{ color: "#d32f2f" }}>
              {absentCount}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Absent
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" style={{ color: "#f57c00" }}>
              {lateCount}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Late
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" style={{ color: "#0277bd" }}>
              {employees.length}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total Employees
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
          <TextField
            label="Select Date"
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ date: e.target.value })}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenDialog}>
            Mark Attendance
          </Button>
        </Stack>
      </Paper>

      {/* Table */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell><strong>Employee</strong></TableCell>
                <TableCell><strong>Check-in</strong></TableCell>
                <TableCell><strong>Check-out</strong></TableCell>
                <TableCell><strong>Duration (hrs)</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Notes</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendances.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="textSecondary">No attendance records for this date</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                attendances.map((att) => (
                  <TableRow key={att.id} hover>
                    <TableCell>{att.employeeName}</TableCell>
                    <TableCell>{att.checkInTime ? att.checkInTime.slice(0, 5) : "-"}</TableCell>
                    <TableCell>{att.checkOutTime ? att.checkOutTime.slice(0, 5) : "-"}</TableCell>
                    <TableCell>{att.durationHours ? att.durationHours.toFixed(2) : "-"}</TableCell>
                    <TableCell>
                      <Chip label={att.status} color={getStatusColor(att.status)} size="small" />
                    </TableCell>
                    <TableCell>{att.notes}</TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleEdit(att)}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        startIcon={<DeleteIcon />}
                        color="error"
                        onClick={() => handleDeleteClick(att.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Mark Attendance Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{form.id ? "Edit Attendance" : "Mark Attendance"}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <FormControl fullWidth required>
              <InputLabel>Employee</InputLabel>
              <Select
                name="employeeId"
                value={form.employeeId}
                label="Employee"
                onChange={handleFormChange}
              >
                <MenuItem value="">Select Employee</MenuItem>
                {employees.map((emp) => (
                  <MenuItem key={emp.id} value={emp.id}>
                    {emp.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Date"
              type="date"
              name="attendanceDate"
              value={form.attendanceDate}
              onChange={handleFormChange}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Check-in Time"
              type="time"
              name="checkInTime"
              value={form.checkInTime}
              onChange={handleFormChange}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Check-out Time"
              type="time"
              name="checkOutTime"
              value={form.checkOutTime}
              onChange={handleFormChange}
              InputLabelProps={{ shrink: true }}
            />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={form.status}
                label="Status"
                onChange={handleFormChange}
              >
                <MenuItem value="Present">Present</MenuItem>
                <MenuItem value="Absent">Absent</MenuItem>
                <MenuItem value="Late">Late</MenuItem>
                <MenuItem value="Leave">Leave</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Notes"
              name="notes"
              value={form.notes}
              onChange={handleFormChange}
              multiline
              rows={3}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {form.id ? "Update" : "Mark"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirm.open} onClose={() => setDeleteConfirm({ open: false, id: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this attendance record?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm({ open: false, id: null })}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeAttendance;
