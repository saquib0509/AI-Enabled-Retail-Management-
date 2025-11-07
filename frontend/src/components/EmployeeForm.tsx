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
  Divider,
  Stack,
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
    if (!formData.email.includes("@")) newErrors.email = "Invalid email format";
    if (!formData.role) newErrors.role = "Role is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    if (!name) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      role: "Attendant",
      status: "Active",
    });
    setSuccessMessage("");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateForm()) return;
    setLoading(true);

    const request = editingId
      ? api.put(`/employees/${editingId}`, formData)
      : api.post("/employees", formData);

    request
      .then(() => {
        setSuccessMessage(
          editingId
            ? "Employee updated successfully!"
            : "Employee created successfully!"
        );
        setFormData({
          name: "",
          phone: "",
          email: "",
          role: "Attendant",
          status: "Active",
        });
        setTimeout(() => onSuccess?.(), 1500);
      })
      .catch((err) =>
        setErrors({
          submit:
            err.response?.data?.error ||
            err.message ||
            "Failed to save employee",
        })
      )
      .finally(() => setLoading(false));
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        maxWidth: "100%",
        mx: "auto",
        mt: 3,
        borderRadius: 3,
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(145deg, #1e1e1e, #2c2c2c)"
            : "linear-gradient(145deg, #fafafa, #ffffff)",
        boxShadow: "0px 3px 10px rgba(0,0,0,0.08)",
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

      <Divider sx={{ my: 2 }} />

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

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        {/* ✅ Expanded Single Row Layout */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={2.4}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              required
              fullWidth
              placeholder="Enter name"
            />
          </Grid>

          <Grid item xs={12} md={2.4}>
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
              placeholder="Phone number"
            />
          </Grid>

          <Grid item xs={12} md={2.4}>
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
              placeholder="Email address"
            />
          </Grid>

          <Grid item xs={12} md={2.4}>
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

          <Grid item xs={12} md={2.4}>
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
        </Grid>

        {/* ✅ Row 2 - Buttons */}
        <Box textAlign="center" mt={4}>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{
                py: 1.2,
                px: 6,
                fontWeight: 600,
                borderRadius: 2,
                textTransform: "none",
                boxShadow: 3,
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

            {editingId && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCancelEdit}
                sx={{
                  py: 1.2,
                  px: 5,
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: "none",
                }}
              >
                Cancel Edit
              </Button>
            )}
          </Stack>
        </Box>
      </Box>
    </Paper>
  );
};

export default EmployeeForm;
