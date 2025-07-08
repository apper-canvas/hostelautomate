import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import RoomGrid from '@/components/organisms/RoomGrid';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import roomService from '@/services/api/roomService';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [filter, setFilter] = useState('all');

  const loadRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await roomService.getAll();
      setRooms(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
  };

  const handleStatusChange = async (roomId, newStatus) => {
    try {
      const updatedRoom = await roomService.update(roomId, { status: newStatus });
      setRooms(prevRooms => 
        prevRooms.map(room => 
          room.id === roomId ? updatedRoom : room
        )
      );
      toast.success(`Room ${updatedRoom.roomNumber} status updated to ${newStatus}`);
      setSelectedRoom(updatedRoom);
    } catch (err) {
      toast.error('Failed to update room status');
    }
  };

  const filteredRooms = rooms.filter(room => {
    if (filter === 'all') return true;
    return room.status === filter;
  });

  const statusCounts = {
    all: rooms.length,
    available: rooms.filter(r => r.status === 'available').length,
    occupied: rooms.filter(r => r.status === 'occupied').length,
    maintenance: rooms.filter(r => r.status === 'maintenance').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rooms</h1>
          <p className="text-gray-600">Manage hostel rooms and bed assignments</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Room
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { key: 'all', label: 'All Rooms', count: statusCounts.all },
          { key: 'available', label: 'Available', count: statusCounts.available },
          { key: 'occupied', label: 'Occupied', count: statusCounts.occupied },
          { key: 'maintenance', label: 'Maintenance', count: statusCounts.maintenance },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              filter === tab.key
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Room Grid */}
        <div className="lg:col-span-2">
          <RoomGrid
            rooms={filteredRooms}
            loading={loading}
            error={error}
            onRoomClick={handleRoomClick}
            onRetry={loadRooms}
          />
        </div>

        {/* Room Details Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <Card.Header>
              <Card.Title>Room Details</Card.Title>
            </Card.Header>
            <Card.Content>
              {selectedRoom ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedRoom.roomNumber}
                    </h3>
                    <Badge variant={selectedRoom.status}>
                      {selectedRoom.status}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <ApperIcon name="Building" className="w-4 h-4 mr-2" />
                      <span>Floor {selectedRoom.floor}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ApperIcon name="Users" className="w-4 h-4 mr-2" />
                      <span>{selectedRoom.currentOccupancy}/{selectedRoom.capacity} occupied</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ApperIcon name="Bed" className="w-4 h-4 mr-2" />
                      <span>{selectedRoom.type}</span>
                    </div>
                  </div>

                  {selectedRoom.beds && selectedRoom.beds.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Beds</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedRoom.beds.map((bed) => (
                          <div
                            key={bed.id}
                            className={`p-2 rounded-lg text-center text-sm font-medium ${
                              bed.isOccupied 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {bed.bedNumber}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
                    <div className="space-y-2">
                      {selectedRoom.status !== 'available' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(selectedRoom.id, 'available')}
                          className="w-full"
                        >
                          <ApperIcon name="Check" className="w-4 h-4 mr-2" />
                          Mark Available
                        </Button>
                      )}
                      {selectedRoom.status !== 'occupied' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(selectedRoom.id, 'occupied')}
                          className="w-full"
                        >
                          <ApperIcon name="User" className="w-4 h-4 mr-2" />
                          Mark Occupied
                        </Button>
                      )}
                      {selectedRoom.status !== 'maintenance' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(selectedRoom.id, 'maintenance')}
                          className="w-full"
                        >
                          <ApperIcon name="Wrench" className="w-4 h-4 mr-2" />
                          Mark Maintenance
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center py-8">
                  <ApperIcon name="Home" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Select a room to view details</p>
                </div>
              )}
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Rooms;