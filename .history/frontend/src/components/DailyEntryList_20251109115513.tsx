import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Typography,
  CircularProgress,
  Container,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../services/api";

interface Product {
  id: number;
  name: string;
  unit: string;
}

interface DailyEntry {
  id: number;
  entryDate: string;
  productName: string;
  openingStock: number;
  salesToday: number;
  underTankDelivery: number;
  pricePerUnit: number;
  closingStock: number;
  temperature: number;
  notes: string;
  createdAt: string;
}

const DailyEntriesList: React.FC = () => {
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DailyEntry | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchEntries();
    fetchProducts();
  }, []);

  const fetchEntries = async () => {
    try {
      const res = await api.get("/daily-entries?limit=10");
      setEntries(res.data);
    } catch (error) {
      console.error("Failed to fetch entries");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products");
    }
  };

  const handleEdit = (entry: DailyEntry) => {
    setEditingEntry(entry);
    setFormData({
      entryDate: entry.entryDate,
      productId: "",
      openingStock: entry.openingStock,
      salesToday: entry.salesToday,
      underTankDelivery: entry.underTankDelivery,
      pricePerUnit: entry.pricePerUnit,
      temperature: entry.temperature,
      notes: entry.notes,
    });
    setOpenDialog(true);
  };

  const handleSaveEdit = async () => {
    try {
      await api.put(`/daily-entries/${editingEntry?.id}`, formData);
      alert("Entry updated successfully!");
      setOpenDialog(false);
      fetchEntries();
    } catch (error) {
      alert("Failed to update entry");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/daily-entries/${id}`);
      alert("Entry deleted successfully!");
      setDeleteConfirm(null);
      fetchEntries();
    } catch (error) {
      alert("Failed to delete entry");
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
        Last 10 Entries
      </Typography>

      {entries.length === 0 ? (
        <Alert severity="info">No entries found. Create one to get started!</Alert>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ background: "#f5f5f5" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Product</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                  Opening
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                  Sales
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                  Closing
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                  Price
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                  Temp
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id} sx={{ "&:hover": { background: "#f9f9f9" } }}>
                  <TableCell>{entry.entryDate}</TableCell>
                  <TableCell>{entry.productName}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{entry.openingStock.toFixed(2)}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{entry.salesToday.toFixed(2)}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{entry.closingStock.toFixed(2)}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{entry.pricePerUnit.toFixed(2)}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{entry.temperature || "N/A"}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEdit(entry)}
                        title="Edit"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteConfirm(entry.id)}
                        title="Delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Entry</DialogTitle>
        <DialogContent sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            fullWidth
            label="Entry Date"
            type="date"
            value={formData.entryDate || ""}
            onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Opening Stock"
            type="number"
            value={formData.openingStock || ""}
            onChange={(e) => setFormData({ ...formData, openingStock: parseFloat(e.target.value) })}
          />
          <TextField
            fullWidth
            label="Sales Today"
            type="number"
            value={formData.salesToday || ""}
            onChange={(e) => setFormData({ ...formData, salesToday: parseFloat(e.target.value) })}
          />
          <TextField
            fullWidth
            label="Under Tank Delivery"
            type="number"
            value={formData.underTankDelivery || ""}
            onChange={(e) => setFormData({ ...formData, underTankDelivery: parseFloat(e.target.value) })}
          />
          <TextField
            fullWidth
            label="Price Per Unit"
            type="number"
            value={formData.pricePerUnit || ""}
            onChange={(e) => setFormData({ ...formData, pricePerUnit: parseFloat(e.target.value) })}
          />
          <TextField
            fullWidth
            label="Temperature"
            type="number"
            value={formData.temperature || ""}
            onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
          />
          <TextField
            fullWidth
            label="Notes"
            multiline
            rows={2}
            value={formData.notes || ""}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteConfirm !== null} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this entry?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button
            onClick={() => handleDelete(deleteConfirm!)}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DailyEntriesList;
