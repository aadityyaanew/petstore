import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Minus, Plus, ShoppingCart, Truck, ShieldCheck, AlertCircle, CheckCircle2, Star } from 'lucide-react';
import { Textarea } from '../components/ui/textarea';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');
  
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
    try {
      await addToCart(product._id, quantity);
    } catch (error) {
      console.error('Failed to add to cart', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setReviewLoading(true);
    setReviewMessage('');
    try {
      await api.addReview(id, { rating, comment });
      setReviewMessage('Review added successfully!');
      setRating(5);
      setComment('');
      const res = await api.getProductById(id);
      setProduct(res.data);
    } catch (error) {
      setReviewMessage(error.response?.data?.message || 'Error adding review');
    } finally {
      setReviewLoading(false);
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
        <div className="bg-white rounded-3xl border border-border p-4 sm:p-8 flex items-center justify-center shadow-sm">
          <img 
            src={product.images?.[0] || '/assets/asset-058339ca.jpeg'} 
            alt={product.name}
            className="w-full h-auto max-h-[340px] sm:max-h-[480px] object-contain"
          />
        </div>

        <div className="flex flex-col">
          <Badge variant="pink" className="self-start mb-3 sm:mb-4 uppercase tracking-wider text-xs">{product.category}</Badge>
          <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-2 sm:mb-3 leading-tight">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} fill={i < Math.round(product.rating || 0) ? "currentColor" : "transparent"} />
              ))}
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground">({product.numReviews || 0} reviews)</span>
          </div>
          
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

      <div className="mt-16 pt-16 border-t border-border">
        <h2 className="text-3xl font-extrabold mb-8">Customer Reviews</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review, idx) => (
                <div key={idx} className="pb-8 border-b border-border last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold">{review.name || review.user?.name || 'Anonymous User'}</p>
                    <p className="text-sm text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex text-amber-400 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "transparent"} />
                    ))}
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-sm">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
            )}
          </div>

          <div className="bg-accent/30 p-6 sm:p-8 rounded-3xl border border-border">
            <h3 className="text-xl font-bold mb-6">Write a Review</h3>
            {user ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Rating</label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map((star) => (
                      <button 
                        key={star} 
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-1 transition-colors ${rating >= star ? 'text-amber-400' : 'text-border'}`}
                      >
                        <Star size={24} fill="currentColor" />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Comment</label>
                  <Textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    rows={4}
                    placeholder="Share your thoughts about this product..."
                  />
                </div>
                
                {reviewMessage && (
                  <div className={`p-3 rounded-xl text-sm font-medium ${reviewMessage.includes('success') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                    {reviewMessage}
                  </div>
                )}
                
                <Button type="submit" variant="secondary" disabled={reviewLoading} className="w-full sm:w-auto">
                  {reviewLoading ? 'Submitting...' : 'Submit Review'}
                </Button>
              </form>
            ) : (
              <p className="text-sm">
                Please <button onClick={() => navigate('/login')} className="font-bold text-brand-pink hover:underline">sign in</button> to write a review.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
