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
                <div key={item._id || product._id} className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-2xl border border-border shadow-sm">
                  <img 
                    src={product.image || '/assets/asset-058339ca.jpeg'} 
                    alt={product.name || item.name}
                    className="w-20 h-20 sm:w-28 sm:h-28 object-cover rounded-xl shrink-0"
                  />
                  <div className="flex flex-col flex-1 py-0.5 min-w-0">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="font-bold text-xs xs:text-sm sm:text-base line-clamp-2 text-gray-900 leading-snug">
                        {product.name || item.name || 'Product'}
                      </h3>
                      <p className="font-extrabold text-sm sm:text-base text-brand-pink whitespace-nowrap">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <p className="text-[11px] sm:text-xs text-muted-foreground mb-auto">
                      Unit: ${item.price.toFixed(2)}
                    </p>
                    
                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                      <div className="flex items-center border border-border rounded-lg bg-accent/30 overflow-hidden">
                        <button 
                          onClick={() => handleUpdateQuantity(product._id || item.product, item.quantity, -1)}
                          className="px-2.5 py-1 sm:px-3 sm:py-1.5 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-2 sm:px-3 font-semibold text-xs sm:text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(product._id || item.product, item.quantity, 1)}
                          className="px-2.5 py-1 sm:px-3 sm:py-1.5 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(product._id || item.product)}
                        className="text-red-500 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-neutral-900 rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-white sticky top-24 shadow-md">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Order Summary</h2>
              
              <div className="space-y-3 text-xs sm:text-sm text-white/80 mb-5 sm:mb-6 border-b border-white/10 pb-5 sm:pb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-white">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="font-semibold text-white">${tax.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-5 sm:mb-6">
                <span className="text-base sm:text-lg font-bold">Total</span>
                <span className="text-xl sm:text-2xl font-extrabold text-[#E050D0]">${total.toFixed(2)}</span>
              </div>
              
              <Button 
                variant="secondary" 
                size="lg" 
                className="w-full flex justify-center gap-2 mb-3 py-3 rounded-full font-bold cursor-pointer"
                onClick={() => { setCheckingOut(true); navigate('/checkout'); }}
                disabled={checkingOut}
              >
                {checkingOut ? 'Processing...' : 'Secure Checkout'} <ArrowRight size={16} />
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent rounded-full py-3 text-xs font-semibold cursor-pointer"
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
