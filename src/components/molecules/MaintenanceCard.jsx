import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import { format } from 'date-fns';

const MaintenanceCard = ({ request, onStatusChange, onDelete, className }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return 'Clock';
      case 'in-progress': return 'Wrench';
      case 'completed': return 'Check';
      default: return 'Clock';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 ${className}`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
              <ApperIcon name={getStatusIcon(request.status)} className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Room {request.roomId}</h3>
              <p className="text-sm text-gray-600">
                Created {format(new Date(request.createdAt), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={request.priority}>
              {request.priority}
            </Badge>
            <Badge variant={request.status}>
              {request.status}
            </Badge>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-700">{request.description}</p>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="User" className="w-4 h-4 mr-2" />
            <span>Resident ID: {request.residentId}</span>
          </div>
          <div className="flex items-center text-sm">
            <ApperIcon name="Flag" className="w-4 h-4 mr-2" />
            <span className={getPriorityColor(request.priority)}>
              {request.priority.toUpperCase()} Priority
            </span>
          </div>
          {request.resolvedAt && (
            <div className="flex items-center text-sm text-gray-600">
              <ApperIcon name="CheckCircle" className="w-4 h-4 mr-2" />
              <span>Resolved: {format(new Date(request.resolvedAt), 'MMM dd, yyyy')}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-600">
            ID: {request.id}
          </div>
          <div className="flex space-x-2">
            {request.status !== 'completed' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusChange?.(request)}
              >
                <ApperIcon name="Edit" className="w-4 h-4 mr-1" />
                Update
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete?.(request)}
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MaintenanceCard;