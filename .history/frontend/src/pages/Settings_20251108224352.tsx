import { useState, FC, useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Stack,
  Typography,
  Switch,
  Alert,
  Grid,
  CircularProgress,
  Divider,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import api from "../services/api";

interface BusinessSettings {
  id?: number;
  companyName: string;
  ownerName: string;
  businessAddress: string;
  gstNumber: string;
  emailAddress: string;
  dailyEmailEnabled: boolean;
  emailScheduleTime: string;
  phoneNumber?: string;
  supportEmail?: string;
}

const Settings: FC = () => {
  const [settings, setSettings] = useState<BusinessSettings>({
    companyName: "",
    ownerName: "",
    businessAddress: "",
    gstNumber: "",
    emailAddress: "",
    dailyEmailEnabled: true,
    emailScheduleTime: "18:00",
    phoneNumber: "",
    supportEmail: "",
  });

  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [sendingReport, setSendingReport] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get<BusinessSettings>("/settings");
      setSettings(res.data);
    } catch {
      console.log("No settings found, creating new...");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setSettings({ ...settings, [field]: value });
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      const res = await api.post<BusinessSettings>("/settings", settings);
      setSettings(res.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Error saving settings");
    }
  };

  const handleSendReport = async (
    type: "daily-report" | "stock-alert" | "attendance"
  ) => {
    if (!settings.emailAddress) {
      alert("Email address not configured");
      return;
    }
    setSendingReport(type);
    try {
      const endpoints: Record<string, string> = {
        "daily-report": "/settings/send-daily-report-now",
        "stock-alert": "/settings/send-stock-alert-now",
        attendance: "/settings/send-attendance-now",
      };
      const res = await api.post(endpoints[type], {});
      alert(res.data);
    } catch (error: any) {
      alert("Error: " + (error.response?.data || "Failed to send report"));
    } finally {
      setSendingReport(null);
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ p: 4, background: "#f8f9fb", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: "bold",
          color: "#1a237e",
          textAlign: "center",
        }}
      >
        Business Settings
      </Typography>

      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings updated successfully
        </Alert>
      )}

      {/* Company Information */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Company Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Company Name"
              value={settings.companyName}
              onChange={(e) =>
                handleInputChange("companyName", e.target.value)
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Owner Name"
              value={settings.ownerName}
              onChange={(e) => handleInputChange("ownerName", e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Business Address"
              multiline
              rows={2}
              value={settings.businessAddress}
              onChange={(e) =>
                handleInputChange("businessAddress", e.target.value)
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="GST Number"
              value={settings.gstNumber}
              onChange={(e) => handleInputChange("gstNumber", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              value={settings.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Email & Notifications */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Email & Notifications
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Notification Email"
              type="email"
              value={settings.emailAddress}
              onChange={(e) => handleInputChange("emailAddress", e.target.value)}
            />
            <Typography variant="caption" sx={{ color: "gray" }}>
              Reports and alerts will be sent here
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Support Email"
              type="email"
              value={settings.supportEmail}
              onChange={(e) => handleInputChange("supportEmail", e.target.value)}
              placeholder="support@yourpump.com"
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            

            {settings.dailyEmailEnabled && (
              <TextField
                label="Daily Report Time"
                type="time"
                value={settings.emailScheduleTime}
                onChange={(e) =>
                  handleInputChange("emailScheduleTime", e.target.value)
                }
                InputLabelProps={{ shrink: true }}
                sx={{ width: 200 }}
              />
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Send Reports */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Send Reports On-Demand
        </Typography>
        <Typography variant="body2" sx={{ color: "gray", mb: 2 }}>
          Instantly send reports to your registered email
        </Typography>

        <Grid container spacing={2}>
          {[
            {
              label: "Send Daily Report",
              color: "success",
              type: "daily-report",
            },
            { label: "Send Stock Alert", color: "warning", type: "stock-alert" },
            { label: "Send Attendance", color: "info", type: "attendance" },
          ].map((btn) => (
            <Grid item xs={12} sm={6} md={4} key={btn.type}>
              <Button
                fullWidth
                variant="contained"
                color={btn.color as any}
                startIcon={
                  sendingReport === btn.type ? (
                    <CircularProgress size={20} />
                  ) : (
                    <SendIcon />
                  )
                }
                onClick={() =>
                  handleSendReport(
                    btn.type as "daily-report" | "stock-alert" | "attendance"
                  )
                }
                disabled={!settings.emailAddress || !!sendingReport}
                sx={{ py: 1.5, fontWeight: 600 }}
              >
                {sendingReport === btn.type ? "Sending..." : btn.label}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Save */}
      <Stack direction="row" justifyContent="center">
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          sx={{
            px: 5,
            py: 1.5,
            fontSize: "1.05rem",
            fontWeight: "bold",
            borderRadius: 3,
          }}
        >
          Save All Settings
        </Button>
      </Stack>
    </Box>
  );
};

export default Settings;
