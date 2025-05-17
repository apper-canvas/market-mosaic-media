import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import MainFeature from '../components/MainFeature';
import { getIcon } from '../utils/iconUtils'; 
import { CartContext } from '../App';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { dispatch } = useContext(CartContext);

  const categories = [
    { id: 'all', name: 'All Products', icon: 'ShoppingBag', image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { id: 'electronics', name: 'Electronics', icon: 'Smartphone', image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { id: 'clothing', name: 'Clothing', icon: 'Shirt', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { id: 'books', name: 'Books', icon: 'BookOpen', image: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { id: 'home', name: 'Home & Kitchen', icon: 'Lamp', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { id: 'beauty', name: 'Beauty', icon: 'Sparkles', image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' }
  ];

  // Mock products data
  const allProducts = [
    {
      id: 1,
      name: 'Wireless Earbuds',
      price: 89.99,
      category: 'electronics',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      description: 'Premium wireless earbuds with noise cancellation and long battery life'
    },
    {
      id: 2,
      name: 'Casual T-Shirt',
      price: 24.99,
      category: 'clothing',
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      description: 'Comfortable cotton t-shirt for everyday wear'
    },
    {
      id: 3,
      name: 'Science Fiction Novel',
      price: 14.95,
      category: 'books',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      description: 'Bestselling sci-fi novel that takes you to a distant future'
    },
    {
      id: 4,
      name: 'Coffee Maker',
      price: 129.99,
      category: 'home',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      description: 'Modern coffee maker with programmable settings and stylish design'
    },
    {
      id: 5,
      name: 'Facial Serum',
      price: 34.50,
      category: 'beauty',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      description: 'Hydrating serum that nourishes and rejuvenates your skin'
    },
    {
      id: 6,
      name: 'Laptop',
      price: 899.99,
      category: 'electronics',
      rating: 4.4,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      description: 'Powerful laptop for work and entertainment'
    },
    {
      id: 7,
      name: 'Winter Jacket',
      price: 129.95,
      category: 'clothing',
      rating: 4.2,
      image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      description: 'Warm winter jacket with water-resistant exterior'
    },
    {
      id: 8,
      name: 'Smart Watch',
      price: 199.99,
      category: 'electronics',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      description: 'Feature-rich smartwatch with health tracking and notifications'
    }
  ];

  useEffect(() => {
    setFilteredProducts(featuredProducts);
  }, [featuredProducts]);

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
    setIsLoading(true);
    setTimeout(() => {
      if (selectedCategory === 'all') {
        setFeaturedProducts(allProducts);
      } else {
        setFeaturedProducts(allProducts.filter(product => product.category === selectedCategory));
      }
      setIsLoading(false);
    }, 600);
  }, [selectedCategory]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(featuredProducts);
      return;
    }

    setIsSearching(true);
    handleSearch(searchTerm);

    const term = searchTerm.toLowerCase().trim();
    const results = featuredProducts.filter(
      product => 
        product.name.toLowerCase().includes(term) || 
        product.description.toLowerCase().includes(term)
    );
    
    setFilteredProducts(results);
  }, [searchTerm, featuredProducts, handleSearch]);

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFilteredProducts(featuredProducts);
  };

  const SearchIcon = getIcon('Search');
  const XIcon = getIcon('X');

  const addToCart = useCallback((product) => {
    if (dispatch) {
      dispatch({ type: 'ADD_ITEM', payload: product });
      toast.success(`Added ${product.name} to your cart!`);
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold whitespace-nowrap">
            {selectedCategory === 'all' && searchTerm === '' ? 'Featured Products' : 
              searchTerm !== '' ? 'Search Results' :
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
              
              {!isSearching && filteredProducts.length > 0 && filteredProducts.map(product => (
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
                        onClick={() => addToCart(product)}
                        className="bg-white text-surface-800 rounded-full p-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                      >
                        <ShoppingCartIcon className="w-5 h-5" />
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
                          onClick={() => addToCart(product)}
                        className="btn btn-primary text-xs py-1.5 px-3"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
        )}
      </div>

      {/* Main Feature Section */}
      <MainFeature />
    </div>
  );
};

export default Home;