/**
 * Service for cart item operations
 */

// Constants for table name and fields
const CART_ITEM_TABLE = 'cart_item';
const UPDATEABLE_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'product_id',
  'price',
  'quantity',
  'image'
];

// Get cart items for the current user
export const getCartItems = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        'Id',
        'Name',
        'Tags',
        'Owner',
        'product_id',
        'price',
        'quantity',
        'image'
      ]
    };

    const response = await apperClient.fetchRecords(CART_ITEM_TABLE, params);
    
    if (!response || !response.data) {
      return [];
    }
    
    // Transform the response to match the expected cart item format in the UI
    return response.data.map(item => ({
      id: item.Id,
      product_id: item.product_id,
      name: item.Name,
      price: item.price,
      quantity: item.quantity,
      image: item.image
    }));
  } catch (error) {
    console.error('Error fetching cart items:', error);
    throw error;
  }
};

// Add item to cart
export const addToCart = async (product, quantity = 1) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Check if the item is already in the cart
    const existingItems = await getCartItems();
    const existingItem = existingItems.find(item => item.product_id === product.id);

    if (existingItem) {
      // Update quantity of existing item
      return await updateCartItemQuantity(existingItem.id, existingItem.quantity + quantity);
    } else {
      // Create new cart item
      const params = {
        records: [
          {
            Name: product.name,
            product_id: product.id,
            price: product.price,
            quantity: quantity,
            image: product.image
          }
        ]
      };

      const response = await apperClient.createRecord(CART_ITEM_TABLE, params);
      
      if (!response || !response.success) {
        throw new Error('Failed to add item to cart');
      }
      
      return response.results[0].data;
    }
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
};

// Update cart item quantity
export const updateCartItemQuantity = async (itemId, newQuantity) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [
        {
          Id: itemId,
          quantity: newQuantity
        }
      ]
    };

    const response = await apperClient.updateRecord(CART_ITEM_TABLE, params);
    
    if (!response || !response.success) {
      throw new Error('Failed to update cart item');
    }
    
    return response.results[0].data;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

// Remove item from cart
export const removeFromCart = async (itemId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.deleteRecord(CART_ITEM_TABLE, { RecordIds: [itemId] });
    
    return response && response.success;
  } catch (error) {
    console.error('Error removing item from cart:', error);
    throw error;
  }
};