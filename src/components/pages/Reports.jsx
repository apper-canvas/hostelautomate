import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import roomService from '@/services/api/roomService';
import residentService from '@/services/api/residentService';
import paymentService from '@/services/api/paymentService';
import maintenanceService from '@/services/api/maintenanceService';

const Reports = () => {
  const [data, setData] = useState({
    rooms: [],
    residents: [],
    payments: [],
    maintenance: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [rooms, residents, payments, maintenance] = await Promise.all([
        roomService.getAll(),
        residentService.getAll(),
        paymentService.getAll(),
        maintenanceService.getAll()
      ]);

      setData({ rooms, residents, payments, maintenance });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <Loading rows={6} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  const { rooms, residents, payments, maintenance } = data;

  // Calculate metrics
  const occupancyRate = rooms.length > 0 ? 
    Math.round((rooms.filter(r => r.status === 'occupied').length / rooms.length) * 100) : 0;
  
  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const pendingRevenue = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  
  const maintenanceStats = {
    total: maintenance.length,
    pending: maintenance.filter(m => m.status === 'pending').length,
    completed: maintenance.filter(m => m.status === 'completed').length,
    high: maintenance.filter(m => m.priority === 'high').length,
  };

  const roomTypeStats = rooms.reduce((acc, room) => {
    acc[room.type] = (acc[room.type] || 0) + 1;
    return acc;
  }, {});

  const paymentStatusStats = payments.reduce((acc, payment) => {
    acc[payment.status] = (acc[payment.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Analytics and insights for your hostel</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <Button variant="outline">
            <ApperIcon name="Download" className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Occupancy Rate</p>
              <p className="text-2xl font-bold text-gray-900">{occupancyRate}%</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Home" className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="DollarSign" className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${pendingRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Residents</p>
              <p className="text-2xl font-bold text-gray-900">{residents.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Room Status Report */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center">
              <ApperIcon name="Home" className="w-5 h-5 mr-2" />
              Room Status Report
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {rooms.filter(r => r.status === 'available').length}
                  </div>
                  <div className="text-sm text-gray-600">Available</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {rooms.filter(r => r.status === 'occupied').length}
                  </div>
                  <div className="text-sm text-gray-600">Occupied</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {rooms.filter(r => r.status === 'maintenance').length}
                  </div>
                  <div className="text-sm text-gray-600">Maintenance</div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Room Types</h4>
                <div className="space-y-2">
                  {Object.entries(roomTypeStats).map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 capitalize">{type}</span>
                      <Badge variant="default">{count}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Payment Report */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center">
              <ApperIcon name="CreditCard" className="w-5 h-5 mr-2" />
              Payment Report
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {paymentStatusStats.paid || 0}
                  </div>
                  <div className="text-sm text-gray-600">Paid</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {paymentStatusStats.pending || 0}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Payment Methods</h4>
                <div className="space-y-2">
                  {['cash', 'card', 'transfer'].map((method) => {
                    const count = payments.filter(p => p.method === method).length;
                    return (
                      <div key={method} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 capitalize">{method}</span>
                        <Badge variant="default">{count}</Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Maintenance Report */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center">
              <ApperIcon name="Wrench" className="w-5 h-5 mr-2" />
              Maintenance Report
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {maintenanceStats.pending}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {maintenanceStats.completed}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {maintenanceStats.high}
                  </div>
                  <div className="text-sm text-gray-600">High Priority</div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Priority Breakdown</h4>
                <div className="space-y-2">
                  {['high', 'medium', 'low'].map((priority) => {
                    const count = maintenance.filter(m => m.priority === priority).length;
                    const variant = priority === 'high' ? 'error' : 
                                  priority === 'medium' ? 'warning' : 'default';
                    return (
                      <div key={priority} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 capitalize">{priority}</span>
                        <Badge variant={variant}>{count}</Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Resident Report */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center">
              <ApperIcon name="Users" className="w-5 h-5 mr-2" />
              Resident Report
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {residents.filter(r => r.paymentStatus === 'paid').length}
                  </div>
                  <div className="text-sm text-gray-600">Up to Date</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {residents.filter(r => r.paymentStatus === 'pending').length}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {residents.filter(r => r.paymentStatus === 'overdue').length}
                  </div>
                  <div className="text-sm text-gray-600">Overdue</div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <ApperIcon name="FileText" className="w-4 h-4 mr-2" />
                    Generate Monthly Report
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <ApperIcon name="Mail" className="w-4 h-4 mr-2" />
                    Send Payment Reminders
                  </Button>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default Reports;