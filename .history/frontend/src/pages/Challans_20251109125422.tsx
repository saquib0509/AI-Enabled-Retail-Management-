import { useState, useEffect } from 'react';
import {
  Box, Paper, Table, TableContainer, TableHead, TableRow, TableBody, TableCell,
  Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Snackbar, Alert, Stack, LinearProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import api from '../services/api';

const Challans = () => {
  const [challans, setChallans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [snack, setSnack] = useState({open:false, msg:'', severity:"success"});

  const fetchChallans = async () => {
    setLoading(true);
    try {
      const res = await api.get('/challans/recent');  // fetch last 7 challans
      setChallans(res.data);
    } catch {
      setSnack({open:true, msg:'Failed to fetch challans', severity:"error"});
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchChallans();
  }, []);

  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => { setDialogOpen(false); setFile(null); };
  const handleFileChange = e => setFile(e.target.files[0]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await api.post('/challans/upload-extract-ai', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
      setSnack({open:true, msg:'Challan uploaded & saved', severity:"success"});
      handleDialogClose();
      fetchChallans();
    } catch {
      setSnack({open:true, msg:'Failed to upload challan', severity:"error"});
    }
    setUploading(false);
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800} color="primary.main">Challans</Typography>
        <Button startIcon={<CloudUploadIcon />} variant="contained" onClick={handleDialogOpen}>Upload Challan</Button>
      </Stack>
      <TableContainer component={Paper} elevation={2}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Fuel Type</TableCell>
              <TableCell>Quantity (Liters)</TableCell>
              <TableCell>Price Per Liter (₹)</TableCell>
              <TableCell>Total Amount (₹)</TableCell>
              <TableCell>Vendor Name</TableCell>
              <TableCell>Challan Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {challans.map(c => (
              <TableRow key={c.id}>
                <TableCell>{new Date(c.date).toLocaleDateString()}</TableCell>
                <TableCell>{c.fuelType}</TableCell>
                <TableCell>{c.quantity}</TableCell>
                <TableCell>{c.pricePerLiter}</TableCell>
                <TableCell>{c.totalAmount}</TableCell>
                <TableCell>{c.vendorName}</TableCell>
                <TableCell>{c.challanNumber}</TableCell>
              </TableRow>
            ))}
            {loading && (
              <TableRow><TableCell colSpan={7} align="center">Loading...</TableCell></TableRow>
            )}
            {!loading && challans.length === 0 && (
              <TableRow><TableCell colSpan={7} align="center">No challans found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Upload Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <form onSubmit={handleUpload}>
          <DialogTitle>Upload Challan</DialogTitle>
          <DialogContent sx={{minWidth:300}}>
            {uploading && <LinearProgress sx={{mb:2}} />}
            <Button component="label" variant={file ? 'contained' : 'outlined'} fullWidth disabled={uploading} sx={{ my:1 }}>
              {file ? file.name : 'Choose File'}
              <input type="file" accept="application/pdf,image/*" onChange={handleFileChange} hidden disabled={uploading} />
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={!file || uploading}>Upload</Button>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({...s,open:false}))} anchorOrigin={{ vertical:'top', horizontal:'center' }}>
        <Alert severity={snack.severity} variant='filled' sx={{ width: '100%' }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Challans;
