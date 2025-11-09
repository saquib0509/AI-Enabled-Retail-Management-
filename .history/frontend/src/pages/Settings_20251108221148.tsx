import { useState, FC, useEffect } from 'react';
import {
  Box, Paper, TextField, Button, Stack, Typography, Switch, Alert, Grid, Card, CardContent, Divider, CircularProgress
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import api from '../services/api';

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
    companyName: '',
    ownerName: '',
    businessAddress: '',
    gstNumber: '',
    emailAddress: '',
    dailyEmailEnabled: true,
    emailScheduleTime: '18:00',
    phoneNumber: '',
    supportEmail: ''
  });

  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [sendingReport, setSendingReport] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get<BusinessSettings>('/settings');
      setSettings(res.data);
    } catch (error) {
      console.log('No settings found, creating new...');
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
      const res = await api.post<BusinessSettings>('/settings', settings);
      setSettings(res.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      alert('✓ Settings saved successfully!');
    } catch (error) {
      alert('❌ Error saving settings');
    }
  };

  const handleSendReport = async (type: 'daily-report' | 'stock-alert' | 'attendance') => {
    if (!settings.emailAddress) {
      alert('❌ Email address not configured');
      return;
    }

    setSendingReport(type);
    try {
      const endpoints: { [key: string]: string } = {
        'daily-report': '/settings/send-daily-report-now',
        'stock-alert': '/settings/send-stock-alert-now',
        'attendance': '/settings/send-attendance-now'
      };

      const res = await api.post(endpoints[type], {});
      alert('✓ ' + res.data);
    } catch (error: any) {
      alert('❌ Error: ' + (error.response?.data || 'Failed to send report'));
    } finally {
      setSendingReport(null);
    }
  };

  if (loading) return <Typography>Loading settings...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>⚙️ Business Settings</Typography>

      {saved && (
        <Alert severity="success" sx={{ mb: 2 }}>
          ✓ All changes saved successfully!
        </Alert>
      )}

      {/* Section 1: Company Information */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>🏢 Company Information</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Company Name"
              value={settings.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              placeholder="e.g., ABC Petrol Pump"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Owner Name"
              value={settings.ownerName}
              onChange={(e) => handleInputChange('ownerName', e.target.value)}
              placeholder="e.g., Saquib Akhtar"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Business Address"
              value={settings.businessAddress}
              onChange={(e) => handleInputChange('businessAddress', e.target.value)}
              placeholder="e.g., 123 Main St, Bengaluru, Karnataka"
              multiline
              rows={2}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="GST Number"
              value={settings.gstNumber}
              onChange={(e) => handleInputChange('gstNumber', e.target.value)}
              placeholder="e.g., 18AABCT1234H1Z0"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              value={settings.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Section 2: Email & Notifications */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>📧 Email & Notifications</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email Address (for notifications)"
              type="email"
              value={settings.emailAddress}
              onChange={(e) => handleInputChange('emailAddress', e.target.value)}
              placeholder="saquibakhtar0509@gmail.com"
              variant="outlined"
            />
            <Typography variant="caption" sx={{ color: 'gray', mt: 1, display: 'block' }}>
              All reports and alerts will be sent to this email
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: '500' }}>📋 Enable Daily Email Reports</Typography>
              <Switch
                checked={settings.dailyEmailEnabled}
                onChange={(e) => handleInputChange('dailyEmailEnabled', e.target.checked)}
              />
            </Stack>
            {settings.dailyEmailEnabled && (
              <TextField
                label="Email Schedule Time"
                type="time"
                value={settings.emailScheduleTime}
                onChange={(e) => handleInputChange('emailScheduleTime', e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
                variant="outlined"
              />
            )}
            <Typography variant="caption" sx={{ color: 'gray', display: 'block' }}>
              ℹ️ Turn on to receive daily business reports. Set time (e.g., 6:00 PM for 18:00)
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Support Email"
              type="email"
              value={settings.supportEmail}
              onChange={(e) => handleInputChange('supportEmail', e.target.value)}
              placeholder="support@yourpump.com (optional)"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Section 3: Email Testing & On-Demand Reports */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>🚀 Send Reports On-Demand</Typography>
        <Typography variant="body2" sx={{ color: 'gray', mb: 2 }}>
          Click below to send reports immediately to your email
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              fullWidth
              variant="contained"
              color="success"
              startIcon={sendingReport === 'daily-report' ? <CircularProgress size={20} /> : <SendIcon />}
              onClick={() => handleSendReport('daily-report')}
              disabled={!settings.emailAddress || sendingReport !== null}
            >
              {sendingReport === 'daily-report' ? 'Sending...' : '📊 Daily Report NOW'}
            </Button>
            <Typography variant="caption" sx={{ color: 'gray', mt: 1, display: 'block', textAlign: 'center' }}>
              Revenue, Sales, Attendance
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Button
              fullWidth
              variant="contained"
              color="warning"
              startIcon={sendingReport === 'stock-alert' ? <CircularProgress size={20} /> : <SendIcon />}
              onClick={() => handleSendReport('stock-alert')}
              disabled={!settings.emailAddress || sendingReport !== null}
            >
              {sendingReport === 'stock-alert' ? 'Sending...' : '📦 Stock Alert NOW'}
            </Button>
            <Typography variant="caption" sx={{ color: 'gray', mt: 1, display: 'block', textAlign: 'center' }}>
              Critical & Warning Alerts
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Button
              fullWidth
              variant="contained"
              color="info"
              startIcon={sendingReport === 'attendance' ? <CircularProgress size={20} /> : <SendIcon />}
              onClick={() => handleSendReport('attendance')}
              disabled={!settings.emailAddress || sendingReport !== null}
            >
              {sendingReport === 'attendance' ? 'Sending...' : '👥 Attendance NOW'}
            </Button>
            <Typography variant="caption" sx={{ color: 'gray', mt: 1, display: 'block', textAlign: 'center' }}>
              Today's Attendance
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body2" sx={{ fontWeight: '500', mb: 2 }}>Support</Typography>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<HelpOutlineIcon />}
          onClick={() => window.open('mailto:support@example.com')}
        >
          📞 Contact Support
        </Button>
        <Typography variant="caption" sx={{ color: 'gray', mt: 1, display: 'block' }}>
          Need help? Click to contact our support team
        </Typography>
      </Paper>

      {/* Section 4: Current Settings Summary */}
      <Paper sx={{ p: 2, mb: 3, background: '#f5f5f5', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>📋 Current Settings Summary</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Card sx={{ background: 'white' }}>
              <CardContent>
                <Typography color="textSecondary" variant="body2">Company</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                  {settings.companyName || '❌ Not set'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card sx={{ background: 'white' }}>
              <CardContent>
                <Typography color="textSecondary" variant="body2">Owner</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                  {settings.ownerName || '❌ Not set'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card sx={{ background: 'white' }}>
              <CardContent>
                <Typography color="textSecondary" variant="body2">Email</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 0.5, fontSize: '0.9rem' }}>
                  {settings.emailAddress || '❌ Not set'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card sx={{ background: 'white' }}>
              <CardContent>
                <Typography color="textSecondary" variant="body2">Daily Report Schedule</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                  {settings.dailyEmailEnabled ? `✓ ${settings.emailScheduleTime}` : '✗ Disabled'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Save Button */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          sx={{ flex: 1, py: 1.5, fontSize: '1rem', fontWeight: 'bold' }}
        >
          💾 Save All Settings
        </Button>
      </Stack>
    </Box>
  );
};

export default Settings;
