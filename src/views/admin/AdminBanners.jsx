import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Switch, FormControlLabel, Chip, CircularProgress } from '@mui/material';
import { Edit, Delete, ViewCarousel, Add, CloudUpload } from '@mui/icons-material';
import api, { BASE_URL } from '../../services/api';

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    buttonText: 'Shop Now',
    buttonLink: '/products',
    gradient: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
    order: 0,
    isActive: true
  });

  const fetchBanners = async () => {
    try {
      const { data } = await api.getAdminBanners();
      setBanners(data.banners || []);
    } catch (error) {
      console.error('Error fetching admin banners:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleOpen = (banner = null) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title,
        subtitle: banner.subtitle || '',
        image: banner.image || '',
        buttonText: banner.buttonText || '',
        buttonLink: banner.buttonLink || '',
        gradient: banner.gradient || '',
        order: banner.order || 0,
        isActive: banner.isActive
      });
    } else {
      setEditingBanner(null);
      setFormData({
        title: '',
        subtitle: '',
        image: '',
        buttonText: 'Shop Now',
        buttonLink: '/products',
        gradient: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        order: 0,
        isActive: true
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBanner) {
        await api.updateBanner(editingBanner._id, formData);
      } else {
        await api.createBanner(formData);
      }
      handleClose();
      fetchBanners();
    } catch (error) {
      console.error('Error saving banner:', error);
      alert('Failed to save banner');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this banner permanently?')) {
      try {
        await api.deleteBanner(id);
        fetchBanners();
      } catch (error) {
        console.error('Error deleting banner:', error);
      }
    }
  };

  const handleToggleActive = async (banner) => {
    try {
      await api.updateBanner(banner._id, { ...banner, isActive: !banner.isActive });
      fetchBanners();
    } catch (error) {
      console.error('Error updating banner status:', error);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const { data } = await api.uploadImage(formData);
      setFormData((prev) => ({ ...prev, image: data.image }));
    } catch (error) {
      console.error('File upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <Box p={4}><Typography>Loading banners...</Typography></Box>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ViewCarousel color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Manage Banners</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={() => handleOpen()}
          sx={{ borderRadius: 2, px: 3 }}
        >
          Add Banner
        </Button>
      </Box>

      <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Preview / Title</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Order</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {banners.map((banner) => (
                <TableRow key={banner._id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box 
                        sx={{ 
                          width: 80, 
                          height: 45, 
                          borderRadius: 1, 
                          background: banner.image 
                            ? `url(${banner.image.startsWith('http') ? banner.image : `${BASE_URL}${banner.image}`}) center/cover` 
                            : banner.gradient,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {!banner.image && <Typography variant="caption" color="white" sx={{ fontSize: '0.6rem', fontWeight: 700 }}>CSS</Typography>}
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{banner.title}</Typography>
                        <Typography variant="caption" color="text.secondary">{banner.subtitle}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={`Order: ${banner.order}`} size="small" />
                  </TableCell>
                  <TableCell>
                     <FormControlLabel
                        control={<Switch checked={banner.isActive} onChange={() => handleToggleActive(banner)} color="success" />}
                        label={banner.isActive ? "Active" : "Hidden"}
                      />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleOpen(banner)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(banner._id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {banners.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>No banners defined. Add one to show on the homepage.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Form Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {editingBanner ? 'Edit Banner' : 'New Banner'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <TextField
              autoFocus
              margin="dense"
              name="title"
              label="Banner Title"
              type="text"
              fullWidth
              required
              value={formData.title}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="subtitle"
              label="Subtitle"
              type="text"
              fullWidth
              value={formData.subtitle}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <TextField
                  margin="dense"
                  name="image"
                  label="Background Image URL"
                  type="text"
                  fullWidth
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/banner.jpg or upload below"
                />
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
                  onClick={handleUploadClick}
                  disabled={uploading}
                  sx={{ mt: 1, minWidth: 140, height: 56, borderRadius: 2 }}
                >
                  {uploading ? 'Uploading...' : 'Upload File'}
                </Button>
              </Box>
              {formData.image && (
                <Box sx={{ 
                  mt: 2, 
                  height: 100, 
                  borderRadius: 2, 
                  background: `url(${formData.image.startsWith('http') ? formData.image : `${BASE_URL}${formData.image}`}) center/cover`, 
                  border: '1px solid #ddd' 
                }} />
              )}
            </Box>
            <TextField
              margin="dense"
              name="gradient"
              label="Fallback CSS Gradient"
              type="text"
              fullWidth
              value={formData.gradient}
              onChange={handleChange}
              sx={{ mb: 2 }}
              helperText="E.g., linear-gradient(135deg, #0F172A 0%, #1E293B 100%)"
            />
            <Box sx={{ display: 'flex', gap: 2, mb: 2, mt: 1 }}>
              <TextField
                name="buttonText"
                label="Button Text"
                type="text"
                fullWidth
                value={formData.buttonText}
                onChange={handleChange}
              />
              <TextField
                name="buttonLink"
                label="Button Link"
                type="text"
                fullWidth
                value={formData.buttonLink}
                onChange={handleChange}
                helperText="E.g., /products"
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <TextField
                name="order"
                label="Sorting Order"
                type="number"
                value={formData.order}
                onChange={handleChange}
                sx={{ width: 120 }}
              />
              <FormControlLabel
                control={<Switch name="isActive" checked={formData.isActive} onChange={handleChange} color="success" />}
                label="Is Active"
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleClose} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained" color="primary">Save Banner</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default AdminBanners;
