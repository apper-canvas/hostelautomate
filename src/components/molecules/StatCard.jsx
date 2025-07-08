import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  color = 'blue', 
  className,
  onClick 
}) => {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    yellow: 'from-yellow-500 to-yellow-600',
    red: 'from-red-500 to-red-600',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 cursor-pointer',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <ApperIcon 
                name={change > 0 ? "TrendingUp" : "TrendingDown"} 
                className={cn(
                  "w-4 h-4 mr-1",
                  change > 0 ? "text-green-500" : "text-red-500"
                )}
              />
              <span className={cn(
                "text-sm font-medium",
                change > 0 ? "text-green-600" : "text-red-600"
              )}>
                {Math.abs(change)}%
              </span>
            </div>
          )}
        </div>
        <div className={cn(
          'w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center',
          colors[color]
        )}>
          <ApperIcon name={icon} className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;