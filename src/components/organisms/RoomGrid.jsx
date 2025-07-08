import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import RoomCard from '@/components/molecules/RoomCard';
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import roomService from '@/services/api/roomService'
import residentService from '@/services/api/residentService'
const RoomGrid = ({ 
  rooms, 
  loading, 
  error, 
  onRoomClick, 
  onRetry,
  className = "",
  bulkMode = false,
  onRoomsUpdated
}) => {
  const [selectedRooms, setSelectedRooms] = useState(new Set());
  const [residents, setResidents] = useState([]);
  const [selectedResident, setSelectedResident] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    if (bulkMode) {
      loadResidents();
    }
  }, [bulkMode]);

  const loadResidents = async () => {
    try {
      const data = await residentService.getAll();
      const unassignedResidents = data.filter(resident => !resident.roomId);
      setResidents(unassignedResidents);
    } catch (err) {
      toast.error('Failed to load residents');
    }
  };

  const handleRoomSelection = (roomId, isSelected) => {
    const newSelection = new Set(selectedRooms);
    if (isSelected) {
      newSelection.add(roomId);
    } else {
      newSelection.delete(roomId);
    }
    setSelectedRooms(newSelection);
  };

  const handleBulkAssign = async () => {
    if (!selectedResident || selectedRooms.size === 0) {
      toast.warning('Please select a resident and at least one room');
      return;
    }

    setIsAssigning(true);
    try {
      await roomService.assignResidentsBulk(Array.from(selectedRooms), selectedResident);
      toast.success(`Successfully assigned resident to ${selectedRooms.size} room(s)`);
      setSelectedRooms(new Set());
      setSelectedResident('');
      onRoomsUpdated?.();
    } catch (err) {
      toast.error(err.message || 'Failed to assign resident to rooms');
    } finally {
      setIsAssigning(false);
    }
  };

  const clearSelection = () => {
    setSelectedRooms(new Set());
    setSelectedResident('');
  };

  const availableRooms = rooms?.filter(room => room.status === 'available') || [];
  if (loading) {
    return <Loading rows={6} showHeader={false} />;
  }

  if (error) {
    return <Error message={error} onRetry={onRetry} />;
  }

  if (!rooms || rooms.length === 0) {
    return (
      <Empty
        title="No rooms found"
        message="There are no rooms configured yet. Add your first room to get started."
        icon="Home"
      />
    );
  }

return (
    <div className="space-y-4">
      {/* Bulk Action Toolbar */}
      {bulkMode && selectedRooms.size > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="flex items-center text-blue-700 font-medium">
                <ApperIcon name="CheckSquare" className="w-5 h-5 mr-2" />
                {selectedRooms.size} room(s) selected
              </div>
              
              <div className="flex items-center gap-2 flex-1 min-w-0 max-w-xs">
                <select
                  value={selectedResident}
                  onChange={(e) => setSelectedResident(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  disabled={isAssigning}
                >
                  <option value="">Select resident...</option>
                  {residents.map(resident => (
                    <option key={resident.Id} value={resident.Id}>
                      {resident.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearSelection}
                disabled={isAssigning}
                className="text-gray-600 hover:text-gray-800"
              >
                <ApperIcon name="X" className="w-4 h-4 mr-1" />
                Clear
              </Button>
              <Button
                size="sm"
                onClick={handleBulkAssign}
                disabled={!selectedResident || isAssigning}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isAssigning ? (
                  <>
                    <ApperIcon name="Loader2" className="w-4 h-4 mr-1 animate-spin" />
                    Assigning...
                  </>
                ) : (
                  <>
                    <ApperIcon name="UserPlus" className="w-4 h-4 mr-1" />
                    Assign Resident
                  </>
                )}
              </Button>
            </div>
          </div>

          {availableRooms.length === 0 && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-center text-yellow-800 text-sm">
                <ApperIcon name="AlertTriangle" className="w-4 h-4 mr-2" />
                No available rooms for assignment
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Room Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${className}`}
      >
        {rooms.map((room, index) => (
          <motion.div
            key={room.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <RoomCard 
              room={room} 
              onClick={onRoomClick}
              isSelectable={bulkMode}
              isSelected={selectedRooms.has(room.Id)}
              onSelectionChange={handleRoomSelection}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default RoomGrid;