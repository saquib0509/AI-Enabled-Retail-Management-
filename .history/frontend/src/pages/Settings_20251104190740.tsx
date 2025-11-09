import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";

const Settings: React.FC = () => {
  const [form, setForm] = useState({
    appName: "PetrolPump AI",
    adminEmail: "admin@example.com",
    notificationsEnabled: true,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add actual save logic via API or localStorage
    setSnackbar({ open: true, message: "Settings saved!", severity: "success" });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Application Settings
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Application Name"
              name="appName"
              value={form.appName}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Admin Email"
              name="adminEmail"
              type="email"
              value={form.adminEmail}
              onChange={handleChange}
              fullWidth
            />
            {/* Add more settings as needed */}
            <Button variant="contained" type="submit">
              Save Settings
            </Button>
          </Stack>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Settings;
