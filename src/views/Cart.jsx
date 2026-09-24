import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const Cart = () => {
  const { cart, loading: cartLoading, updateCartItem, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);

  const cartItems = cart?.items || [];
  const subtotal = cart?.totalPrice || 0;
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleUpdateQuantity = async (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;
    await updateCartItem(productId, newQuantity);
  };

  if (!user) {
    return (
      <div className="py-20 text-center px-4">
        <h2 className="text-2xl font-bold mb-4">Please sign in to view your cart</h2>
        <Button onClick={() => navigate('/login')} variant="secondary">Sign In</Button>
      </div>
    );
  }

  if (cartLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-brand-pink/20 border-t-brand-pink rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-extrabold mb-8">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-xl text-muted-foreground mb-6">Your cart is empty.</p>
          <Button onClick={() => navigate('/')} size="lg" variant="secondary">Start Shopping</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const product = item.product || {};
              return (
                <div key={item._id || product._id} className="flex gap-4 p-4 bg-white rounded-2xl border border-border shadow-sm">
                  <img 
                    src={product.image || 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=200&h=200&fit=crop'} 
                    alt={product.name || item.name}
                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-xl shrink-0"
                  />
                  <div className="flex flex-col flex-1 py-1">
                    <div className="flex justify-between gap-4 mb-2">
                      <h3 className="font-bold text-sm sm:text-base line-clamp-2">{product.name || item.name || 'Product'}</h3>
                      <p className="font-extrabold text-brand-pink whitespace-nowrap">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-auto">Unit Price: ₹{item.price.toFixed(2)}</p>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center border border-border rounded-lg bg-accent/30 overflow-hidden">
                        <button 
                          onClick={() => handleUpdateQuantity(product._id || item.product, item.quantity, -1)}
                          className="px-3 py-1.5 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-3 font-semibold text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(product._id || item.product, item.quantity, 1)}
                          className="px-3 py-1.5 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(product._id || item.product)}
                        className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-brand-charcoal rounded-3xl p-6 text-white sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-3 text-sm text-white/80 mb-6 border-b border-white/10 pb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-white">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="font-semibold text-white">₹{tax.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-extrabold text-brand-pink">₹{total.toFixed(2)}</span>
              </div>
              
              <Button 
                variant="secondary" 
                size="lg" 
                className="w-full flex justify-center gap-2 mb-3"
                onClick={() => { setCheckingOut(true); navigate('/checkout'); }}
                disabled={checkingOut}
              >
                {checkingOut ? 'Processing...' : 'Secure Checkout'} <ArrowRight size={18} />
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                onClick={() => navigate('/')}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
