import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import MaintenanceList from "@/components/organisms/MaintenanceList";
import Button from "@/components/atoms/Button";
import SearchInput from "@/components/atoms/SearchInput";
import maintenanceService from "@/services/api/maintenanceService";

const Maintenance = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await maintenanceService.getAll();
      setRequests(data);
      setFilteredRequests(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    applyFilters(query, filter);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    applyFilters(searchQuery, newFilter);
  };

  const applyFilters = (query, statusFilter) => {
    let filtered = [...requests];

if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    if (query) {
      filtered = filtered.filter(request =>
        request.description?.toLowerCase().includes(query.toLowerCase()) ||
        request.room_id?.toString().includes(query) ||
        request.priority?.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  };

  const handleStatusChange = async (request) => {
    const statusOptions = ['pending', 'in-progress', 'completed'];
const currentIndex = statusOptions.indexOf(request.status);
    const nextStatus = statusOptions[(currentIndex + 1) % statusOptions.length];
    
    try {
      const updatedRequest = await maintenanceService.update(request.Id, {
        status: nextStatus,
        resolved_at: nextStatus === 'completed' ? new Date().toISOString() : null
      });
      setRequests(prev => prev.map(r => r.Id === request.Id ? updatedRequest : r));
      applyFilters(searchQuery, filter);
      toast.success(`Request status updated to ${nextStatus}`);
    } catch (err) {
      toast.error('Failed to update request status');
    }
  };

const handleDelete = async (request) => {
    if (window.confirm('Are you sure you want to delete this maintenance request?')) {
      try {
        await maintenanceService.delete(request.Id);
        setRequests(prev => prev.filter(r => r.Id !== request.Id));
        applyFilters(searchQuery, filter);
        toast.success('Maintenance request deleted successfully');
      } catch (err) {
        toast.error('Failed to delete maintenance request');
      }
    }
  };

  const statusCounts = {
    all: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    'in-progress': requests.filter(r => r.status === 'in-progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
  };

  const priorityCounts = {
    high: requests.filter(r => r.priority === 'high').length,
    medium: requests.filter(r => r.priority === 'medium').length,
    low: requests.filter(r => r.priority === 'low').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maintenance</h1>
          <p className="text-gray-600">Manage maintenance requests and repairs</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Request
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="Wrench" className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-lg font-semibold text-gray-900">{requests.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="Clock" className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-lg font-semibold text-gray-900">{statusCounts.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="Settings" className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-lg font-semibold text-gray-900">{statusCounts['in-progress']}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="AlertTriangle" className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">High Priority</p>
              <p className="text-lg font-semibold text-gray-900">{priorityCounts.high}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchInput
            placeholder="Search by description, room, or priority..."
            onSearch={handleSearch}
            className="w-full"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <ApperIcon name="Filter" className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <ApperIcon name="Download" className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { key: 'all', label: 'All', count: statusCounts.all },
          { key: 'pending', label: 'Pending', count: statusCounts.pending },
          { key: 'in-progress', label: 'In Progress', count: statusCounts['in-progress'] },
          { key: 'completed', label: 'Completed', count: statusCounts.completed },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleFilterChange(tab.key)}
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

      {/* Maintenance List */}
      <MaintenanceList
        requests={filteredRequests}
        loading={loading}
        error={error}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        onRetry={loadRequests}
      />
    </div>
  );
};

export default Maintenance;