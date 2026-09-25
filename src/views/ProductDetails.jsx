import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Minus, Plus, ShoppingCart, Truck, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState('');

  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.getProductById(id);
        setProduct(res.data);
      } catch (error) {
        console.error('Failed to fetch product details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setAddingToCart(true);
    setCartMessage('');
    try {
      await addToCart(product._id, quantity);
      setCartMessage(`Added ${quantity} item(s) to cart!`);
      setTimeout(() => setCartMessage(''), 3500);
    } catch (error) {
      console.error('Failed to add to cart', error);
      setCartMessage(error.response?.data?.message || 'Failed to add to cart');
      setTimeout(() => setCartMessage(''), 3500);
    } finally {
      setAddingToCart(false);
    }
  };


  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-12 h-12 border-4 border-brand-pink/20 border-t-brand-pink rounded-full animate-spin" />
    </div>
  );
  if (!product) return <div className="text-center py-20 text-xl font-bold">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-12 sm:mb-16">
        <div className="bg-white rounded-3xl border border-border p-4 sm:p-8 flex items-center justify-center shadow-sm aspect-square overflow-hidden">
          <img 
            src={product.images?.[0] || '/assets/asset-058339ca.jpeg'} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col">
          <Badge variant="pink" className="self-start mb-3 sm:mb-4 uppercase tracking-wider text-xs">{product.category}</Badge>
          <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-2 sm:mb-3 leading-tight">
            {product.name}
          </h1>
          
          
          <p className="text-2xl sm:text-3xl font-extrabold text-brand-pink mb-4 sm:mb-6">${product.price.toFixed(2)}</p>
          
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 sm:mb-8">
            {product.description}
          </p>

          <div className="border-t border-border pt-5 mb-5 sm:mb-6">
            {product.stock === 0 ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-red-50 text-red-700 font-bold text-xs sm:text-sm border border-red-200">
                <AlertCircle size={16} /> Out of Stock
              </div>
            ) : product.stock <= (product.lowStockThreshold ?? 5) ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-50 text-amber-700 font-bold text-xs sm:text-sm border border-amber-200">
                <AlertCircle size={16} /> Only {product.stock} left — order soon!
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs sm:text-sm border border-emerald-200">
                <CheckCircle2 size={16} /> In Stock ({product.stock} available)
              </div>
            )}
          </div>

          <div className="mb-6 sm:mb-8">
            <p className="font-bold text-xs sm:text-sm mb-2.5">Quantity</p>
            <div className="inline-flex items-center border border-border rounded-xl overflow-hidden bg-white shadow-sm">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={product.stock === 0}
                className="px-4 py-2.5 sm:py-3 hover:bg-accent disabled:opacity-50 transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <Minus size={16} />
              </button>
              <span className="px-4 font-bold min-w-[3rem] text-center text-sm">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                disabled={quantity >= product.stock || product.stock === 0}
                className="px-4 py-2.5 sm:py-3 hover:bg-accent disabled:opacity-50 transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <Button
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto min-w-[240px] py-3.5 sm:py-6 text-base sm:text-lg gap-3 rounded-full cursor-pointer shadow-md active:scale-95 transition-all"
            onClick={handleAddToCart}
            disabled={addingToCart || product.stock === 0}
          >
            <ShoppingCart size={18} />
            {product.stock === 0 ? 'Out of Stock' : addingToCart ? 'Adding...' : `Add to Cart — $${(product.price * quantity).toFixed(2)}`}
          </Button>

          {cartMessage && (
            <div className="mt-3 inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-green-700 bg-green-50 px-3.5 py-1.5 rounded-full border border-green-200">
              <CheckCircle2 size={16} />
              <span>{cartMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mt-auto pt-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-pink/10 text-brand-pink flex items-center justify-center">
                <Truck size={20} />
              </div>
              <span className="font-semibold text-sm">Free Shipping</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-pink/10 text-brand-pink flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <span className="font-semibold text-sm">2 Year Warranty</span>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default ProductDetails;
