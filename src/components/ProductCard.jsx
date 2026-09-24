import { Card, CardMedia, CardContent, CardActions, Typography, Button, IconButton, Box, Chip } from '@mui/material';
import { ShoppingCart, FavoriteBorder } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../services/api';

const LOW_STOCK_THRESHOLD = 5;

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= (product.lowStockThreshold ?? LOW_STOCK_THRESHOLD);

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', opacity: isOutOfStock ? 0.85 : 1 }}>
      
      {/* Stock Status Badges */}
      {isOutOfStock ? (
        <Chip
          label="OUT OF STOCK"
          size="small"
          sx={{
            position: 'absolute', top: 12, left: 12, zIndex: 2,
            fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.05em',
            bgcolor: '#EF4444', color: 'white',
          }}
        />
      ) : isLowStock ? (
        <Chip
          label={`Only ${product.stock} left!`}
          size="small"
          sx={{
            position: 'absolute', top: 12, left: 12, zIndex: 2,
            fontWeight: 700, fontSize: '0.65rem',
            bgcolor: '#F59E0B', color: 'white',
          }}
        />
      ) : product.isNew ? (
        <Chip label="NEW" color="secondary" size="small" sx={{ position: 'absolute', top: 12, left: 12, fontWeight: 700, zIndex: 1 }} />
      ) : null}

      <IconButton
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          bgcolor: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(4px)',
          '&:hover': { bgcolor: 'white' }
        }}
        size="small"
      >
        <FavoriteBorder fontSize="small" />
      </IconButton>

      <Box
        sx={{ overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <CardMedia
          component="img"
          height="240"
          image={product.image.startsWith('http') ? product.image : `${BASE_URL}${product.image}`}
          alt={product.title}
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.4s',
            '&:hover': { transform: isOutOfStock ? 'none' : 'scale(1.05)' },
            filter: isOutOfStock ? 'grayscale(30%)' : 'none',
          }}
        />
        {/* Out of stock overlay */}
        {isOutOfStock && (
          <Box
            sx={{
              position: 'absolute', inset: 0,
              bgcolor: 'rgba(0,0,0,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '1rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Unavailable
            </Typography>
          </Box>
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1, cursor: 'pointer' }} onClick={() => navigate(`/product/${product.id}`)}>
        <Typography gutterBottom variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
          {product.category}
        </Typography>
        <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 700, lineHeight: 1.2, mb: 1 }}>
          {product.title}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }}>
          ₹{product.price.toFixed(2)}
        </Typography>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button
          fullWidth
          variant={isOutOfStock ? 'outlined' : 'contained'}
          startIcon={<ShoppingCart />}
          disabled={isOutOfStock}
          sx={{ borderRadius: '8px' }}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/product/${product.id}`);
          }}
        >
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
