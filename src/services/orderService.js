/**
 * Service for order-related operations
 */

// Constants for table name and fields
const ORDER_TABLE = 'order';
const UPDATEABLE_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'subtotal',
  'delivery_option',
  'delivery_price',
  'promo_code',
  'discount',
  'total'
];

// Get orders for the current user
export const getOrders = async () => {
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
        'CreatedOn',
        'subtotal',
        'delivery_option',
        'delivery_price',
        'promo_code',
        'discount',
        'total'
      ]
    };

    const response = await apperClient.fetchRecords(ORDER_TABLE, params);
    
    if (!response || !response.data) {
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Create a new order
export const createOrder = async (orderData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Ensure order has a name
    if (!orderData.Name) {
      orderData.Name = `Order-${new Date().toISOString()}`;
    }

    // Prepare order record with only updateable fields
    const orderRecord = {};
    UPDATEABLE_FIELDS.forEach(field => {
      if (orderData[field] !== undefined) {
        orderRecord[field] = orderData[field];
      }
    });

    const params = {
      records: [orderRecord]
    };

    const response = await apperClient.createRecord(ORDER_TABLE, params);
    
    if (!response || !response.success) {
      throw new Error('Failed to create order');
    }
    
    return response.results[0].data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Add more order-related functions as needed (getOrderById, updateOrder, etc.)