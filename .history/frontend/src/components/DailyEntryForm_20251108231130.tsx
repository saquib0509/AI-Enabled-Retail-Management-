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
  Container,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
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
  const [loading, setLoading] = useState(false);
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
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>
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
    setLoading(true);
    api
      .post("/daily-entries", formData)
      .then(() => {
        alert("✓ Entry saved successfully!");
        setFormData({
          entryDate: new Date().toISOString().slice(0, 10),
          productId: "",
          openingStock: "",
          salesToday: "",
          underTankDelivery: "",
          pricePerUnit: "",
          temperature: "",
          notes: "",
        });
      })
      .catch((err) =>
        alert("❌ Failed: " + (err.response?.data?.error || err.message))
      )
      .finally(() => setLoading(false));
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700, color: "#1a237e", mb: 4 }}
        >
          📝 Daily Entry Form
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
        >
          {/* Grid Layout - 2 Columns */}
          <Grid container spacing={3}>
            {/* Column 1 - Left Side */}
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                {/* Entry Date */}
                <TextField
                  fullWidth
                  label="Entry Date"
                  type="date"
                  name="entryDate"
                  value={formData.entryDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                  variant="outlined"
                />

                {/* Product */}
                <FormControl fullWidth required>
                  <InputLabel>Product</InputLabel>
                  <Select
                    name="productId"
                    value={formData.productId}
                    label="Product"
                    onChange={handleChange}
                  >
                    <MenuItem value="">Select Product</MenuItem>
                    {products.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.name} ({p.unit})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Opening Stock */}
                <TextField
                  fullWidth
                  label="Opening Stock"
                  name="openingStock"
                  type="number"
                  value={formData.openingStock}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />

                {/* Sales Today */}
                <TextField
                  fullWidth
                  label="Sales Today"
                  name="salesToday"
                  type="number"
                  value={formData.salesToday}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
              </Box>
            </Grid>

            {/* Column 2 - Right Side */}
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                {/* Under Tank Delivery */}
                <TextField
                  fullWidth
                  label="Under Tank Delivery"
                  name="underTankDelivery"
                  type="number"
                  value={formData.underTankDelivery}
                  onChange={handleChange}
                  variant="outlined"
                />

                {/* Price Per Unit */}
                <TextField
                  fullWidth
                  label="Price Per Unit"
                  name="pricePerUnit"
                  type="number"
                  value={formData.pricePerUnit}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />

                {/* Temperature */}
                <TextField
                  fullWidth
                  label="Temperature (°C)"
                  name="temperature"
                  type="number"
                  value={formData.temperature}
                  onChange={handleChange}
                  variant="outlined"
                />

                {/* Notes */}
                <TextField
                  fullWidth
                  label="Notes"
                  name="notes"
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                  variant="outlined"
                  placeholder="Add any additional notes..."
                />
              </Box>
            </Grid>
          </Grid>

          {/* Submit Button */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              disabled={loading}
              sx={{
                px: 4,
                py: 1.5,
                fontWeight: 600,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1rem",
                boxShadow: 3,
                "&:hover": {
                  boxShadow: 6,
                },
              }}
            >
              {loading ? "⏳ Saving..." : "💾 Save Entry"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default DailyEntryForm;
