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
  Stack,
  Typography,
  CircularProgress,
  Container,
  Alert,
  Grid,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
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
  dailyRevenue: number;
  temperature: number;
  notes: string;
  createdAt: string;
}

const DailyEntriesList: React.FC = () => {
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DailyEntry | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [formData, setFormData] = useState<any>({});

  // Date filter
  const [fromDate, setFromDate] = useState<string>(
    new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().slice(0, 10)
  );
  const [toDate, setToDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );

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

  const handleFilterByDate = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/daily-entries/by-date-range?fromDate=${fromDate}&toDate=${toDate}`
      );
      setEntries(res.data);
    } catch (error) {
      alert("Failed to fetch entries for date range");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setDownloading(true);
      const response = await api.get(
        `/daily-entries/export-pdf?fromDate=${fromDate}&toDate=${toDate}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `daily-entries-${fromDate}-to-${toDate}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      alert("Failed to download PDF");
    } finally {
      setDownloading(false);
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

  if (loading && entries.length === 0)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
        Daily Entries with PDF Export
      </Typography>

      {/* Date Filter & Download */}
      <Paper sx={{ p: 3, mb: 3, background: "#f5f5f5" }}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="From Date"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="To Date"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleFilterByDate}
            >
              Filter
            </Button>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              fullWidth
              variant="contained"
              color="success"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadPdf}
              disabled={downloading}
            >
              {downloading ? "Downloading..." : "Download PDF"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {entries.length === 0 ? (
        <Alert severity="info">No entries found for this date range.</Alert>
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
                  Revenue
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
                  <TableCell sx={{ textAlign: "center" }}>
                    {entry.openingStock.toFixed(2)}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {entry.salesToday.toFixed(2)}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {entry.closingStock.toFixed(2)}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {entry.pricePerUnit.toFixed(2)}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {entry.getDailyRevenue?.toFixed(2) || "N/A"}
                  </TableCell>
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
            label="Price Per Unit"
            type="number"
            value={formData.pricePerUnit || ""}
            onChange={(e) => setFormData({ ...formData, pricePerUnit: parseFloat(e.target.value) })}
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
