import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

const NotFound = () => {
  const HomeIcon = getIcon('Home');
  const ShoppingBagIcon = getIcon('ShoppingBag');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mb-8"
      >
        <div className="relative">
          <div className="text-9xl font-bold text-primary opacity-20">404</div>
          <ShoppingBagIcon className="absolute inset-0 m-auto w-16 h-16 text-primary" />
          <div className="absolute -bottom-5 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
        </div>
      </motion.div>

      <h1 className="text-3xl md:text-4xl font-bold mb-4">Page Not Found</h1>
      
      <p className="text-surface-600 dark:text-surface-400 max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved. 
        Let's get you back to shopping!
      </p>
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link 
          to="/" 
          className="btn btn-primary inline-flex items-center px-6 py-3 rounded-full"
        >
          <HomeIcon className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default NotFound;