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
  const [inspections, setInspections] = useState([]);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);

const loadRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await roomService.getAll();
      setRooms(data);
      
      // Load inspections for rooms
      const mockInspections = [
        { Id: 1, roomId: 1, date: '2024-01-15', status: 'scheduled', checklist: [
          { id: 1, item: 'Check bed frames', completed: false },
          { id: 2, item: 'Inspect electrical outlets', completed: false },
          { id: 3, item: 'Test water fixtures', completed: false },
          { id: 4, item: 'Check walls for damage', completed: false }
        ]},
        { Id: 2, roomId: 2, date: '2024-01-10', status: 'completed', checklist: [
          { id: 1, item: 'Check bed frames', completed: true },
          { id: 2, item: 'Inspect electrical outlets', completed: true },
          { id: 3, item: 'Test water fixtures', completed: false },
          { id: 4, item: 'Check walls for damage', completed: true }
        ]}
      ];
      setInspections(mockInspections);
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

  const scheduleInspection = async (roomId, date) => {
    try {
      const newInspection = {
        Id: Date.now(),
        roomId,
        date,
        status: 'scheduled',
        checklist: [
          { id: 1, item: 'Check bed frames', completed: false },
          { id: 2, item: 'Inspect electrical outlets', completed: false },
          { id: 3, item: 'Test water fixtures', completed: false },
          { id: 4, item: 'Check walls for damage', completed: false },
          { id: 5, item: 'Check door locks', completed: false },
          { id: 6, item: 'Inspect windows', completed: false }
        ]
      };
      setInspections(prev => [...prev, newInspection]);
      toast.success('Inspection scheduled successfully');
      setShowCalendar(false);
    } catch (err) {
      toast.error('Failed to schedule inspection');
    }
  };

  const updateChecklistItem = async (inspectionId, itemId, completed) => {
    try {
      setInspections(prev => prev.map(inspection => 
        inspection.Id === inspectionId 
          ? {
              ...inspection,
              checklist: inspection.checklist.map(item =>
                item.id === itemId ? { ...item, completed } : item
              )
            }
          : inspection
      ));
      toast.success('Checklist updated');
    } catch (err) {
      toast.error('Failed to update checklist');
    }
  };

  const completeInspection = async (inspectionId) => {
    try {
      setInspections(prev => prev.map(inspection => 
        inspection.Id === inspectionId 
          ? { ...inspection, status: 'completed' }
          : inspection
      ));
      toast.success('Inspection completed');
      setShowChecklist(false);
    } catch (err) {
      toast.error('Failed to complete inspection');
    }
  };

  const filteredRooms = rooms.filter(room => {
    if (filter === 'all') return true;
    if (filter === 'pending-inspection') {
      return inspections.some(i => i.roomId === room.id && i.status === 'scheduled');
    }
    return room.status === filter;
  });

const statusCounts = {
    all: rooms.length,
    available: rooms.filter(r => r.status === 'available').length,
    occupied: rooms.filter(r => r.status === 'occupied').length,
    maintenance: rooms.filter(r => r.status === 'maintenance').length,
    'pending-inspection': inspections.filter(i => i.status === 'scheduled').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rooms</h1>
          <p className="text-gray-600">Manage hostel rooms and bed assignments</p>
        </div>
<div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setShowCalendar(true)}
            className="text-primary border-primary hover:bg-primary/10"
          >
            <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
            Schedule Inspection
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Room
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg w-fit">
{[
          { key: 'all', label: 'All Rooms', count: statusCounts.all },
          { key: 'available', label: 'Available', count: statusCounts.available },
          { key: 'occupied', label: 'Occupied', count: statusCounts.occupied },
          { key: 'maintenance', label: 'Maintenance', count: statusCounts.maintenance },
          { key: 'pending-inspection', label: 'Pending Inspection', count: statusCounts['pending-inspection'] },
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

{/* Inspection Section */}
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3">Inspections</h4>
                    {inspections.filter(i => i.roomId === selectedRoom.id).map(inspection => (
                      <div key={inspection.Id} className="mb-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            {new Date(inspection.date).toLocaleDateString()}
                          </span>
                          <Badge variant={inspection.status === 'completed' ? 'success' : 'warning'}>
                            {inspection.status}
                          </Badge>
                        </div>
                        {inspection.status === 'scheduled' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedInspection(inspection);
                              setShowChecklist(true);
                            }}
                            className="w-full"
                          >
                            <ApperIcon name="CheckSquare" className="w-4 h-4 mr-2" />
                            Start Inspection
                          </Button>
                        )}
                        {inspection.status === 'completed' && (
                          <div className="text-sm text-gray-600">
                            Completed: {inspection.checklist.filter(i => i.completed).length}/{inspection.checklist.length} items
                          </div>
                        )}
                      </div>
                    ))}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedRoom(selectedRoom);
                        setShowCalendar(true);
                      }}
                      className="w-full mb-3"
                    >
                      <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
                      Schedule Inspection
                    </Button>
                  </div>

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
                  <p className="text-gray-600">Select a room to view details and schedule inspections</p>
                </div>
              )}
            </Card.Content>
          </Card>
        </div>
</div>

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-96 max-w-90vw"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Schedule Inspection</h3>
              <button
                onClick={() => setShowCalendar(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {selectedRoom && (
                <p className="text-sm text-gray-600">
                  Room: {selectedRoom.roomNumber}
                </p>
              )}
              <input
                type="date"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => {
                  if (e.target.value && selectedRoom) {
                    scheduleInspection(selectedRoom.id, e.target.value);
                  }
                }}
              />
            </div>
          </motion.div>
        </div>
      )}

      {/* Checklist Modal */}
      {showChecklist && selectedInspection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-96 max-w-90vw max-h-80vh overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Inspection Checklist</h3>
              <button
                onClick={() => setShowChecklist(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {selectedInspection.checklist.map(item => (
                <div key={item.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={(e) => updateChecklistItem(selectedInspection.Id, item.id, e.target.checked)}
                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span className={`flex-1 text-sm ${item.completed ? 'line-through text-gray-500' : ''}`}>
                    {item.item}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex space-x-2">
              <Button
                onClick={() => completeInspection(selectedInspection.Id)}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Complete Inspection
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowChecklist(false)}
                className="flex-1"
              >
                Save & Continue Later
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Rooms;