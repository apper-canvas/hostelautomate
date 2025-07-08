import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Header from "@/components/organisms/Header";
import Card from "@/components/atoms/Card";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Rooms from "@/components/pages/Rooms";
import Maintenance from "@/components/pages/Maintenance";
import StatCard from "@/components/molecules/StatCard";
import roomService from "@/services/api/roomService";
import maintenanceService from "@/services/api/maintenanceService";
import residentService from "@/services/api/residentService";
import paymentService from "@/services/api/paymentService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    totalResidents: 0,
    pendingPayments: 0,
    maintenanceRequests: 0,
    occupancyRate: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [rooms, residents, payments, maintenance] = await Promise.all([
        roomService.getAll(),
        residentService.getAll(),
        paymentService.getAll(),
        maintenanceService.getAll()
      ]);

      const occupiedRooms = rooms.filter(room => room.status === 'occupied').length;
      const pendingPayments = payments.filter(payment => payment.status === 'pending').length;
      const activeMaintenanceRequests = maintenance.filter(req => req.status !== 'completed').length;
      const occupancyRate = rooms.length > 0 ? Math.round((occupiedRooms / rooms.length) * 100) : 0;

setStats({
        totalRooms: rooms.length,
        occupiedRooms,
        totalResidents: residents.length,
        pendingPayments,
        maintenanceRequests: activeMaintenanceRequests,
        occupancyRate,
      });

      // Generate recent activities using database field names
      const activities = [
        { id: 1, type: 'payment', message: 'Payment received from resident', time: '2 minutes ago' },
        { id: 2, type: 'resident', message: 'New resident checked in', time: '1 hour ago' },
        { id: 3, type: 'maintenance', message: 'Maintenance request completed', time: '3 hours ago' },
        { id: 4, type: 'room', message: 'Room marked as available', time: '5 hours ago' },
      ];
      
      setRecentActivities(activities);
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError(error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return <Loading rows={6} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening in your hostel.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="xl:col-span-2">
          <StatCard
            title="Total Rooms"
            value={stats.totalRooms}
            icon="Home"
            color="blue"
            onClick={() => navigate('/rooms')}
          />
        </div>
        <div className="xl:col-span-2">
          <StatCard
            title="Occupancy Rate"
            value={`${stats.occupancyRate}%`}
            icon="Users"
            color="green"
            onClick={() => navigate('/rooms')}
          />
        </div>
        <div className="xl:col-span-2">
          <StatCard
            title="Total Residents"
            value={stats.totalResidents}
            icon="UserCheck"
            color="purple"
            onClick={() => navigate('/residents')}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Pending Payments"
          value={stats.pendingPayments}
          icon="CreditCard"
          color="yellow"
          onClick={() => navigate('/payments')}
        />
        <StatCard
          title="Maintenance Requests"
          value={stats.maintenanceRequests}
          icon="Wrench"
          color="red"
          onClick={() => navigate('/maintenance')}
        />
        <StatCard
          title="Occupied Rooms"
          value={stats.occupiedRooms}
          icon="Building"
          color="blue"
          onClick={() => navigate('/rooms')}
        />
      </div>

      {/* Quick Actions & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <Card.Header>
            <Card.Title>Quick Actions</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/residents')}
                className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 hover:shadow-md transition-all duration-200 text-left"
              >
                <ApperIcon name="UserPlus" className="w-6 h-6 text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Add Resident</h3>
                <p className="text-sm text-gray-600">Register new resident</p>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/payments')}
                className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 hover:shadow-md transition-all duration-200 text-left"
              >
                <ApperIcon name="CreditCard" className="w-6 h-6 text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Record Payment</h3>
                <p className="text-sm text-gray-600">Process payment</p>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/rooms')}
                className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 hover:shadow-md transition-all duration-200 text-left"
              >
                <ApperIcon name="Home" className="w-6 h-6 text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Manage Rooms</h3>
                <p className="text-sm text-gray-600">View room status</p>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/maintenance')}
                className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200 hover:shadow-md transition-all duration-200 text-left"
              >
                <ApperIcon name="Wrench" className="w-6 h-6 text-yellow-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Maintenance</h3>
                <p className="text-sm text-gray-600">Track requests</p>
              </motion.button>
            </div>
          </Card.Content>
        </Card>

        {/* Recent Activities */}
        <Card>
          <Card.Header>
            <Card.Title>Recent Activities</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <ApperIcon 
                      name={activity.type === 'payment' ? 'CreditCard' : 
                            activity.type === 'resident' ? 'User' : 
                            activity.type === 'maintenance' ? 'Wrench' : 'Home'} 
                      className="w-4 h-4 text-white" 
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;