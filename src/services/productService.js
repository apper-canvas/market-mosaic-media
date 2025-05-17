/**
 * Service for product-related operations
 */

// Constants for table names and fields
const PRODUCT_TABLE = 'product';
const UPDATEABLE_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'description',
  'price',
  'category',
  'rating',
  'image'
];

// Get all products with optional filtering
export const getProducts = async (categoryFilter = null) => {
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
        'CreatedBy',
        'ModifiedOn',
        'ModifiedBy',
        'description',
        'price',
        'category',
        'rating',
        'image'
      ]
    };

    // Add category filter if provided and not 'all'
    if (categoryFilter && categoryFilter !== 'all') {
      params.where = [
        {
          fieldName: 'category',
          operator: 'ExactMatch',
          values: [categoryFilter]
        }
      ];
    }

    const response = await apperClient.fetchRecords(PRODUCT_TABLE, params);
    
    if (!response || !response.data) {
      return [];
    }
    
    // Transform the response to match the expected product format in the UI
    return response.data.map(product => ({
      id: product.Id,
      name: product.Name,
      price: product.price,
      category: product.category,
      rating: product.rating,
      image: product.image,
      description: product.description,
      tags: product.Tags
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Get product by ID
export const getProductById = async (productId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.getRecordById(PRODUCT_TABLE, productId);
    
    if (!response || !response.data) {
      return null;
    }
    
    const product = response.data;
    
    // Transform the response to match the expected product format in the UI
    return {
      id: product.Id,
      name: product.Name,
      price: product.price,
      category: product.category,
      rating: product.rating,
      image: product.image,
      description: product.description,
      tags: product.Tags
    };
  } catch (error) {
    console.error(`Error fetching product with ID ${productId}:`, error);
    throw error;
  }
};

// Add more product-related functions as needed (createProduct, updateProduct, deleteProduct)