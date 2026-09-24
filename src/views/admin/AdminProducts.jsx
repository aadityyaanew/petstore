import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, CircularProgress, ImageList, ImageListItem, ImageListItemBar, Tooltip, Chip, Tabs, Tab } from '@mui/material';
import { Edit, Delete, Add, CloudUpload, DeleteOutline, Warning, CheckCircle } from '@mui/icons-material';
import api, { BASE_URL } from '../../services/api';

const categories = ['Electronics', 'Clothing', 'Footwear', 'Books', 'Home & Kitchen', 'Sports', 'Beauty', 'Toys'];

const getStockChip = (stock, threshold = 5) => {
  if (stock === 0) {
    return <Chip label="Out of Stock" size="small" sx={{ bgcolor: '#FEE2E2', color: '#DC2626', fontWeight: 700, minWidth: 100 }} />;
  }
  if (stock <= threshold) {
    return <Chip label={`Low Stock (${stock})`} size="small" sx={{ bgcolor: '#FEF3C7', color: '#D97706', fontWeight: 700, minWidth: 100 }} />;
  }
  return <Chip label={`In Stock (${stock})`} size="small" sx={{ bgcolor: '#DCFCE7', color: '#16A34A', fontWeight: 700, minWidth: 100 }} />;
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState(0); // 0 = All, 1 = Low Stock / Out of Stock
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: 'Electronics', stock: '', lowStockThreshold: 5, images: []
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.getProducts({ limit: 100 });
      setProducts(res.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (product = null) => {
    if (product) {
      setEditingId(product._id);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: product.stock,
        lowStockThreshold: product.lowStockThreshold ?? 5,
        images: product.images || [],
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', description: '', price: '', category: 'Electronics', stock: '', lowStockThreshold: 5, images: [] });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        lowStockThreshold: Number(formData.lowStockThreshold),
      };

      if (editingId) {
        await api.updateProduct(editingId, dataToSubmit);
      } else {
        await api.createProduct(dataToSubmit);
      }
      handleClose();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert(error.response?.data?.message || 'Error saving product');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.deleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);

    setUploading(true);
    try {
      const { data } = await api.uploadImage(uploadData);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, data.image]
      }));
    } catch (error) {
      console.error('File upload failed:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const filteredProducts = activeTab === 1
    ? products.filter((p) => p.stock <= (p.lowStockThreshold ?? 5))
    : products;

  const lowStockCount = products.filter((p) => p.stock <= (p.lowStockThreshold ?? 5)).length;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
          Manage Products
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpen()}
          sx={{ borderRadius: '8px', px: 3 }}
        >
          Add Product
        </Button>
      </Box>

      {/* Filter Tabs */}
      <Box sx={{ mb: 3, borderBottom: '1px solid #E2E8F0' }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab label={`All Products (${products.length})`} />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Warning sx={{ fontSize: 18, color: '#D97706' }} />
                Low / Out of Stock
                {lowStockCount > 0 && (
                  <Chip label={lowStockCount} size="small" sx={{ bgcolor: '#EF4444', color: 'white', fontWeight: 700, height: 20, fontSize: '0.7rem' }} />
                )}
              </Box>
            }
          />
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <Table>
            <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Stock Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Threshold</TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                      {activeTab === 1 ? (
                        <>
                          <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 1, opacity: 0.8 }} />
                          <Typography variant="h6" color="text.primary">All caught up!</Typography>
                          <Typography variant="body2" color="text.secondary">No low stock products. Everything is well stocked.</Typography>
                        </>
                      ) : (
                        <Typography color="text.secondary">No products found.</Typography>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product._id} hover sx={{ '&:last-child td': { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 500 }}>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>₹{product.price.toFixed(2)}</TableCell>
                    <TableCell>{getStockChip(product.stock, product.lowStockThreshold)}</TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        Alert at ≤ {product.lowStockThreshold ?? 5}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      <Tooltip title="Edit Product">
                        <IconButton color="primary" onClick={() => handleOpen(product)}><Edit /></IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Product">
                        <IconButton color="error" onClick={() => handleDelete(product._id)}><Delete /></IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{editingId ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Product Name" name="name" value={formData.name} onChange={handleChange} required fullWidth />
            <TextField label="Description" name="description" value={formData.description} onChange={handleChange} required multiline rows={3} fullWidth />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField label="Price (₹)" name="price" type="number" inputProps={{ min: 0, step: "0.01" }} value={formData.price} onChange={handleChange} required fullWidth />
              <TextField label="Stock Quantity" name="stock" type="number" inputProps={{ min: 0 }} value={formData.stock} onChange={handleChange} required fullWidth />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField select label="Category" name="category" value={formData.category} onChange={handleChange} required fullWidth>
                {categories.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </TextField>
              <Tooltip title="Trigger low-stock alert email when stock reaches this number">
                <TextField
                  label="Low Stock Alert At"
                  name="lowStockThreshold"
                  type="number"
                  inputProps={{ min: 0 }}
                  value={formData.lowStockThreshold}
                  onChange={handleChange}
                  fullWidth
                  helperText="Email alert threshold"
                />
              </Tooltip>
            </Box>

            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Product Images</Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                <Button
                  variant="outlined"
                  startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
                  onClick={handleUploadClick}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Add Image'}
                </Button>
              </Box>

              {formData.images.length > 0 && (
                <ImageList sx={{ height: 160, borderRadius: 2 }} cols={3} rowHeight={120}>
                  {formData.images.map((img, index) => (
                    <ImageListItem key={index}>
                      <img
                        src={img.startsWith('http') ? img : `${BASE_URL}${img}`}
                        alt={`product-${index}`}
                        loading="lazy"
                        style={{ objectFit: 'cover' }}
                      />
                      <ImageListItemBar
                        sx={{ background: 'transparent' }}
                        actionIcon={
                          <IconButton sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.5)', m: 0.5 }} size="small" onClick={() => removeImage(index)}>
                            <DeleteOutline />
                          </IconButton>
                        }
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleClose} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained" color="primary">Save Product</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default AdminProducts;
