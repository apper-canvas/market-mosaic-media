import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';

const MainFeature = () => {
  const [shoppingCart, setShoppingCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState('standard');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  // Icons
  const ShoppingCartIcon = getIcon('ShoppingCart');
  const TrashIcon = getIcon('Trash2');
  const MinusIcon = getIcon('Minus');
  const PlusIcon = getIcon('Plus');
  const ArrowLeftIcon = getIcon('ArrowLeft');
  const TagIcon = getIcon('Tag');
  const CheckIcon = getIcon('Check');
  const TruckIcon = getIcon('Truck');
  const ZapIcon = getIcon('Zap');
  const ShieldIcon = getIcon('Shield');
  const CreditCardIcon = getIcon('CreditCard');

  // Sample products
  const recommendedProducts = [
    {
      id: 101,
      name: 'Premium Headphones',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 102,
      name: 'Fitness Tracker Watch',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 103,
      name: 'Wireless Charger',
      price: 34.99,
      image: 'https://images.unsplash.com/photo-1636139264482-bbda80499838?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 104,
      name: 'Smart Speaker',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    }
  ];

  // Delivery options
  const deliveryOptions = [
    { id: 'standard', name: 'Standard Delivery', price: 4.99, estimate: '3-5 business days', icon: 'Truck' },
    { id: 'express', name: 'Express Delivery', price: 9.99, estimate: '1-2 business days', icon: 'Zap' },
    { id: 'pickup', name: 'Store Pickup', price: 0, estimate: 'Available tomorrow', icon: 'Store' }
  ];

  // Promo codes
  const promoCodes = {
    'WELCOME20': { discount: 0.2, message: '20% off your order' },
    'FREESHIP': { discount: 0, shipping: true, message: 'Free shipping' },
    'SUMMER10': { discount: 0.1, message: '10% off your order' }
  };

  useEffect(() => {
    calculateSubtotal();
  }, [shoppingCart, promoDiscount]);

  const calculateSubtotal = () => {
    const itemsTotal = shoppingCart.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    // Apply promo discount
    const discountedTotal = itemsTotal * (1 - promoDiscount);
    
    setSubtotal(discountedTotal);
  };

  const addToCart = (product) => {
    setShoppingCart(prevCart => {
      // Check if product already in cart
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        // Update quantity
        return prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // Add new item
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    
    toast.success(`Added ${product.name} to your cart!`);
  };

  const removeFromCart = (productId) => {
    setShoppingCart(prevCart => prevCart.filter(item => item.id !== productId));
    toast.info("Item removed from cart");
  };

  const updateQuantity = (productId, change) => {
    setShoppingCart(prevCart => 
      prevCart.map(item => {
        if (item.id === productId) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
    if (isCheckingOut) {
      setIsCheckingOut(false);
    }
  };

  const startCheckout = () => {
    if (shoppingCart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setIsCheckingOut(true);
  };

  const applyPromoCode = () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a promo code");
      return;
    }

    setIsApplyingPromo(true);

    // Simulate API call
    setTimeout(() => {
      const promo = promoCodes[promoCode.toUpperCase()];
      
      if (promo) {
        setPromoDiscount(promo.discount || 0);
        toast.success(`Applied: ${promo.message}`);
      } else {
        toast.error("Invalid promo code");
      }
      
      setIsApplyingPromo(false);
    }, 800);
  };

  const handleCheckout = () => {
    toast.success("Order placed successfully! Thank you for shopping with us.");
    setShoppingCart([]);
    setIsCartOpen(false);
    setIsCheckingOut(false);
    setPromoCode('');
    setPromoDiscount(0);
  };

  const getDeliveryPrice = () => {
    const option = deliveryOptions.find(opt => opt.id === deliveryOption);
    return option ? option.price : 0;
  };

  const getTotal = () => {
    return subtotal + getDeliveryPrice();
  };

  return (
    <section className="container mx-auto px-4 py-12 mb-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Your Shopping Cart</h2>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Recommended Products */}
          <div className="w-full lg:w-2/3">
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-6">Recommended Products</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {recommendedProducts.map(product => (
                  <motion.div
                    key={product.id}
                    whileHover={{ y: -5 }}
                    className="card overflow-hidden group"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <button
                        onClick={() => addToCart(product)}
                        className="absolute inset-0 flex items-center justify-center bg-primary/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <span className="bg-white rounded-full p-2">
                          <ShoppingCartIcon className="w-5 h-5 text-primary" />
                        </span>
                      </button>
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-sm mb-2 truncate">{product.name}</h4>
                      <div className="flex justify-between items-center">
                        <span className="font-bold">${product.price.toFixed(2)}</span>
                        <button
                          onClick={() => addToCart(product)}
                          className="text-primary hover:text-primary-dark text-sm font-medium"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Shopping Cart */}
          <div className="w-full lg:w-1/3">
            <div className="card p-6 relative">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Shopping Cart</h3>
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm font-medium">
                  {shoppingCart.reduce((total, item) => total + item.quantity, 0)} items
                </span>
              </div>

              <AnimatePresence mode="wait">
                {isCheckingOut ? (
                  <motion.div
                    key="checkout"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <button 
                      onClick={() => setIsCheckingOut(false)}
                      className="inline-flex items-center text-sm text-primary font-medium mb-4"
                    >
                      <ArrowLeftIcon className="w-4 h-4 mr-1" />
                      Back to cart
                    </button>

                    <div className="space-y-6">
                      {/* Delivery Options */}
                      <div>
                        <h4 className="font-medium mb-3">Delivery Method</h4>
                        <div className="space-y-3">
                          {deliveryOptions.map(option => {
                            const DeliveryIcon = getIcon(option.icon);
                            return (
                              <label 
                                key={option.id}
                                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors
                                  ${deliveryOption === option.id ? 
                                    'border-primary bg-primary/5' : 
                                    'border-surface-200 dark:border-surface-700'}`}
                              >
                                <input
                                  type="radio"
                                  name="delivery"
                                  value={option.id}
                                  checked={deliveryOption === option.id}
                                  onChange={() => setDeliveryOption(option.id)}
                                  className="sr-only"
                                />
                                <span className={`w-5 h-5 flex-shrink-0 rounded-full border ${
                                  deliveryOption === option.id ? 
                                    'border-primary bg-primary' : 
                                    'border-surface-300 dark:border-surface-600'
                                }`}>
                                  {deliveryOption === option.id && (
                                    <span className="w-full h-full flex items-center justify-center">
                                      <CheckIcon className="w-3 h-3 text-white" />
                                    </span>
                                  )}
                                </span>
                                <div className="ml-3 flex-grow">
                                  <span className="flex items-center">
                                    <DeliveryIcon className="w-4 h-4 mr-1 text-primary" />
                                    <span className="font-medium">{option.name}</span>
                                  </span>
                                  <div className="flex justify-between text-sm mt-1">
                                    <span className="text-surface-500">{option.estimate}</span>
                                    <span>{option.price === 0 ? 'Free' : `$${option.price.toFixed(2)}`}</span>
                                  </div>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      {/* Promo Code */}
                      <div>
                        <h4 className="font-medium mb-3">Promo Code</h4>
                        <div className="flex">
                          <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <TagIcon className="w-4 h-4 text-surface-400" />
                            </div>
                            <input
                              type="text"
                              value={promoCode}
                              onChange={(e) => setPromoCode(e.target.value)}
                              placeholder="Enter code"
                              className="input pl-10"
                            />
                          </div>
                          <button
                            onClick={applyPromoCode}
                            disabled={isApplyingPromo}
                            className="btn btn-primary ml-2 whitespace-nowrap"
                          >
                            {isApplyingPromo ? 'Applying...' : 'Apply'}
                          </button>
                        </div>
                        <div className="text-xs text-surface-500 mt-2">
                          Try: WELCOME20, FREESHIP, or SUMMER10
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="border-t border-surface-200 dark:border-surface-700 pt-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-surface-600 dark:text-surface-400">Subtotal</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-surface-600 dark:text-surface-400">Shipping</span>
                          <span>{getDeliveryPrice() === 0 ? 'Free' : `$${getDeliveryPrice().toFixed(2)}`}</span>
                        </div>
                        {promoDiscount > 0 && (
                          <div className="flex justify-between text-primary">
                            <span>Discount</span>
                            <span>-${(subtotal / (1 - promoDiscount) * promoDiscount).toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold text-lg pt-2 border-t border-surface-200 dark:border-surface-700">
                          <span>Total</span>
                          <span>${getTotal().toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Payment */}
                      <div>
                        <h4 className="font-medium mb-3 flex items-center">
                          <CreditCardIcon className="w-4 h-4 mr-1" />
                          Payment Method
                        </h4>
                        <div className="p-4 bg-surface-100 dark:bg-surface-800 rounded-lg">
                          <div className="mb-3 flex justify-between items-center">
                            <span className="font-medium">Credit Card</span>
                            <div className="flex space-x-1">
                              {['visa', 'mastercard', 'amex'].map(card => (
                                <span 
                                  key={card} 
                                  className="w-8 h-5 bg-surface-200 dark:bg-surface-700 rounded"
                                ></span>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-3">
                            <input
                              type="text"
                              placeholder="Card Number"
                              className="input"
                            />
                            <div className="grid grid-cols-2 gap-3">
                              <input
                                type="text"
                                placeholder="MM/YY"
                                className="input"
                              />
                              <input
                                type="text"
                                placeholder="CVC"
                                className="input"
                              />
                            </div>
                          </div>
                          <div className="mt-4 flex items-center text-xs text-surface-500">
                            <ShieldIcon className="w-3 h-3 mr-1" />
                            <span>Your payment information is securely encrypted</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleCheckout}
                        className="btn btn-primary w-full py-3"
                      >
                        Complete Order
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="cart"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {shoppingCart.length > 0 ? (
                      <>
                        <div className="overflow-y-auto max-h-64 space-y-4 mb-6">
                          {shoppingCart.map(item => (
                            <div 
                              key={item.id}
                              className="flex items-start py-3 border-b border-surface-200 dark:border-surface-700 last:border-0"
                            >
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div className="ml-4 flex-grow">
                                <h4 className="font-medium">{item.name}</h4>
                                <div className="flex justify-between items-center mt-2">
                                  <div className="flex items-center border rounded">
                                    <button 
                                      onClick={() => updateQuantity(item.id, -1)}
                                      className="px-2 py-1 text-surface-500 hover:text-surface-700"
                                    >
                                      <MinusIcon className="w-4 h-4" />
                                    </button>
                                    <span className="px-3 py-1 font-medium">{item.quantity}</span>
                                    <button 
                                      onClick={() => updateQuantity(item.id, 1)}
                                      className="px-2 py-1 text-surface-500 hover:text-surface-700"
                                    >
                                      <PlusIcon className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                              </div>
                              <button 
                                onClick={() => removeFromCart(item.id)}
                                className="p-1 text-surface-500 hover:text-secondary"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                        
                        <div className="border-t border-surface-200 dark:border-surface-700 pt-4 pb-6">
                          <div className="flex justify-between mb-2">
                            <span className="text-surface-600 dark:text-surface-400">Subtotal</span>
                            <span className="font-medium">${subtotal.toFixed(2)}</span>
                          </div>
                          <div className="text-sm text-surface-500 mb-4">
                            Taxes and shipping calculated at checkout
                          </div>
                          <button
                            onClick={startCheckout}
                            className="btn btn-primary w-full py-3"
                          >
                            Proceed to Checkout
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <ShoppingCartIcon className="w-16 h-16 mx-auto text-surface-300 dark:text-surface-600 mb-4" />
                        <h4 className="text-lg font-medium mb-2">Your cart is empty</h4>
                        <p className="text-surface-500 mb-6">Looks like you haven't added anything to your cart yet</p>
                        <button
                          onClick={toggleCart}
                          className="btn btn-outline"
                        >
                          Continue Shopping
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainFeature;