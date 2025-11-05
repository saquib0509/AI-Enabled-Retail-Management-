import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Chip,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import api from "../services/api";

interface Employee {
  id: number;
  name: string;
  phone: string;
  email: string;
  role: string;
  status: string;
  hireDate: string;
  createdAt: string;
}

interface EmployeeListProps {
  refresh?: boolean;
  onEdit?: (employee: Employee) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ refresh, onEdit }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadEmployees();
  }, [refresh]);

  useEffect(() => {
    applyFilters();
  }, [employees, roleFilter, statusFilter, searchTerm]);

  const loadEmployees = () => {
    setLoading(true);
    setError("");
    api
      .get("/employees")
      .then((res) => {
        setEmployees(res.data);
      })
      .catch((err) => {
        setError("Failed to load employees");
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  const applyFilters = () => {
    let filtered = employees;

    if (roleFilter) {
      filtered = filtered.filter(
        (emp) => emp.role.toLowerCase() === roleFilter.toLowerCase()
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(
        (emp) => emp.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (emp) =>
          emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.phone.includes(searchTerm) ||
          emp.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEmployees(filtered);
  };

  const handleDelete = (employee: Employee) => {
    setDeleteConfirm({ id: employee.id, name: employee.name });
  };

  const confirmDelete = () => {
    if (!deleteConfirm) return;

    api
      .delete(`/employees/${deleteConfirm.id}`)
      .then(() => {
        loadEmployees();
        setDeleteConfirm(null);
      })
      .catch((err) => {
        console.error("Failed to delete employee", err);
        alert("Failed to delete employee");
      });
  };

  const clearFilters = () => {
    setRoleFilter("");
    setStatusFilter("");
    setSearchTerm("");
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, "default" | "primary" | "secondary" | "error" | "warning" | "info" | "success"> = {
      Attendant: "default",
      Manager: "primary",
      Cashier: "secondary",
      Supervisor: "warning",
    };
    return colors[role] || "default";
  };

  const getStatusColor = (status: string) => {
    return status === "Active" ? "success" : "error";
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, color: "primary.main", mb: 3 }}
      >
        Employee List
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Box sx={{ mb: 3, p: 2, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
  <Grid container spacing={2} alignItems="flex-end">
    <Grid item xs={12} sm={6} md={4}>
      <TextField
        label="Search"
        placeholder="Name, phone, email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        size="small"
      />
    </Grid>

    <Grid item xs={12} sm={6} md={4}>
      <FormControl fullWidth size="small" sx={{ minWidth: 160 }}>
        <InputLabel>Role</InputLabel>
        <Select
          value={roleFilter}
          label="Role"
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <MenuItem value="">All Roles</MenuItem>
          <MenuItem value="Attendant">Attendant</MenuItem>
          <MenuItem value="Manager">Manager</MenuItem>
          <MenuItem value="Cashier">Cashier</MenuItem>
          <MenuItem value="Supervisor">Supervisor</MenuItem>
        </Select>
      </FormControl>
    </Grid>

    <Grid item xs={12} sm={6} md={4}>
      <FormControl fullWidth size="small" sx={{ minWidth: 160 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={statusFilter}
          label="Status"
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <MenuItem value="">All Status</MenuItem>
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
        </Select>
      </FormControl>
    </Grid>

    <Grid item xs={12} sm={6} md={4}>
      <Button
        variant="outlined"
        fullWidth
        onClick={clearFilters}
        sx={{ textTransform: "none", height: "40px" }}
      >
        Clear Filters
      </Button>
    </Grid>
  </Grid>
</Box>


      {/* Results Count */}
      <Typography variant="body2" sx={{ mb: 2, color: "textSecondary" }}>
        Showing <strong>{filteredEmployees.length}</strong> of{" "}
        <strong>{employees.length}</strong> employees
      </Typography>

      {/* Table */}
      {filteredEmployees.length > 0 ? (
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.map((emp) => (
                <TableRow
                  key={emp.id}
                  hover
                  sx={{ "&:hover": { backgroundColor: "#fafafa" } }}
                >
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>{emp.phone}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={emp.role}
                      color={getRoleColor(emp.role)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={emp.status}
                      color={getStatusColor(emp.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => onEdit?.(emp)}
                      sx={{ mr: 1, textTransform: "none" }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      startIcon={<DeleteIcon />}
                      color="error"
                      onClick={() => handleDelete(emp)}
                      sx={{ textTransform: "none" }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box textAlign="center" py={5}>
          <Typography color="textSecondary">
            No employees found. {employees.length === 0 && "Add a new employee to get started."}
          </Typography>
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Delete Employee</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete employee "{deleteConfirm?.name}"?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default EmployeeList;
