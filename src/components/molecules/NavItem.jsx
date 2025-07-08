import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const NavItem = ({ to, icon, children, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group',
          isActive
            ? 'bg-primary text-white shadow-lg'
            : 'text-gray-700 hover:bg-gray-100'
        )
      }
    >
      {({ isActive }) => (
        <motion.div
          whileHover={{ x: 2 }}
          className="flex items-center w-full"
        >
          <ApperIcon 
            name={icon} 
            className={cn(
              'w-5 h-5 mr-3 transition-colors',
              isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
            )}
          />
          {children}
        </motion.div>
      )}
    </NavLink>
  );
};

export default NavItem;