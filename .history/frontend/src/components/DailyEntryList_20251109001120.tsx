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
  product: { id: number; name: string; unit: string };
  openingStock: number;
  salesToday: number;
  underTankDelivery: number;
  pricePerUnit: number;
  closingStock?: number;
  temperature: number;
  notes: string;
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
    setFormData(entry);
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
