import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify'; 
import { useDispatch, useSelector } from 'react-redux';
import MainFeature from '../components/MainFeature';
import { getIcon } from '../utils/iconUtils'; 
import { addItem } from '../store/cartSlice';
import { getProducts } from '../services/productService';
import { addToCart } from '../services/cartItemService';

const Home = ({ isCartOpen, setIsCartOpen }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Redux
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.user.user);

  const categories = [
    { id: 'all', name: 'All Products', icon: 'ShoppingBag', image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { id: 'electronics', name: 'Electronics', icon: 'Smartphone', image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { id: 'clothing', name: 'Clothing', icon: 'Shirt', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { id: 'books', name: 'Books', icon: 'BookOpen', image: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { id: 'home', name: 'Home & Kitchen', icon: 'Lamp', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { id: 'beauty', name: 'Beauty', icon: 'Sparkles', image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' }
  ];

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  // Load products from the database when the category changes
  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const categoryToFetch = selectedCategory === 'all' ? null : selectedCategory;
      const loadedProducts = await getProducts(categoryToFetch);
      setProducts(loadedProducts);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading products:', error);
      setError('Failed to load products. Please try again.');
      setIsLoading(false);
      toast.error('Failed to load products');
    }
  }, [selectedCategory]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Debounced search function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const handleSearch = useCallback(
    debounce((term) => {
      setIsSearching(false);
    }, 300),
    []
  );

  useEffect(() => {
    // Simulate loading data from API
  }, [selectedCategory]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
      return;
    }

    setIsSearching(true);
    handleSearch(searchTerm);

    const term = searchTerm.toLowerCase().trim();
    const results = products.filter(
      product => 
        product.name.toLowerCase().includes(term) || 
        product.description.toLowerCase().includes(term)
    );
    
    setFilteredProducts(results);
  }, [searchTerm, products, handleSearch]);

  const handleSearchInputChange = (e) => {
    setIsSearching(true);
    setError(null);
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFilteredProducts(products);
  };

  const SearchIcon = getIcon('Search');
  const XIcon = getIcon('X');

  const handleAddToCart = useCallback(async (product) => {
    try {
      // First add to backend database
      await addToCart(product);
      
      // Then update UI state through Redux
      dispatch(addItem(product));
      
      // Show success message
      toast.success(`Added ${product.name} to your cart!`);
    } catch (error) {
      toast.error(`Failed to add ${product.name} to cart: ${error.message}`);
    }  
  }, [dispatch]);
  

  const CategoryIcon = (iconName) => {
    const Icon = getIcon(iconName);
    return <Icon className="w-5 h-5 mr-2" />;
  };

  const StarIcon = getIcon('Star');
  const StarHalfIcon = getIcon('StarHalf');
  const ShoppingCartIcon = getIcon('ShoppingCart');

  const renderRatingStars = (rating) => {
    // Safety check - if rating is undefined, return empty array
    if (rating === undefined || rating === null) {
      return [];
    }
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={`star-${i}`} className="w-4 h-4 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalfIcon key="half-star" className="w-4 h-4 text-yellow-400" />);
    }

    return stars;
  };

  return (
    <>
      {/* Cart Dropdown */}
      {isCartOpen && (
        <CartDropdown 
          items={cartItems} 
          total={cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)} 
          itemCount={cartItems.length}
          onClose={() => setIsCartOpen(false)}
          onViewCart={() => {
            setIsCartOpen(false);
            navigate('/cart');
          }}
        />
      )}
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary py-16 md:py-24">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grid)" />
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              Discover Amazing Products at MarketMosaic
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-white/90 mb-8"
            >
              Shop our curated collection of high-quality products across multiple categories. From electronics to fashion, find everything you need in one place.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <a href="#products" className="btn btn-accent text-surface-800 font-semibold px-8 py-3 rounded-full inline-flex items-center">
                Shop Now
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <div id="products" className="container mx-auto px-4 py-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Browse Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {categories.map(category => {
            const Icon = getIcon(category.icon);
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`relative flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 overflow-hidden h-32 group
                  ${selectedCategory === category.id 
                    ? 'ring-4 ring-primary shadow-soft' 
                    : 'bg-white dark:bg-surface-800 shadow-card hover:shadow-soft dark:shadow-none dark:border dark:border-surface-700'}`}
              >
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className={`absolute inset-0 ${
                  selectedCategory === category.id 
                    ? 'bg-primary/70' 
                    : 'bg-surface-900/50 group-hover:bg-surface-900/30'
                  } transition-colors duration-200`}></div>
                <div className="relative z-10 flex flex-col items-center text-white">
                  <Icon className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium">{category.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Listings */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h2 className="text-2xl md:text-3xl font-bold whitespace-nowrap">
            {selectedCategory === 'all' && searchTerm === '' ? 'Featured Products' : 
              searchTerm !== '' ? `Search Results for "${searchTerm}"` :
              `${categories.find(c => c.id === selectedCategory)?.name}`}
          </h2>
          <div className="relative w-full md:w-auto md:min-w-[300px]">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon className="w-5 h-5 text-surface-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={handleSearchInputChange}
              className="input pl-10 pr-10 py-2 w-full"
            />
            {searchTerm && (
              <button className="absolute inset-y-0 right-0 flex items-center pr-3 text-surface-400 hover:text-surface-600" onClick={clearSearch}>
                <XIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
            <button onClick={loadProducts} className="underline mt-2">Retry</button>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="card animate-pulse">
                <div className="h-48 bg-surface-200 dark:bg-surface-700"></div>
                <div className="p-4">
                  <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 relative"
            >
              {isSearching && (
                <div className="col-span-full text-center py-16">
                  <div className="text-surface-500 text-lg mb-4">Searching...</div>
                </div>
              )}

              {!isSearching && filteredProducts.length === 0 && !searchTerm && (
                <div className="col-span-full text-center py-16">
                  <div className="text-surface-500 text-lg mb-4">No products found in this category</div>
                  <button 
                    onClick={() => setSelectedCategory('all')}
                    className="btn btn-outline"
                  >
                    View all products
                  </button>
                </div>
              )}

              {!isSearching && searchTerm && filteredProducts.length === 0 && (
                <div className="col-span-full text-center py-16">
                  <div className="text-surface-500 text-lg mb-4">No products found matching "{searchTerm}"</div>
                  <button onClick={clearSearch} className="btn btn-outline">Clear Search</button>
                </div>
              )}
              
              {!isSearching && filteredProducts.length > 0 && filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }} 
                  className="card group hover:shadow-lg dark:hover:border-primary transition-all duration-300"
                >
                  <div className="relative overflow-hidden h-48">
                    <img 
                      src={product.image || ""}
                      alt={product.name || "Product"}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="btn btn-primary rounded-full p-2">
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      {renderRatingStars(product.rating)}
                      <span className="text-sm text-surface-500 ml-1">({product.rating || "N/A"})</span>
                    </div>
                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{product.name || "Unnamed Product"}</h3>
                    <p className="text-sm text-surface-600 dark:text-surface-400 mb-3 line-clamp-2">{product.description || "No description available"}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg">${(product.price || 0).toFixed(2)}</span>
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="btn btn-primary text-xs py-1.5 px-3"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Main Feature Section */}
      <MainFeature />
    </div>
  );
};

// Cart Dropdown Component
const CartDropdown = ({ items, total, itemCount, onClose, onViewCart }) => {
  const XIcon = getIcon('X');
  
  return (
    <div className="absolute right-4 top-16 mt-2 w-72 bg-white dark:bg-surface-800 rounded-xl shadow-lg overflow-hidden z-50 border border-surface-200 dark:border-surface-700">
      <div className="p-4 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
        <h3 className="font-medium">Your Cart ({itemCount})</h3>
        <button 
          onClick={onClose} 
          className="text-surface-500 hover:text-surface-700"
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>
      
      <div className="max-h-80 overflow-y-auto">
        {items.length === 0 ? (
          <div className="p-4 text-center text-surface-500">
            Your cart is empty
          </div>
        ) : (
          <div>
            {items.map(item => (
              <div key={item.id} className="p-3 border-b border-surface-200 dark:border-surface-700 flex">
                <img 
                  src={item.image} 
                  alt={item.Name} 
                  className="w-14 h-14 object-cover rounded"
                />
                <div className="ml-3 flex-grow">
                  <div className="font-medium">{item.Name}</div>
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
          <span className="font-bold">${total.toFixed(2)}</span>
        </div>
        <button className="btn btn-primary w-full" onClick={onViewCart}>
          View Cart & Checkout
        </button>
      </div>
    </div>
  );
};

export default Home;