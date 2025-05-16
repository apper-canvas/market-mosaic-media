import { useEffect, useState, createContext, useReducer, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import { getIcon } from './utils/iconUtils';

// Cart context
export const CartContext = createContext();

// Initial cart state
const initialCartState = {
  items: [],
  itemCount: 0,
  total: 0
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      
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
        const newItem = { ...action.payload, quantity: 1 };
        return {
          ...state,
          items: [...state.items, newItem],
          itemCount: state.itemCount + 1,
          total: state.total + action.payload.price
        };
      }
    }
    
    case 'REMOVE_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload);
      if (!existingItem) return state;
      
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        itemCount: state.itemCount - existingItem.quantity,
        total: state.total - (existingItem.price * existingItem.quantity)
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { id, change } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === id);
      
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
    }
    
    default:
      return state;
  }
};

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [cartState, dispatch] = useReducer(cartReducer, initialCartState);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Cart context value
  const cartContextValue = {
    ...cartState,
    dispatch
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };
  
  // Icons
  const ShoppingCartIcon = getIcon('ShoppingCart');
  const XIcon = getIcon('X');

  return (
    <CartContext.Provider value={cartContextValue}>
      <>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen"
        >
          <div className="absolute top-4 right-4 z-10 flex items-center">
            <div className="relative mr-3">
              <button 
                onClick={toggleCart}
                className="btn btn-primary mr-3 py-2 flex items-center"
              >
                Add to Cart <ShoppingCartIcon className="h-5 w-5 ml-2" />
              </button>
              <button
                onClick={toggleCart}
                className="p-2 rounded-full bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors relative"
                aria-label="Shopping cart"
              >
                <ShoppingCartIcon className="h-6 w-6 text-surface-700 dark:text-surface-300" />
                {cartState.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartState.itemCount}
                  </span>
                )}
              </button>
              
              {/* Cart Dropdown */}
              {isCartOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-surface-800 rounded-xl shadow-lg overflow-hidden z-50 border border-surface-200 dark:border-surface-700">
                  <div className="p-4 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
                    <h3 className="font-medium">Your Cart ({cartState.itemCount})</h3>
                    <button 
                      onClick={toggleCart} 
                      className="text-surface-500 hover:text-surface-700"
                    >
                      <XIcon className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
                    {cartState.items.length === 0 ? (
                      <div className="p-4 text-center text-surface-500">
                        Your cart is empty
                      </div>
                    ) : (
                      <div>
                        {cartState.items.map(item => (
                          <div key={item.id} className="p-3 border-b border-surface-200 dark:border-surface-700 flex">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-14 h-14 object-cover rounded"
                            />
                            <div className="ml-3 flex-grow">
                              <div className="font-medium">{item.name}</div>
                              <div className="flex justify-between mt-1">
                                <div className="text-sm">{item.quantity} × ${item.price.toFixed(2)}</div>
                                <div className="font-semibold">${(item.quantity * item.price).toFixed(2)}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 border-t border-surface-200 dark:border-surface-700">
                    <div className="flex justify-between mb-4">
                      <span>Total:</span>
                      <span className="font-bold">${cartState.total.toFixed(2)}</span>
                    </div>
                    <button className="btn btn-primary w-full" onClick={() => setIsCartOpen(false)}>
                      View Cart & Checkout
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-surface-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={darkMode ? 'dark' : 'light'}
        />
      </>
    </CartContext.Provider>
  );
};

export default App;