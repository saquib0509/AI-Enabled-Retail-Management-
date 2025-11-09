// import { useState, useEffect } from 'react';
// import {
//   Card, CardContent, CardHeader, Divider, Grid, Typography, TextField, Button, Stack, 
//   Box, MenuItem, InputAdornment, Paper, TableContainer, Table, TableHead, TableRow, 
//   TableCell, TableBody, TablePagination, CircularProgress, Tooltip, Snackbar, Alert,
//   alpha, useTheme
// } from '@mui/material';
// import { AddCircle as AddCircleIcon, Save as SaveIcon, Refresh as RefreshIcon } from '@mui/icons-material';
// import api from '../services/api';

// interface Entry {
//   id: number;
//   entryDate: string;
//   productName: string;
//   openingStock: number;
//   salesToday: number;
//   underTankDelivery: number;
//   closingStock: number;
//   pricePerUnit: number;
//   dailyRevenue: number;
//   temperature: number;
//   notes: string;
// }
// interface Product {
//   id: number;
//   name: string;
//   unit: string;
// }

// export default function DailyEntries() {
//   // --- State
//   const [entries, setEntries] = useState<Entry[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [form, setForm] = useState({
//     entryDate: new Date().toISOString().slice(0, 10),
//     productId: '',
//     openingStock: '',
//     salesToday: '',
//     underTankDelivery: '',
//     pricePerUnit: '',
//     temperature: '',
//     notes: '',
//   });
//   const [errors, setErrors] = useState<{ [k: string]: string }>({});
//   const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' as 'error' | 'success' });

//   // Table pagination
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   // --- Effects
//   useEffect(() => {
//     fetchEntries();
//     fetchProducts();
//   }, []);

//   // --- Fetching
//   const fetchEntries = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get('/daily-entries/today');
//       setEntries(res.data);
//     } catch {
//       setSnack({ open: true, msg: 'Failed to fetch entries', severity: 'error' });
//     }
//     setLoading(false);
//   };
//   const fetchProducts = async () => {
//     try {
//       const res = await api.get('/products');
//       setProducts(res.data);
//     } catch { }
//   };

//   // --- Form Handlers
//   const resetForm = () => {
//     setForm({
//       entryDate: new Date().toISOString().slice(0, 10),
//       productId: '',
//       openingStock: '',
//       salesToday: '',
//       underTankDelivery: '',
//       pricePerUnit: '',
//       temperature: '',
//       notes: '',
//     });
//     setErrors({});
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setErrors({...errors, [e.target.name]: ''});
//   };
//   const handleSelect = (e: React.ChangeEvent<{ name?: string; value: unknown; }>) => {
//     setForm({ ...form, [e.target.name as string]: e.target.value });
//     setErrors({...errors, [e.target.name as string]: ''});
//   };

//   const validate = () => {
//     const newErrors: Record<string, string> = {};
//     if (!form.entryDate) newErrors.entryDate = 'Date is required';
//     if (!form.productId) newErrors.productId = 'Product is required';
//     if (!form.openingStock) newErrors.openingStock = 'Required';
//     if (!form.salesToday) newErrors.salesToday = 'Required';
//     if (!form.pricePerUnit) newErrors.pricePerUnit = 'Required';
//     return newErrors;
//   };

//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const validation = validate();
//     setErrors(validation);
//     if (Object.keys(validation).length !== 0) return;
//     try {
//       await api.post('/daily-entries', {
//         ...form,
//         productId: Number(form.productId),
//         openingStock: Number(form.openingStock),
//         salesToday: Number(form.salesToday),
//         underTankDelivery: form.underTankDelivery === '' ? null : Number(form.underTankDelivery),
//         pricePerUnit: Number(form.pricePerUnit),
//         temperature: form.temperature === '' ? null : Number(form.temperature),
//       });
//       setSnack({ open: true, msg: 'Entry added', severity: 'success' });
//       resetForm();
//       fetchEntries();
//     } catch {
//       setSnack({ open: true, msg: 'Failed to add entry', severity: 'error' });
//     }
//   };
//   // --- Pagination handlers
//   const handlePageChange = (_: unknown, newPage: number) => setPage(newPage);
//   const handleRowsPerPage = (evt: React.ChangeEvent<HTMLInputElement>) => { setRowsPerPage(parseInt(evt.target.value)); setPage(0); };
//   // --- Table render helpers
//   const pagedRows = entries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//   // --- Render
//   return (
//     <Box sx={{ 
//       minHeight: '100vh',
//       background: theme => `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.secondary.light, 0.1)} 100%)`,
//       py: 4
//     }}>
//       <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
//         {/* Form Card */}
//         <Card elevation={4} sx={{ 
//           mb: 4, 
//           borderRadius: 4, 
//           background: theme => theme.palette.background.paper,
//           boxShadow: theme => `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
//           transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//           '&:hover': {
//             transform: 'translateY(-4px)',
//             boxShadow: theme => `0 12px 40px ${alpha(theme.palette.primary.main, 0.15)}`
//           }
//         }}>
//           <CardHeader
//             title={
//               <Typography variant="h5" component="div" sx={{ 
//                 fontWeight: 600,
//                 color: 'primary.main',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: 1 
//               }}>
//                 <AddCircleIcon color="primary" sx={{ fontSize: 28 }} />
//                 <span>New Daily Entry</span>
//               </Typography>
//             }
//             sx={{
//               borderBottom: '1px solid',
//               borderColor: 'divider',
//               background: theme => alpha(theme.palette.primary.main, 0.02)
//             }}
//           />
//           <form onSubmit={handleSave} autoComplete="off">
//             <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
//               <Grid container spacing={3}>
//                 <Grid item xs={12}>
//                   <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
//                     ENTRY INFORMATION
//                   </Typography>
//                   <Divider sx={{ mb: 2 }} />
//                 </Grid>
//                 <Grid item xs={12} sm={6} md={4}>
//                   <TextField
//                     label="Entry Date"
//                     name="entryDate"
//                     type="date"
//                     value={form.entryDate}
//                     onChange={handleChange}
//                     fullWidth
//                     InputLabelProps={{ 
//                       shrink: true,
//                       sx: { 
//                         color: 'text.primary',
//                         '&.Mui-focused': {
//                           color: 'primary.main'
//                         }
//                       } 
//                     }}
//                     InputProps={{
//                       sx: {
//                         '& .MuiOutlinedInput-notchedOutline': {
//                           borderColor: 'divider',
//                           transition: 'all 0.3s',
//                         },
//                         '&:hover .MuiOutlinedInput-notchedOutline': {
//                           borderColor: 'primary.light',
//                         },
//                         '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                           borderWidth: '2px',
//                           borderColor: 'primary.main',
//                         },
//                       },
//                     }}
//                     required
//                     error={!!errors.entryDate}
//                     helperText={errors.entryDate}
//                     variant="outlined"
//                     size="small"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6} md={8}>
//                   <TextField
//                     select
//                     label="Product"
//                     name="productId"
//                     value={form.productId}
//                     onChange={handleSelect}
//                     fullWidth
//                     required
//                     error={!!errors.productId}
//                     helperText={errors.productId}
//                     variant="outlined"
//                     size="small"
//                     InputLabelProps={{
//                       sx: { 
//                         color: 'text.primary',
//                         '&.Mui-focused': {
//                           color: 'primary.main'
//                         }
//                       } 
//                     }}
//                     SelectProps={{
//                       MenuProps: {
//                         PaperProps: {
//                           sx: {
//                             mt: 1,
//                             boxShadow: theme => `0 8px 16px ${alpha(theme.palette.common.black, 0.1)}`,
//                             '& .MuiMenuItem-root': {
//                               padding: '8px 16px',
//                               '&:hover': {
//                                 backgroundColor: theme => alpha(theme.palette.primary.main, 0.08),
//                               },
//                               '&.Mui-selected': {
//                                 backgroundColor: theme => alpha(theme.palette.primary.main, 0.12),
//                                 '&:hover': {
//                                   backgroundColor: theme => alpha(theme.palette.primary.main, 0.16),
//                                 },
//                               },
//                             },
//                           },
//                         },
//                       },
//                     }}
//                   >
//                     <MenuItem value="" disabled>
//                       <em>Select a product</em>
//                           height: 12, 
//                           borderRadius: '50%', 
//                           bgcolor: 'primary.main',
//                           mr: 1.5,
//                           opacity: 0.7
//                         }} />
//                         {p.name}
//                       </Box>
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Grid>
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextField
//                   label="Opening Stock"
//                   name="openingStock"
//                   type="number"
//                   value={form.openingStock}
//                   onChange={handleChange}
//                   fullWidth
//                   required
//                   error={!!errors.openingStock}
//                   helperText={errors.openingStock || 'In liters or units'}
//                   variant="outlined"
//                   size="small"
//                   InputProps={{ 
//                     endAdornment: (
//                       <InputAdornment position="end">
//                         <Typography variant="body2" color="text.secondary">
//                           units
//                         </Typography>
//                       </InputAdornment>
//                     ),
//                     inputProps: { 
//                       step: '0.01',
//                       min: '0'
//                     }
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextField
//                   label="Sales Today"
//                   name="salesToday"
//                   type="number"
//                   value={form.salesToday}
//                   onChange={handleChange}
//                   fullWidth
//                   required
//                   error={!!errors.salesToday}
//                   helperText={errors.salesToday || 'In liters or units'}
//                   InputProps={{ endAdornment: <InputAdornment position="end">units</InputAdornment> }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextField
//                   label="Under Tank Delivery"
//                   name="underTankDelivery"
//                   type="number"
//                   value={form.underTankDelivery}
//                   onChange={handleChange}
//                   fullWidth
//                   error={!!errors.underTankDelivery}
//                   helperText={errors.underTankDelivery || 'If any, in liters/units'}
//                   InputProps={{ endAdornment: <InputAdornment position="end">units</InputAdornment> }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextField
//                   label="Price per Unit"
//                   name="pricePerUnit"
//                   type="number"
//                   value={form.pricePerUnit}
//                   onChange={handleChange}
//                   fullWidth
//                   required
//                   error={!!errors.pricePerUnit}
//                   helperText={errors.pricePerUnit}
//                   InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextField
//                   label="Temperature"
//                   name="temperature"
//                   type="number"
//                   value={form.temperature}
//                   onChange={handleChange}
//                   fullWidth
//                   error={!!errors.temperature}
//                   helperText={errors.temperature}
//                 />
//               </Grid>
//               <Grid item xs={12} md={8}>
//                 <TextField
//                   label="Notes"
//                   name="notes"
//                   value={form.notes}
//                   onChange={handleChange}
//                   fullWidth
//                   multiline
//                   minRows={1}
//                   maxRows={3}
//                   error={!!errors.notes}
//                   helperText={errors.notes || 'Additional remarks'}
//                 />
//               </Grid>
//             </Grid>
//             <Stack direction="row" spacing={1} mt={3} justifyContent="flex-end">
//               <Button color="inherit" onClick={resetForm} type="button">Reset</Button>
//               <Button variant="contained" color="primary" type="submit" sx={{ px: 4 }}>Save</Button>
//             </Stack>
//           </CardContent>
//         </form>
//       </Card>
//       {/* Table of entries */}
//       <Paper elevation={2} sx={{ pt: 2, pb: 0, borderRadius: 3, maxWidth: 1100, mx: 'auto', mb: 4 }}>
//         <Typography variant="h6" sx={{ px: 2, pb: 1 }} color="primary" fontWeight={700}>Recent Entries (Today)</Typography>
//         <TableContainer sx={{ maxHeight: 420 }}>
//           <Table size="small" stickyHeader>
//             <TableHead>
//               <TableRow sx={{ bgcolor: t=>t.palette.grey[100] }}>
//                 <TableCell>Date</TableCell>
//                 <TableCell>Product</TableCell>
//                 <TableCell>Opening</TableCell>
//                 <TableCell>Sales</TableCell>
//                 <TableCell>Delivery</TableCell>
//                 <TableCell>Closing</TableCell>
//                 <TableCell>Unit Price</TableCell>
//                 <TableCell>Revenue</TableCell>
//                 <TableCell>Notes</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {loading && (
//                 <TableRow>
//                   <TableCell colSpan={9} align="center"><CircularProgress size={22} sx={{ my: 2 }} /></TableCell>
//                 </TableRow>
//               )}
//               {!loading && pagedRows.length === 0 && (
//                 <TableRow><TableCell colSpan={9} align="center">No entries for today</TableCell></TableRow>
//               )}
//               {!loading && pagedRows.map((e) => (
//                 <TableRow hover key={e.id} sx={{ bgcolor: (idx) => idx % 2 ? 'background.default' : undefined }}>
//                   <TableCell>{e.entryDate}</TableCell>
//                   <TableCell>{e.productName}</TableCell>
//                   <TableCell>{e.openingStock}</TableCell>
//                   <TableCell>{e.salesToday}</TableCell>
//                   <TableCell>{e.underTankDelivery}</TableCell>
//                   <TableCell>{e.closingStock}</TableCell>
//                   <TableCell>{e.pricePerUnit}</TableCell>
//                   <TableCell>{e.dailyRevenue}</TableCell>
//                   <TableCell>
//                     <Tooltip title={e.notes} arrow>{
//                       <span style={{width: 120, display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{e.notes}</span>
//                     }</Tooltip>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         <TablePagination
//           rowsPerPageOptions={[5, 10, 20]}
//           component="div"
//           count={entries.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handlePageChange}
//           onRowsPerPageChange={handleRowsPerPage}
//         />
//       </Paper>
//       {/* Snackbar */}
//       <Snackbar open={snack.open} autoHideDuration={3000} onClose={()=>setSnack(s=>({...s,open:false}))} anchorOrigin={{vertical:'top',horizontal:'center'}}>
//         <Alert severity={snack.severity} variant='filled' sx={{ width: '100%' }}>{snack.msg}</Alert>
//       </Snackbar>
//     </Box>
//   );
// }
