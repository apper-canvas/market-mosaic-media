import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  itemCount: 0,
  total: 0
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const existingItemIndex = state.items.findIndex(item => item.product_id === action.payload.id);
      
      if (existingItemIndex >= 0) {
        // Item already exists, update quantity
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        
        return {
          ...state,
          items: updatedItems,
          itemCount: state.itemCount + 1,
          total: state.total + action.payload.price
        };
      } else {
        // Add new item
        const newItem = { 
          product_id: action.payload.id,
          Name: action.payload.name,
          price: action.payload.price,
          quantity: 1,
          image: action.payload.image
        };
        return {
          ...state,
          items: [...state.items, newItem],
          itemCount: state.itemCount + 1,
          total: state.total + action.payload.price
        };
      }
    },
    
    removeItem: (state, action) => {
      const existingItem = state.items.find(item => item.product_id === action.payload);
      if (!existingItem) return state;
      
      return {
        ...state,
        items: state.items.filter(item => item.product_id !== action.payload),
        itemCount: state.itemCount - existingItem.quantity,
        total: state.total - (existingItem.price * existingItem.quantity)
      };
    },
    
    updateQuantity: (state, action) => {
      const { id, change } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.product_id === id);
      
      if (existingItemIndex >= 0) {
        const item = state.items[existingItemIndex];
        const newQuantity = Math.max(1, item.quantity + change);
        const quantityDifference = newQuantity - item.quantity;
        
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = { ...item, quantity: newQuantity };
        
        return {
          ...state,
          items: updatedItems,
          itemCount: state.itemCount + quantityDifference,
          total: state.total + (quantityDifference * item.price)
        };
      }
      return state;
    },
    setCartItems: (state, action) => {
      const items = action.payload;
      const itemCount = items.reduce((total, item) => total + item.quantity, 0);
      const total = items.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      return {
        items,
        itemCount,
        total
      };
    },
    clearCart: () => initialState
  }
});

export const { addItem, removeItem, updateQuantity, setCartItems, clearCart } = cartSlice.actions;
export default cartSlice.reducer;