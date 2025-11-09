import { useState, FC, useEffect } from 'react';
import {
  Box, Paper, TextField, Button, Stack, Typography, Switch, Alert, Grid, Card, CardContent, Divider
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import api from '../../services/api';

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
  const [testEmailSending, setTestEmailSending] = useState(false);

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

  const handleSendTestEmail = async () => {
    try {
      setTestEmailSending(true);
      const res = await api.post('/settings/send-test-email', {});
      alert('✓ Test email sent! Check your inbox: ' + settings.emailAddress);
    } catch (error) {
      alert('❌ Error sending test email');
    } finally {
      setTestEmailSending(false);
    }
  };

  if (loading) return <Typography>Loading settings...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>⚙️ Business Settings</Typography>

      {saved && (
        <Alert severity="success" sx={{ mb: 2 }}>
          ✓ All changes saved successfully!
        </Alert>
      )}

      {/* Section 1: Company Information */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>🏢 Company Information</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Company Name"
              value={settings.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              placeholder="e.g., ABC Petrol Pump"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Owner Name"
              value={settings.ownerName}
              onChange={(e) => handleInputChange('ownerName', e.target.value)}
              placeholder="e.g., Saquib Akhtar"
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
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="GST Number"
              value={settings.gstNumber}
              onChange={(e) => handleInputChange('gstNumber', e.target.value)}
              placeholder="e.g., 18AABCT1234H1Z0"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              value={settings.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              placeholder="+91 XXXXX XXXXX"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Section 2: Email & Notifications */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>📧 Email & Notifications</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email Address (for notifications)"
              type="email"
              value={settings.emailAddress}
              onChange={(e) => handleInputChange('emailAddress', e.target.value)}
              placeholder="saquibakhtar0509@gmail.com"
            />
            <Typography variant="caption" sx={{ color: 'gray', mt: 1, display: 'block' }}>
              All reports and alerts will be sent to this email
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="body2">📋 Enable Daily Email Reports</Typography>
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
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Section 3: Email Testing & Support */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>🧪 Email Testing & Support</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<SendIcon />}
              onClick={handleSendTestEmail}
              disabled={!settings.emailAddress || testEmailSending}
            >
              {testEmailSending ? '⏳ Sending...' : '📤 Send Test Email'}
            </Button>
            <Typography variant="caption" sx={{ color: 'gray', mt: 1, display: 'block' }}>
              Sends an immediate test email to verify your email address
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
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
          </Grid>
        </Grid>
      </Paper>

      {/* Section 4: Current Settings Display */}
      <Paper sx={{ p: 2, mb: 3, background: '#f5f5f5' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>📋 Current Settings Summary</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" variant="body2">Company</Typography>
                <Typography variant="h6">{settings.companyName || 'Not set'}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" variant="body2">Owner</Typography>
                <Typography variant="h6">{settings.ownerName || 'Not set'}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" variant="body2">Email</Typography>
                <Typography variant="h6">{settings.emailAddress || 'Not set'}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" variant="body2">Daily Report</Typography>
                <Typography variant="h6">
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
          sx={{ flex: 1 }}
        >
          💾 Save All Settings
        </Button>
      </Stack>
    </Box>
  );
};

export default Settings;
