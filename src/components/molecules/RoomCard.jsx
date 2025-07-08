import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import { cn } from '@/utils/cn';

const RoomCard = ({ room, onClick, className, isSelectable, isSelected, onSelectionChange }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 border-green-200';
      case 'occupied': return 'bg-blue-100 border-blue-200';
      case 'maintenance': return 'bg-yellow-100 border-yellow-200';
      default: return 'bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return 'Check';
      case 'occupied': return 'User';
      case 'maintenance': return 'Wrench';
      default: return 'Home';
    }
  };

const handleCardClick = (e) => {
    if (e.target.type === 'checkbox') return;
    onClick?.(room);
  };

  const canBeSelected = isSelectable && room.status === 'available';

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      className={cn(
        'p-4 rounded-lg border cursor-pointer transition-all duration-200 relative',
        getStatusColor(room.status),
        isSelected && 'ring-2 ring-blue-500 ring-offset-2',
        className
      )}
    >
      {isSelectable && (
        <div className="absolute top-3 right-3">
          <input
            type="checkbox"
            checked={isSelected || false}
            onChange={(e) => onSelectionChange?.(room.Id, e.target.checked)}
            disabled={!canBeSelected}
            className={cn(
              'w-4 h-4 rounded border-2 transition-colors',
              canBeSelected 
                ? 'text-blue-600 border-gray-300 focus:ring-blue-500' 
                : 'opacity-50 cursor-not-allowed'
            )}
          />
        </div>
      )}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
            <ApperIcon name={getStatusIcon(room.status)} className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{room.roomNumber}</h3>
            <p className="text-sm text-gray-600">Floor {room.floor}</p>
          </div>
        </div>
        <Badge variant={room.status}>
          {room.status}
        </Badge>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="Users" className="w-4 h-4 mr-2" />
          <span>{room.currentOccupancy}/{room.capacity} occupied</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="Bed" className="w-4 h-4 mr-2" />
          <span>{room.type}</span>
        </div>
      </div>

      {room.beds && room.beds.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-2">
            {room.beds.map((bed) => (
              <div
                key={bed.id}
                className={cn(
                  'flex items-center justify-center p-2 rounded text-xs font-medium',
                  bed.isOccupied 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                )}
              >
                {bed.bedNumber}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RoomCard;