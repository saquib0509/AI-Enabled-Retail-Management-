import { useState, useEffect } from 'react';
import {
  Paper, Table, TableHead, TableBody, TableCell, TableRow, TableContainer,
  Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Snackbar, Alert, Stack, Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [snack, setSnack] = useState({open:false, msg:'', severity:"success"});
  const [form, setForm] = useState({ id: null, name: '', unit: '' });
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (e) {
      setProducts([]);
      setSnack({open:true, msg:'Failed to fetch products', severity:"error"});
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setForm({ id: null, name: '', unit: '' });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.unit.trim()) {
      setSnack({open:true, msg:'Name and Unit are required', severity:"error"});
      return;
    }

    try {
      if (form.id) {
        // Correct PUT call, send params as query string, body null
        await api.put(`/products/${form.id}`, null, { params: { name: form.name, unit: form.unit } });
        setSnack({open:true, msg:'Product updated', severity:"success"});
      } else {
        // Correct POST call, send params as query string, body null
        await api.post('/products', null, { params: { name: form.name, unit: form.unit } });
        setSnack({open:true, msg:'Product added', severity:"success"});
      }
      handleClose();
      fetchProducts();
    } catch {
      setSnack({open:true, msg:'Failed to save product', severity:"error"});
    }
  };

  const handleEdit = (product) => {
    setForm({ id: product.id, name: product.name, unit: product.unit });
    setOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirm({ open: true, id });
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/products/${deleteConfirm.id}`);
      setSnack({open:true, msg:'Product deleted', severity:"success"});
      fetchProducts();
    } catch {
      setSnack({open:true, msg:'Failed to delete product', severity:"error"});
    }
    setDeleteConfirm({ open: false, id: null });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ open: false, id: null });
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800} color="primary.main">Products</Typography>
        <Button startIcon={<AddIcon />} variant="contained" onClick={handleOpen}>Add Product</Button>
      </Stack>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id} hover>
                <TableCell>{p.id}</TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.unit}</TableCell>
                <TableCell align="right">
                  <Button size="small" startIcon={<EditIcon />} onClick={() => handleEdit(p)}>Edit</Button>
                  <Button size="small" startIcon={<DeleteIcon />} color="error" onClick={() => handleDeleteClick(p.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
            {!loading && products.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">No products found</TableCell>
              </TableRow>
            )}
            {loading && (
              <TableRow>
                <TableCell colSpan={4} align="center">Loading...</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{form.id ? 'Edit Product' : 'Add Product'}</DialogTitle>
          <DialogContent>
            <TextField label="Name" name="name" fullWidth margin="normal" value={form.name} onChange={handleChange} required />
            <TextField label="Unit" name="unit" fullWidth margin="normal" value={form.unit} onChange={handleChange} required />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" type="submit">Save</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteConfirm.open} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this product?</DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity={snack.severity} variant='filled' sx={{ width: '100%' }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Products;
