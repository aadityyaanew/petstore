import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../services/api';
import { Heart, ShoppingCart } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

const LOW_STOCK_THRESHOLD = 5;

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= (product.lowStockThreshold ?? LOW_STOCK_THRESHOLD);

  const imageUrl = product.image
    ? product.image.startsWith('http')
      ? product.image
      : `${BASE_URL}${product.image}`
    : '/assets/asset-058339ca.jpeg';

  return (
    <div
      className={cn(
        "group relative flex flex-col bg-white rounded-2xl border border-border overflow-hidden transition-all duration-300",
        "hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(233,30,140,0.12)] hover:border-brand-pink/25",
        isOutOfStock && "opacity-80"
      )}
    >
      {/* Stock Badge */}
      <div className="absolute top-3 left-3 z-10">
        {isOutOfStock ? (
          <Badge variant="destructive" className="text-[10px] font-bold tracking-wider uppercase">
            Out of Stock
          </Badge>
        ) : isLowStock ? (
          <Badge variant="warning" className="text-[10px] font-bold">
            Only {product.stock} left!
          </Badge>
        ) : product.isNew ? (
          <Badge variant="secondary" className="text-[10px] font-bold tracking-wider uppercase">
            New
          </Badge>
        ) : null}
      </div>

      {/* Wishlist */}
      <button
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-brand-pink hover:text-white shadow-sm"
        aria-label="Add to wishlist"
      >
        <Heart size={14} />
      </button>

      {/* Image */}
      <div
        className="relative overflow-hidden cursor-pointer"
        style={{ height: 220 }}
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <img
          src={imageUrl}
          alt={product.title}
          className={cn(
            "w-full h-full object-cover transition-transform duration-500",
            !isOutOfStock && "group-hover:scale-105",
            isOutOfStock && "grayscale-[30%]"
          )}
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
            <span className="text-white font-bold text-sm uppercase tracking-widest">Unavailable</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className="flex flex-col flex-1 p-4 cursor-pointer"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <p className="text-xs font-semibold text-brand-pink uppercase tracking-wider mb-1">
          {product.category}
        </p>
        <h3 className="font-bold text-sm leading-snug text-foreground mb-2 line-clamp-2">
          {product.title}
        </h3>
        <p className="text-xl font-extrabold text-brand-charcoal mt-auto">
          ₹{product.price?.toFixed(2)}
        </p>
      </div>

      {/* CTA */}
      <div className="px-4 pb-4">
        <Button
          variant={isOutOfStock ? "outline" : "secondary"}
          size="sm"
          className="w-full gap-2"
          disabled={isOutOfStock}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/product/${product.id}`);
          }}
        >
          <ShoppingCart size={14} />
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
