import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../services/api';
import { Heart, ShoppingCart } from 'lucide-react';
import { Badge } from './ui/badge';

import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const LOW_STOCK_THRESHOLD = 5;

export const getProductImageUrl = (product) => {
  if (!product) return 'https://placehold.co/400x400/f8f9fa/a1a1aa?text=No+Image';

  const firstImg = product.images?.[0];

  if (typeof firstImg === 'string' && firstImg !== '[object Object]') {
    return firstImg.startsWith('http') || firstImg.startsWith('/') ? firstImg : `${BASE_URL}${firstImg}`;
  }

  if (typeof firstImg === 'object' && firstImg !== null) {
    if (typeof firstImg.url === 'string' && firstImg.url !== '[object Object]') {
      return firstImg.url.startsWith('http') || firstImg.url.startsWith('/') ? firstImg.url : `${BASE_URL}${firstImg.url}`;
    }
    const rawObj = firstImg._doc || firstImg;
    const chars = Object.keys(rawObj)
      .filter((k) => !isNaN(k))
      .sort((a, b) => Number(a) - Number(b))
      .map((k) => rawObj[k])
      .join('');
    if (chars && chars.length > 2) {
      return chars.startsWith('http') || chars.startsWith('/') ? chars : `${BASE_URL}${chars}`;
    }
  }

  if (typeof product.image === 'string' && product.image !== '[object Object]') {
    return product.image.startsWith('http') || product.image.startsWith('/') ? product.image : `${BASE_URL}${product.image}`;
  }

  return 'https://placehold.co/400x400/f8f9fa/a1a1aa?text=No+Image';
};

export const getItemImageUrl = (item) => {
  if (!item) return 'https://placehold.co/400x400/f8f9fa/a1a1aa?text=No+Image';

  // 1. Populated product object
  if (item.product && typeof item.product === 'object') {
    const prodImg = getProductImageUrl(item.product);
    if (prodImg && !prodImg.includes('No+Image')) return prodImg;
  }

  // 2. Direct item.image field (ignoring ObjectId strings)
  const img = item.image;
  if (typeof img === 'string' && img !== '[object Object]' && !img.match(/^[0-9a-fA-F]{24}$/)) {
    return img.startsWith('http') || img.startsWith('/') ? img : `${BASE_URL}${img}`;
  }

  if (typeof img === 'object' && img !== null) {
    if (typeof img.url === 'string' && img.url !== '[object Object]') {
      return img.url.startsWith('http') || img.url.startsWith('/') ? img.url : `${BASE_URL}${img.url}`;
    }
  }

  return 'https://placehold.co/400x400/f8f9fa/a1a1aa?text=No+Image';
};

const ProductCard = ({ product, onToast }) => {
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { user } = useAuth();
  const [adding, setAdding] = useState(false);

  const productId = product?._id || product?.id;
  const isOutOfStock = product?.stock === 0;
  const isLowStock = product?.stock > 0 && product?.stock <= (product?.lowStockThreshold ?? LOW_STOCK_THRESHOLD);

  const imageUrl = getProductImageUrl(product);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    if (!user) {
      if (onToast) onToast('Please log in to add items to your cart');
      navigate('/login');
      return;
    }
    try {
      setAdding(true);
      await addToCart(productId, 1);
      if (onToast) {
        onToast(`Added "${product.name || product.title}" to cart!`);
      }
    } catch (err) {
      console.error('Failed to add to cart:', err);
      if (onToast) {
        onToast(err.response?.data?.message || err.message || 'Failed to add item to cart');
      }
    } finally {
      setTimeout(() => setAdding(false), 600);
    }
  };

  return (
    <div
      onClick={() => navigate(`/product/${productId}`)}
      className={cn(
        "group relative flex flex-col bg-card rounded-xl p-4 transition-all duration-300 cursor-pointer",
        "border border-border hover:border-primary/50 hover:shadow-md",
        isOutOfStock && "opacity-80"
      )}
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
        {isOutOfStock ? (
          <Badge variant="destructive" className="text-[10px] font-bold tracking-wider uppercase rounded-full">
            Out of Stock
          </Badge>
        ) : isLowStock ? (
          <Badge className="bg-primary text-primary-foreground text-[10px] font-bold rounded-full">
            Only {product.stock} left!
          </Badge>
        ) : product.isNew ? (
          <Badge className="bg-black text-white text-[10px] font-bold rounded-full">
            New
          </Badge>
        ) : null}
      </div>


      {/* Image Area */}
      <div className="relative overflow-hidden rounded-lg bg-muted/30 aspect-square flex items-center justify-center mb-4 transition-colors duration-300">
        <img
          src={imageUrl}
          alt={product.title || product.name}
          className={cn(
            "w-full h-full object-cover",
            isOutOfStock && "grayscale-[30%]"
          )}
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-bold text-xs uppercase tracking-widest">Unavailable</span>
          </div>
        )}
      </div>

      {/* Title & Category */}
      <div className="flex flex-col flex-1 px-1">

        <h3 className="font-semibold text-sm sm:text-[15px] text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors mb-3">
          {product.title || product.name}
        </h3>
      </div>

      {/* Price & Action Row */}
      <div className="pt-3 px-1 flex items-center justify-between border-t border-border mt-auto">
        <div>
          <span className="text-base sm:text-lg font-bold text-foreground tracking-tight">
            ₹{(product.price || 0).toFixed(2)}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={cn(
            "px-4 py-2 rounded-md text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 shadow-sm",
            isOutOfStock
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary hover:bg-primary/90 active:scale-95 text-primary-foreground cursor-pointer hover:shadow-md"
          )}
        >
          <ShoppingCart size={13} />
          <span>{adding ? 'Added!' : 'Add'}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
