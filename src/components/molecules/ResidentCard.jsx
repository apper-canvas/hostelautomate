import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import { format } from 'date-fns';

const ResidentCard = ({ resident, onEdit, onDelete, className }) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 ${className}`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-4">
              <ApperIcon name="User" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{resident.name}</h3>
              <p className="text-sm text-gray-600">Room {resident.roomId}</p>
            </div>
          </div>
          <Badge variant={resident.paymentStatus}>
            {resident.paymentStatus}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Mail" className="w-4 h-4 mr-2" />
            <span>{resident.email}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Phone" className="w-4 h-4 mr-2" />
            <span>{resident.phone}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
            <span>Check-in: {format(new Date(resident.checkInDate), 'MMM dd, yyyy')}</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Emergency:</span> {resident.emergencyContact?.name || 'Not provided'}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(resident)}
            >
              <ApperIcon name="Edit" className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete?.(resident)}
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResidentCard;