/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ items: [], totalPrice: 0 });
      setLoading(false);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await api.getCart();
      setCart(res.data || { items: [], totalPrice: 0 });
    } catch (error) {
      console.error('Failed to fetch cart', error);
      // Empty cart heavily suggests creating a new structure if 404
      setCart({ items: [], totalPrice: 0 });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!user) throw new Error('Must be logged in to add to cart');
    await api.addToCart(productId, quantity);
    await fetchCart();
  };

  const updateCartItem = async (productId, quantity) => {
    await api.updateCartItem(productId, quantity);
    await fetchCart();
  };

  const removeFromCart = async (productId) => {
    await api.removeFromCart(productId);
    await fetchCart();
  };

  const emptyCart = async () => {
    await api.emptyCart();
    setCart({ items: [], totalPrice: 0 });
  };

  const value = { cart, loading, fetchCart, addToCart, updateCartItem, removeFromCart, emptyCart };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
