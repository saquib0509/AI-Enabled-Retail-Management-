import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
  Paper,
  InputLabel,
  FormControl,
  Grid,
} from "@mui/material";
import api from "../services/api";

interface Product {
  id: number;
  name: string;
  unit: string;
}

interface DailyEntryData {
  entryDate: string;
  productId: number | "";
  openingStock: number | "";
  salesToday: number | "";
  underTankDelivery: number | "";
  pricePerUnit: number | "";
  temperature: number | "";
  notes: string;
}

const DailyEntryForm: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<DailyEntryData>({
    entryDate: new Date().toISOString().slice(0, 10),
    productId: "",
    openingStock: "",
    salesToday: "",
    underTankDelivery: "",
    pricePerUnit: "",
    temperature: "",
    notes: "",
  });

  useEffect(() => {
    api
      .get<Product[]>("/products")
      .then((res) => setProducts(res.data))
      .catch(() => alert("Could not fetch products"));
  }, []);

  const handleChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    if (!name) return;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "productId" && value !== ""
          ? Number(value)
          : ["openingStock", "salesToday", "underTankDelivery", "pricePerUnit", "temperature"].includes(name) &&
            value !== ""
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    api
      .post("/daily-entries", formData)
      .then(() => alert("Entry saved successfully!"))
      .catch((err) =>
        alert("Failed: " + (err.response?.data?.error || err.message))
      );
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 5,
        maxWidth: 1100,
        mx: "auto",
        mt: 6,
        borderRadius: 3,
        background: "linear-gradient(145deg, #f8f9fb, #ffffff)",
      }}
    >
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        sx={{ fontWeight: 700, color: "primary.main", mb: 4 }}
      >
        Daily Entry Form
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      >
        {/* Row 1 */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ minWidth: "100%" }}>
              <TextField
                fullWidth
                label="Entry Date"
                type="date"
                name="entryDate"
                value={formData.entryDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
                sx={{
                  "& .MuiInputBase-root": { minHeight: 55 },
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ minWidth: "100%" }}>
              <FormControl fullWidth required sx={{ minHeight: 55 }}>
                <InputLabel>Product</InputLabel>
                <Select
                  name="productId"
                  value={formData.productId}
                  label="Product"
                  onChange={handleChange}
                  sx={{ minHeight: 55 }}
                >
                  <MenuItem value="">Select Product</MenuItem>
                  {products.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Grid>

        {/* Row 2 */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ minWidth: "100%" }}>
              <TextField
                fullWidth
                label="Opening Stock"
                name="openingStock"
                type="number"
                value={formData.openingStock}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiInputBase-root": { minHeight: 55 },
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ minWidth: "100%" }}>
              <TextField
                fullWidth
                label="Sales Today"
                name="salesToday"
                type="number"
                value={formData.salesToday}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiInputBase-root": { minHeight: 55 },
                }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Row 3 */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ minWidth: "100%" }}>
              <TextField
                fullWidth
                label="Under Tank Delivery"
                name="underTankDelivery"
                type="number"
                value={formData.underTankDelivery}
                onChange={handleChange}
                sx={{
                  "& .MuiInputBase-root": { minHeight: 55 },
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ minWidth: "100%" }}>
              <TextField
                fullWidth
                label="Price Per Unit"
                name="pricePerUnit"
                type="number"
                value={formData.pricePerUnit}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiInputBase-root": { minHeight: 55 },
                }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Row 4 */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ minWidth: "100%" }}>
              <TextField
                fullWidth
                label="Temperature"
                name="temperature"
                type="number"
                value={formData.temperature}
                onChange={handleChange}
                sx={{
                  "& .MuiInputBase-root": { minHeight: 55 },
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ minWidth: "100%" }}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                multiline
                rows={2}
                value={formData.notes}
                onChange={handleChange}
                sx={{
                  "& .MuiInputBase-root": { minHeight: 55 },
                }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Save Button */}
        <Box textAlign="center" sx={{ mt: 4 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              px: 8,
              py: 1.5,
              fontWeight: 600,
              borderRadius: 2,
              textTransform: "none",
              fontSize: "1rem",
              boxShadow: 3,
            }}
          >
            Save Entry
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default DailyEntryForm;
