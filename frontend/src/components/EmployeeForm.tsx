import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
  Paper,
  InputLabel,
  FormControl,
  Alert,
} from "@mui/material";
import api from "../services/api";

interface EmployeeFormData {
  name: string;
  phone: string;
  email: string;
  role: string;
  status: string;
}

interface EmployeeFormProps {
  editingId?: number | null;
  onSuccess?: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ editingId, onSuccess }) => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: "",
    phone: "",
    email: "",
    role: "Attendant",
    status: "Active",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingId) {
      loadEmployeeData(editingId);
    }
  }, [editingId]);

  const loadEmployeeData = (id: number) => {
    api
      .get(`/employees/${id}`)
      .then((res) => {
        setFormData({
          name: res.data.name,
          phone: res.data.phone,
          email: res.data.email,
          role: res.data.role,
          status: res.data.status,
        });
      })
      .catch((err) => console.error("Failed to load employee data", err));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.email.includes("@"))
      newErrors.email = "Invalid email format";
    if (!formData.role) newErrors.role = "Role is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    if (!name) return;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    if (editingId) {
      // Update employee
      api
        .put(`/employees/${editingId}`, formData)
        .then(() => {
          setSuccessMessage("Employee updated successfully!");
          setFormData({
            name: "",
            phone: "",
            email: "",
            role: "Attendant",
            status: "Active",
          });
          setTimeout(() => {
            onSuccess?.();
          }, 1500);
        })
        .catch((err) => {
          setErrors({
            submit:
              err.response?.data?.error ||
              err.message ||
              "Failed to update employee",
          });
        })
        .finally(() => setLoading(false));
    } else {
      // Create new employee
      api
        .post("/employees", formData)
        .then(() => {
          setSuccessMessage("Employee created successfully!");
          setFormData({
            name: "",
            phone: "",
            email: "",
            role: "Attendant",
            status: "Active",
          });
          setTimeout(() => {
            onSuccess?.();
          }, 1500);
        })
        .catch((err) => {
          setErrors({
            submit:
              err.response?.data?.error ||
              err.message ||
              "Failed to create employee",
          });
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        maxWidth: 800,
        mx: "auto",
        mt: 3,
        borderRadius: 3,
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(145deg, #1e1e1e, #2c2c2c)"
            : "linear-gradient(145deg, #fafafa, #ffffff)",
      }}
    >
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        sx={{ fontWeight: 700, color: "primary.main" }}
      >
        {editingId ? "Edit Employee" : "Add New Employee"}
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      {errors.submit && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.submit}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              required
              fullWidth
              placeholder="Enter employee name"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
              required
              fullWidth
              placeholder="Enter phone number"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              required
              fullWidth
              placeholder="Enter email address"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors.role}>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formData.role}
                label="Role"
                onChange={handleChange}
              >
                <MenuItem value="">Select Role</MenuItem>
                <MenuItem value="Attendant">Attendant</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
                <MenuItem value="Cashier">Cashier</MenuItem>
                <MenuItem value="Supervisor">Supervisor</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                label="Status"
                onChange={handleChange}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{
                mt: 2,
                py: 1.2,
                fontWeight: 600,
                borderRadius: 2,
                letterSpacing: 0.5,
                textTransform: "none",
                boxShadow: 3,
                width: "100%",
              }}
            >
              {loading
                ? editingId
                  ? "Updating..."
                  : "Creating..."
                : editingId
                ? "Update Employee"
                : "Create Employee"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default EmployeeForm;
