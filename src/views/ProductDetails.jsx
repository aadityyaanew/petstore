import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import ProductCard, { getProductImageUrl } from '../components/ProductCard';
import { Minus, Plus, ShoppingCart, Truck, ShieldCheck, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Star, Package, RefreshCw } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState('');
  
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Review states
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewSubmitLoading, setReviewSubmitLoading] = useState(false);
  const [reviewSubmitError, setReviewSubmitError] = useState('');

  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.getProductById(id);
        setProduct(res.data);
        if (res.data.variants && res.data.variants.length > 0) {
          setSelectedVariant(res.data.variants[0]);
        }
        
        // Fetch recommended products from the same category
        try {
          const recRes = await api.getProducts({ category: res.data.category, limit: 5 });
          setRecommendations(recRes.data.products.filter(p => p._id !== res.data._id).slice(0, 4));
        } catch (e) { console.error('Failed to load recommendations', e); }

      } catch (error) {
        console.error('Failed to fetch product details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
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

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewSubmitError('');
    if (rating === 0) return setReviewSubmitError('Please select a star rating.');
    if (!comment.trim()) return setReviewSubmitError('Please enter a comment.');
    
    setReviewSubmitLoading(true);
    try {
      await api.addReview(product._id, { rating, comment });
      setShowReviewForm(false);
      setRating(0);
      setComment('');
      // refresh product details to show new review
      const res = await api.getProductById(id);
      setProduct(res.data);
    } catch (err) {
      setReviewSubmitError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewSubmitLoading(false);
    }
  };

  const getRatingPercentage = (star) => {
    if (!product?.reviews || product.reviews.length === 0) return '0%';
    const count = product.reviews.filter((r) => Math.round(r.rating) === star).length;
    return `${(count / product.reviews.length) * 100}%`;
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 bg-gray-50/30 space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 bg-white p-6 md:p-10 rounded-3xl border border-border shadow-sm">
        <div className="flex flex-col gap-4">
          <Skeleton className="w-full aspect-square rounded-2xl" />
          <div className="grid grid-cols-5 gap-3">
            {Array.from({length: 5}).map((_, i) => <Skeleton key={i} className="aspect-square rounded-xl" />)}
          </div>
        </div>
        <div className="flex flex-col space-y-6">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-10 w-1/4" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
  if (!product) return <div className="text-center py-20 text-xl font-bold">Product not found</div>;

  const hasReviewed = user && product.reviews?.some((r) => {
    if (!r.user) return false;
    const reviewerId = typeof r.user === 'object' 
      ? (r.user._id?.toString() || r.user.id?.toString()) 
      : r.user.toString();
    const currentUserId = user._id?.toString() || user.id?.toString();
    return reviewerId && currentUserId && reviewerId === currentUserId;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 bg-gray-50/30">
      
      {/* ── Product Hero Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-12 sm:mb-16 bg-white p-6 md:p-10 rounded-3xl border border-border shadow-sm">
        
        {/* Images Area */}
        <div className="flex flex-col gap-4">
          <div className="bg-gray-50 rounded-2xl border border-border flex items-center justify-center aspect-square overflow-hidden relative">
            <img 
              src={getProductImageUrl(product)} 
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
            {product.isFeatured && <Badge variant="pink" className="absolute top-4 left-4 shadow-md">Featured</Badge>}
            {product.isNewArrival && <Badge className="absolute top-4 right-4 bg-black shadow-md">New Arrival</Badge>}
          </div>
          {/* Thumbnails if > 1 image */}
          {product.images?.length > 1 && (
            <div className="grid grid-cols-5 gap-3">
              {product.images.map((img, i) => (
                <div key={i} className="aspect-square bg-gray-50 rounded-xl border border-border overflow-hidden cursor-pointer hover:border-brand-pink">
                  <img src={typeof img === 'object' ? img.url : img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info Area */}
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <Badge variant="outline" className="uppercase tracking-wider text-xs bg-gray-100">{product.category} {product.subCategory && ` / ${product.subCategory}`}</Badge>
            {product.rating > 0 && (
              <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
                <Star size={16} fill="currentColor" />
                {product.rating.toFixed(1)} <span className="text-muted-foreground font-normal">({product.numReviews})</span>
              </div>
            )}
          </div>
          
          <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-4xl font-extrabold text-foreground mb-2 leading-tight">
            {product.name}
          </h1>
          
          <p className="text-sm text-muted-foreground font-medium mb-4">By <span className="font-bold text-gray-800">{product.brand || 'PetStore'}</span> • SKU: {product.sku || 'N/A'}</p>
          
          <div className="flex items-end gap-3 mb-4">
            <p className="text-3xl sm:text-4xl font-extrabold text-brand-pink">
              ₹{selectedVariant?.price || product.price.toFixed(2)}
            </p>
            {product.originalPrice > product.price && (
              <p className="text-lg text-muted-foreground line-through font-semibold pb-1">₹{product.originalPrice.toFixed(2)}</p>
            )}
          </div>
          
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6">
            {product.shortDescription || product.description?.substring(0, 150) + '...'}
          </p>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-bold text-gray-900 mb-2">Options</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${selectedVariant?.name === v.name ? 'border-brand-pink bg-brand-pink/5 text-brand-pink shadow-sm' : 'border-border text-gray-600 hover:border-gray-400'}`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Highlights */}
          {product.highlights && product.highlights.length > 0 && (
            <ul className="mb-6 space-y-2">
              {product.highlights.map((hlt, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                  <span>{hlt}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Stock Status */}
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

          {/* Add to Cart Actions */}
          <div className="mb-6 sm:mb-8 flex flex-wrap gap-4">
            <div className="inline-flex items-center border border-border rounded-full overflow-hidden bg-white shadow-sm h-12">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={product.stock === 0}
                className="px-4 h-full hover:bg-accent disabled:opacity-50 transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <Minus size={16} />
              </button>
              <span className="px-2 font-bold min-w-[2.5rem] text-center text-sm">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                disabled={quantity >= product.stock || product.stock === 0}
                className="px-4 h-full hover:bg-accent disabled:opacity-50 transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <Plus size={16} />
              </button>
            </div>

            <Button
              variant="secondary"
              size="lg"
              className="flex-1 min-w-[200px] h-12 text-base gap-3 rounded-full cursor-pointer shadow-md active:scale-95 transition-all bg-black hover:bg-neutral-800 text-white"
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock === 0}
            >
              <ShoppingCart size={18} />
              {product.stock === 0 ? 'Out of Stock' : addingToCart ? 'Adding...' : `Add to Cart — ₹${(product.price * quantity).toFixed(2)}`}
            </Button>
          </div>

          {cartMessage && (
            <div className="mb-6 inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-green-700 bg-green-50 px-3.5 py-1.5 rounded-full border border-green-200">
              <CheckCircle2 size={16} />
              <span>{cartMessage}</span>
            </div>
          )}

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-4 mt-auto pt-6 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Truck size={18} />
              </div>
              <div>
                <span className="font-bold text-sm block">Shipping</span>
                <span className="text-xs text-muted-foreground">{product.shipping?.freeShipping ? 'Free Delivery' : `₹${product.shipping?.shippingCharge} Charge`}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                <RefreshCw size={18} />
              </div>
              <div>
                <span className="font-bold text-sm block">Returns</span>
                <span className="text-xs text-muted-foreground">{product.returnPolicy?.returnable ? `${product.returnPolicy?.returnWindowDays} Days Window` : 'Non-returnable'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs for Detailed Info ── */}
      <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden mb-16">
        <div className="flex overflow-x-auto border-b border-border hide-scrollbar">
          {['description', 'specs', 'care', 'faqs'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 font-bold text-sm whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? 'border-b-2 border-brand-pink text-brand-pink bg-brand-pink/5' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-gray-50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="p-6 md:p-10">
          
          {/* Description Tab */}
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <h3 className="text-xl font-bold mb-4">Product Overview</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{product.description}</p>
            </div>
          )}

          {/* Specs Tab */}
          {activeTab === 'specs' && (
            <div>
              <h3 className="text-xl font-bold mb-6">Technical Specifications</h3>
              {product.specs && product.specs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                  {product.specs.map((spec, idx) => (
                    <div key={idx} className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-500 font-medium">{spec.key}</span>
                      <span className="text-gray-900 font-bold text-right">{spec.value}</span>
                    </div>
                  ))}
                  {/* Default Specs injected */}
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Weight</span>
                    <span className="text-gray-900 font-bold text-right">{product.shipping?.weight ? `${product.shipping.weight} ${product.shipping.weightUnit}` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Pet Type</span>
                    <span className="text-gray-900 font-bold text-right capitalize">{product.petType}</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No specifications provided.</p>
              )}
            </div>
          )}

          {/* Care & Feeding Tab */}
          {activeTab === 'care' && (
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><ShieldCheck size={20} className="text-blue-500"/> Care Instructions</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{product.care || 'No specific care instructions provided.'}</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Package size={20} className="text-green-500"/> Feeding/Usage Instructions</h3>
                {product.feedingInstructions?.description ? (
                  <div className="space-y-3">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{product.feedingInstructions.description}</p>
                    <div className="flex gap-4 mt-4">
                      {product.feedingInstructions.recommendedAge && <Badge variant="outline">Age: {product.feedingInstructions.recommendedAge}</Badge>}
                      {product.feedingInstructions.waterRequired && <Badge variant="outline" className="text-blue-600 bg-blue-50">Water Required</Badge>}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No usage instructions provided.</p>
                )}
              </div>
            </div>
          )}

          {/* FAQs Tab */}
          {activeTab === 'faqs' && (
            <div>
              <h3 className="text-xl font-bold mb-6">Frequently Asked Questions</h3>
              {product.faqs && product.faqs.length > 0 ? (
                <div className="space-y-4 max-w-3xl">
                  {product.faqs.map((faq, idx) => (
                    <div key={idx} className="border border-border rounded-xl overflow-hidden bg-gray-50">
                      <button 
                        onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                        className="w-full flex items-center justify-between p-4 text-left font-bold text-gray-900 hover:bg-gray-100 transition-colors"
                      >
                        <span>{faq.question}</span>
                        {expandedFaq === idx ? <ChevronUp size={18} className="text-brand-pink"/> : <ChevronDown size={18} className="text-gray-400"/>}
                      </button>
                      {expandedFaq === idx && (
                        <div className="p-4 pt-0 text-gray-700 text-sm">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No FAQs available for this product.</p>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ── Reviews Section (Moved below tabs) ── */}
      <div className="bg-white rounded-3xl border border-border shadow-sm p-6 md:p-10 mb-16">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-extrabold">Customer Reviews</h3>
          {!hasReviewed && (
            <Button 
              variant="outline" 
              className="rounded-full shadow-sm"
              onClick={() => {
                if (!user) navigate('/login');
                else setShowReviewForm(!showReviewForm);
              }}
            >
              {showReviewForm ? 'Cancel Review' : 'Write a Review'}
            </Button>
          )}
        </div>

        {showReviewForm && !hasReviewed && (
          <form onSubmit={handleSubmitReview} className="bg-gray-50 p-6 rounded-2xl border border-border mb-8">
            <h4 className="font-bold mb-4">Submit Your Review</h4>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star
                      size={28}
                      className={star <= rating ? "text-amber-500 fill-amber-500" : "text-gray-300"}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                className="w-full border border-border rounded-lg p-3 bg-white text-sm min-h-[100px] outline-none focus:border-brand-pink"
                placeholder="Share your experience with this product..."
              ></textarea>
            </div>
            
            {reviewSubmitError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 flex items-start gap-2 text-red-700 text-sm font-semibold">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{reviewSubmitError}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={reviewSubmitLoading}
              className="rounded-full bg-brand-pink text-white hover:bg-brand-pink/90"
            >
              {reviewSubmitLoading ? 'Submitting...' : 'Submit Review'}
            </Button>
          </form>
        )}
        
        <div className="grid md:grid-cols-[300px_1fr] gap-10">
          {/* Rating Overview */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-border h-fit">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-5xl font-extrabold text-gray-900">{product.rating ? product.rating.toFixed(1) : '0.0'}</div>
              <div>
                <div className="flex text-amber-500 mb-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={18} fill={i < Math.round(product.rating || 0) ? "currentColor" : "none"} />)}
                </div>
                <p className="text-sm font-semibold text-gray-500">{product.numReviews} Ratings & Reviews</p>
              </div>
            </div>
            
            {/* Rating Bars - Dynamic */}
            <div className="space-y-2">
              {[5,4,3,2,1].map(star => (
                <div key={star} className="flex items-center gap-3 text-sm">
                  <span className="font-bold text-gray-600 w-3">{star}</span>
                  <Star size={12} className="text-gray-400" fill="currentColor"/>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${star >= 4 ? 'bg-green-500' : star === 3 ? 'bg-amber-500' : 'bg-red-500'}`} 
                      style={{ width: getRatingPercentage(star) }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Review List */}
          <div className="space-y-6">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review, idx) => (
                <div key={idx} className="border-b border-border pb-6 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-pink/10 text-brand-pink font-bold uppercase">
                      {review.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{review.name}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex text-amber-500">
                          {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />)}
                        </div>
                        <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                          <CheckCircle2 size={12} className="text-green-500"/> Verified Buyer
                        </span>
                      </div>
                    </div>
                    <span className="ml-auto text-xs font-semibold text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-700 text-sm mt-3">{review.comment}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-border">
                <p className="text-gray-500 font-medium mb-4">No reviews yet for this product.</p>
                {!hasReviewed && (
                  <Button 
                    variant="outline" 
                    className="rounded-full shadow-sm"
                    onClick={() => {
                      if (!user) navigate('/login');
                      else setShowReviewForm(true);
                    }}
                  >
                    Be the first to review
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Recommendations ── */}
      {recommendations.length > 0 && (
        <div>
          <h2 className="text-2xl font-extrabold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {recommendations.map(rec => (
              <ProductCard key={rec._id} product={rec} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetails;
