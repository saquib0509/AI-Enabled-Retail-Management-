import { useState, useEffect } from 'react';
import {
  Box, Paper, Table, TableContainer, TableHead, TableRow, TableBody, TableCell,
  Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  Snackbar, Alert, Stack, LinearProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import api from '../services/api';

const Challans = () => {
  const [challans, setChallans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editChallan, setEditChallan] = useState(null);
  const [snack, setSnack] = useState({open:false, msg:'', severity:"success"});

  const fetchChallans = async () => {
    setLoading(true);
    try {
      const res = await api.get('/challans/recent');
      setChallans(res.data);
    } catch {
      setSnack({open:true, msg:'Failed to fetch challans', severity:"error"});
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchChallans();
  }, []);

  // Upload handlers
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

  // Edit handlers
  const openEditDialog = (challan) => {
    setEditChallan(challan);
    setEditDialogOpen(true);
  };
  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setEditChallan(null);
  };
  const handleEditSave = async () => {
    try {
      await api.put(`/challans/${editChallan.id}`, editChallan);
      setSnack({open:true, msg:'Challan updated', severity:"success"});
      closeEditDialog();
      fetchChallans();
    } catch {
      setSnack({open:true, msg:'Failed to update challan', severity:"error"});
    }
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this challan?")) return;
    try {
      await api.delete(`/challans/${id}`);
      setSnack({open:true, msg:'Challan deleted', severity:"success"});
      fetchChallans();
    } catch {
      setSnack({open:true, msg:'Failed to delete challan', severity:"error"});
    }
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
              <TableCell>Actions</TableCell>
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
                <TableCell>
                  <Button size="small" onClick={() => openEditDialog(c)}>Edit</Button>
                  <Button size="small" color="error" onClick={() => handleDelete(c.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
            {loading && (<TableRow><TableCell colSpan={8} align="center">Loading...</TableCell></TableRow>)}
            {!loading && challans.length === 0 && (<TableRow><TableCell colSpan={8} align="center">No challans found</TableCell></TableRow>)}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Upload Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <form onSubmit={handleUpload}>
          <DialogTitle>Upload Challan</DialogTitle>
          <DialogContent sx={{ minWidth: 300 }}>
            {uploading && <LinearProgress sx={{ mb: 2 }} />}
            <Button component="label" variant={file ? 'contained' : 'outlined'} fullWidth disabled={uploading} sx={{ my: 1 }}>
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

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={closeEditDialog}>
        <DialogTitle>Edit Challan</DialogTitle>
        <DialogContent sx={{ minWidth: 300 }}>
          <TextField
            label="Fuel Type"
            value={editChallan?.fuelType || ''}
            onChange={e => setEditChallan({ ...editChallan, fuelType: e.target.value })}
            fullWidth margin="normal"
          />
          <TextField
            label="Quantity(Lts)"
            type="number"
            value={editChallan?.quantity || ''}
            onChange={e => setEditChallan({ ...editChallan, quantity: parseFloat(e.target.value) })}
            fullWidth margin="normal"
          />
          <TextField
            label="Price per KL"
            type="number"
            value={editChallan?.pricePerLiter || ''}
            onChange={e => setEditChallan({ ...editChallan, pricePerLiter: parseFloat(e.target.value) })}
            fullWidth margin="normal"
          />
          <TextField
            label="Total Amount"
            type="number"
            value={editChallan?.totalAmount || ''}
            onChange={e => setEditChallan({ ...editChallan, totalAmount: parseFloat(e.target.value) })}
            fullWidth margin="normal"
          />
          <TextField
            label="Vendor Name"
            value={editChallan?.vendorName || ''}
            onChange={e => setEditChallan({ ...editChallan, vendorName: e.target.value })}
            fullWidth margin="normal"
          />
          <TextField
            label="Challan Number"
            value={editChallan?.challanNumber || ''}
            onChange={e => setEditChallan({ ...editChallan, challanNumber: e.target.value })}
            fullWidth margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave}>Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity={snack.severity} variant='filled' sx={{ width: '100%' }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Challans;
