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
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PaymentIcon from "@mui/icons-material/Payment";
import ReceiptIcon from "@mui/icons-material/Receipt";
import GenerateIcon from "@mui/icons-material/AutoAwesome";
import api from "../services/api";

interface Employee {
  id: number;
  name: string;
}

interface SalaryRecord {
  id: number;
  employeeId: number;
  employeeName: string;
  salaryMonth: string;
  baseSalary: number;
  totalAllowances: number;
  totalDeductions: number;
  netSalary: number;
  status: string;
  paidDate: string | null;
  paymentMethod: string;
  notes: string;
}

const EmployeeSalary: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [salaryRecords, setSalaryRecords] = useState<SalaryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const [openStructureDialog, setOpenStructureDialog] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [generatingEmployeeId, setGeneratingEmployeeId] = useState<number | null>(null);

  const [message, setMessage] = useState({ text: "", severity: "success" as "success" | "error" });

  const [structureForm, setStructureForm] = useState({
    employeeId: "" as any,
    baseSalary: 0,
    hra: 0,
    dearnessAllowance: 0,
    otherAllowances: 0,
    pfDeduction: 0,
    taxDeduction: 0,
    otherDeductions: 0,
  });

  const [paymentForm, setPaymentForm] = useState({
    salaryRecordId: 0,
    paymentMethod: "Cash",
  });

  useEffect(() => {
    loadEmployees();
    loadSalaryRecords();
  }, [selectedMonth]);

  const loadEmployees = async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data.filter((emp: any) => emp.status === "Active"));
    } catch (err) {
      console.error("Failed to load employees", err);
    }
  };

  const loadSalaryRecords = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/salary/month/${selectedMonth}`);
      setSalaryRecords(res.data || []);
    } catch (err) {
      console.error("Failed to load salary records", err);
      setSalaryRecords([]);
    }
    setLoading(false);
  };

  const handleSaveStructure = async () => {
    if (!structureForm.employeeId || structureForm.baseSalary <= 0) {
      setMessage({ text: "Please fill all required fields", severity: "error" });
      return;
    }

    try {
      await api.post("/salary/structure", structureForm);
      setMessage({ text: "Salary structure saved!", severity: "success" });
      setOpenStructureDialog(false);
      setStructureForm({
        employeeId: "",
        baseSalary: 0,
        hra: 0,
        dearnessAllowance: 0,
        otherAllowances: 0,
        pfDeduction: 0,
        taxDeduction: 0,
        otherDeductions: 0,
      });
      loadEmployees();
    } catch (err) {
      setMessage({ text: "Failed to save salary structure", severity: "error" });
    }
  };

  // NEW: Generate salary for employee
  const handleGenerateSalary = async (employeeId: number) => {
    setGeneratingEmployeeId(employeeId);
    try {
      await api.post(`/salary/generate/${employeeId}/${selectedMonth}`);
      setMessage({ text: "Salary generated successfully!", severity: "success" });
      loadSalaryRecords();
    } catch (err) {
      setMessage({ text: "Failed to generate salary. Setup salary structure first!", severity: "error" });
    } finally {
      setGeneratingEmployeeId(null);
    }
  };

  const handleMarkPaid = async () => {
    try {
      await api.put(`/salary/${paymentForm.salaryRecordId}/mark-paid?paymentMethod=${paymentForm.paymentMethod}`);
      setMessage({ text: "Salary marked as paid!", severity: "success" });
      setOpenPaymentDialog(false);
      loadSalaryRecords();
    } catch (err) {
      setMessage({ text: "Failed to mark as paid", severity: "error" });
    }
  };

  // Check which employees already have salary records this month
  const employeesWithRecords = salaryRecords.map(r => r.employeeId);

  const totalPayroll = salaryRecords.reduce((sum, r) => sum + (r.netSalary || 0), 0);
  const paidCount = salaryRecords.filter((r) => r.status === "Paid").length;
  const pendingCount = salaryRecords.filter((r) => r.status === "Pending").length;

  return (
    <Box>
      {message.text && (
        <Alert severity={message.severity} sx={{ mb: 2 }} onClose={() => setMessage({ text: "", severity: "success" })}>
          {message.text}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Payroll</Typography>
              <Typography variant="h4">₹{totalPayroll.toFixed(0)}</Typography>
              <Typography variant="body2" color="textSecondary">
                {selectedMonth}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Paid</Typography>
              <Typography variant="h4" style={{ color: "#4caf50" }}>
                {paidCount}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Salaries
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Pending</Typography>
              <Typography variant="h4" style={{ color: "#ff9800" }}>
                {pendingCount}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Salaries
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Employees</Typography>
              <Typography variant="h4">{employees.length}</Typography>
              <Typography variant="body2" color="textSecondary">
                Active
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters & Actions */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" justifyContent="space-between">
          <TextField
            label="Select Month"
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenStructureDialog(true)}
            >
              Setup Salary Structure
            </Button>
            <Button variant="contained" color="success" onClick={loadSalaryRecords}>
              Refresh
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Quick Generate Section */}
      {salaryRecords.length < employees.length && (
        <Paper sx={{ p: 2, mb: 2, backgroundColor: "#e3f2fd" }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Generate salary for remaining employees:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {employees
              .filter(emp => !employeesWithRecords.includes(emp.id))
              .map(emp => (
                <Button
                  key={emp.id}
                  size="small"
                  variant="outlined"
                  startIcon={
                    generatingEmployeeId === emp.id ? <CircularProgress size={16} /> : <GenerateIcon />
                  }
                  onClick={() => handleGenerateSalary(emp.id)}
                  disabled={generatingEmployeeId === emp.id}
                >
                  {emp.name}
                </Button>
              ))}
          </Stack>
        </Paper>
      )}

      {/* Salary Records Table */}
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
                <TableCell align="right"><strong>Base</strong></TableCell>
                <TableCell align="right"><strong>Allowances</strong></TableCell>
                <TableCell align="right"><strong>Deductions</strong></TableCell>
                <TableCell align="right"><strong>Net Salary</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salaryRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="textSecondary">
                      No salary records for this month. Click buttons above to generate.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                salaryRecords.map((record) => (
                  <TableRow key={record.id} hover>
                    <TableCell>{record.employeeName}</TableCell>
                    <TableCell align="right">₹{record.baseSalary.toFixed(0)}</TableCell>
                    <TableCell align="right">₹{record.totalAllowances.toFixed(0)}</TableCell>
                    <TableCell align="right">₹{record.totalDeductions.toFixed(0)}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      ₹{record.netSalary.toFixed(0)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={record.status}
                        color={record.status === "Paid" ? "success" : "warning"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      {record.status === "Pending" && (
                        <Button
                          size="small"
                          startIcon={<PaymentIcon />}
                          onClick={() => {
                            setPaymentForm({
                              salaryRecordId: record.id,
                              paymentMethod: "Cash",
                            });
                            setOpenPaymentDialog(true);
                          }}
                        >
                          Mark Paid
                        </Button>
                      )}
                      <Button
                        size="small"
                        startIcon={<ReceiptIcon />}
                        sx={{ ml: 1 }}
                      >
                        Slip
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Setup Salary Structure Dialog */}
      <Dialog open={openStructureDialog} onClose={() => setOpenStructureDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Setup Salary Structure</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <FormControl fullWidth required>
              <InputLabel>Employee</InputLabel>
              <Select
                value={structureForm.employeeId}
                label="Employee"
                onChange={(e) =>
                  setStructureForm({ ...structureForm, employeeId: e.target.value })
                }
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
              label="Base Salary"
              type="number"
              value={structureForm.baseSalary}
              onChange={(e) =>
                setStructureForm({
                  ...structureForm,
                  baseSalary: Number(e.target.value),
                })
              }
            />

            <TextField
              label="HRA"
              type="number"
              value={structureForm.hra}
              onChange={(e) =>
                setStructureForm({ ...structureForm, hra: Number(e.target.value) })
              }
            />

            <TextField
              label="Dearness Allowance"
              type="number"
              value={structureForm.dearnessAllowance}
              onChange={(e) =>
                setStructureForm({
                  ...structureForm,
                  dearnessAllowance: Number(e.target.value),
                })
              }
            />

            <TextField
              label="Other Allowances"
              type="number"
              value={structureForm.otherAllowances}
              onChange={(e) =>
                setStructureForm({
                  ...structureForm,
                  otherAllowances: Number(e.target.value),
                })
              }
            />

            <TextField
              label="PF Deduction"
              type="number"
              value={structureForm.pfDeduction}
              onChange={(e) =>
                setStructureForm({
                  ...structureForm,
                  pfDeduction: Number(e.target.value),
                })
              }
            />

            <TextField
              label="Tax Deduction"
              type="number"
              value={structureForm.taxDeduction}
              onChange={(e) =>
                setStructureForm({
                  ...structureForm,
                  taxDeduction: Number(e.target.value),
                })
              }
            />

            <TextField
              label="Other Deductions"
              type="number"
              value={structureForm.otherDeductions}
              onChange={(e) =>
                setStructureForm({
                  ...structureForm,
                  otherDeductions: Number(e.target.value),
                })
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStructureDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveStructure} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mark Paid Dialog */}
      <Dialog open={openPaymentDialog} onClose={() => setOpenPaymentDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Mark Salary as Paid</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={paymentForm.paymentMethod}
              label="Payment Method"
              onChange={(e) =>
                setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })
              }
            >
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
              <MenuItem value="Check">Check</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPaymentDialog(false)}>Cancel</Button>
          <Button onClick={handleMarkPaid} variant="contained" color="success">
            Mark Paid
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeSalary;
