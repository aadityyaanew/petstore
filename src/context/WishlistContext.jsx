/* eslint-disable react-refresh/only-export-components */
'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('poonch_wishlist');
      if (saved) setWishlist(JSON.parse(saved));
    } catch (e) {
      console.error('Error loading wishlist', e);
    }
  }, []);

  const saveWishlist = (items) => {
    setWishlist(items);
    try {
      localStorage.setItem('poonch_wishlist', JSON.stringify(items));
    } catch (e) {
      console.error('Error saving wishlist', e);
    }
  };

  const toggleWishlist = (product) => {
    const id = product.id || product._id;
    const exists = wishlist.some((item) => (item.id || item._id) === id);
    if (exists) {
      saveWishlist(wishlist.filter((item) => (item.id || item._id) !== id));
    } else {
      saveWishlist([...wishlist, product]);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item.id || item._id) === productId);
  };

  const count = wishlist.length;

  return (
    <WishlistContext.Provider value={{ wishlist, count, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
