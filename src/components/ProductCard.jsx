'use client';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../services/api';
import { Heart, ShoppingCart } from 'lucide-react';
import { Badge } from './ui/badge';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const LOW_STOCK_THRESHOLD = 5;

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= (product.lowStockThreshold ?? LOW_STOCK_THRESHOLD);
  const wishlisted = isInWishlist(product.id || product._id);

  const imageUrl = product.image
    ? product.image.startsWith('http')
      ? product.image
      : `${BASE_URL}${product.image}`
    : '/assets/categories/accessories.jpg';

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    try {
      setAdding(true);
      await addToCart(product.id || product._id, 1);
    } catch {
      // Handled
    } finally {
      setTimeout(() => setAdding(false), 600);
    }
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.id || product._id}`)}
      className={cn(
        "group relative flex flex-col bg-[#F8F9FA] rounded-3xl border border-gray-100 p-4 sm:p-5 transition-all duration-300 cursor-pointer",
        "hover:-translate-y-1.5 hover:shadow-xl hover:border-gray-200",
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
          <Badge className="bg-[#E050D0] text-white text-[10px] font-bold rounded-full">
            Only {product.stock} left!
          </Badge>
        ) : product.isNew ? (
          <Badge className="bg-black text-white text-[10px] font-bold rounded-full">
            New
          </Badge>
        ) : null}
      </div>

      {/* Wishlist Heart Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product);
        }}
        className={cn(
          "absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm cursor-pointer",
          wishlisted
            ? "bg-[#E050D0] text-white scale-105"
            : "bg-white text-[#E050D0] hover:bg-[#E050D0] hover:text-white"
        )}
        aria-label="Wishlist"
      >
        <Heart size={14} strokeWidth={2.5} fill={wishlisted ? "currentColor" : "none"} />
      </button>

      {/* Image Area */}
      <div className="relative overflow-hidden rounded-2xl bg-white aspect-square flex items-center justify-center mb-3">
        <img
          src={imageUrl}
          alt={product.title || product.name}
          className={cn(
            "w-full h-full object-cover transition-transform duration-500",
            !isOutOfStock && "group-hover:scale-105",
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
      <div className="flex flex-col flex-1">
        {product.category && (
          <span className="text-[11px] font-bold text-[#E050D0] uppercase tracking-wider mb-1">
            {product.category}
          </span>
        )}
        <h3 className="font-bold text-sm sm:text-base text-gray-900 line-clamp-2 leading-snug group-hover:text-[#E050D0] transition-colors mb-2">
          {product.title || product.name}
        </h3>
      </div>

      {/* Price & Action Row */}
      <div className="pt-2 flex items-center justify-between border-t border-gray-200/60 mt-auto">
        <div>
          <span className="text-base sm:text-lg font-extrabold text-gray-900">
            ${(product.price || 0).toFixed(2)}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={cn(
            "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 shadow-sm",
            isOutOfStock
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-neutral-800 active:scale-95 text-white cursor-pointer"
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
