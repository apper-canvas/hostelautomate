import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ResidentList from '@/components/organisms/ResidentList';
import Button from '@/components/atoms/Button';
import SearchInput from '@/components/atoms/SearchInput';
import ApperIcon from '@/components/ApperIcon';
import residentService from '@/services/api/residentService';

const Residents = () => {
  const [residents, setResidents] = useState([]);
  const [filteredResidents, setFilteredResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadResidents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await residentService.getAll();
      setResidents(data);
      setFilteredResidents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResidents();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredResidents(residents);
    } else {
      const filtered = residents.filter(resident =>
        resident.name.toLowerCase().includes(query.toLowerCase()) ||
        resident.email.toLowerCase().includes(query.toLowerCase()) ||
        resident.phone.includes(query) ||
        resident.roomId.toString().includes(query)
      );
      setFilteredResidents(filtered);
    }
  };

  const handleEdit = (resident) => {
    toast.info(`Edit functionality for ${resident.name} would be implemented here`);
  };

  const handleDelete = async (resident) => {
    if (window.confirm(`Are you sure you want to remove ${resident.name}?`)) {
      try {
        await residentService.delete(resident.id);
        setResidents(prev => prev.filter(r => r.id !== resident.id));
        setFilteredResidents(prev => prev.filter(r => r.id !== resident.id));
        toast.success(`${resident.name} has been removed successfully`);
      } catch (err) {
        toast.error('Failed to remove resident');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Residents</h1>
          <p className="text-gray-600">Manage hostel residents and their information</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <ApperIcon name="UserPlus" className="w-4 h-4 mr-2" />
          Add Resident
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchInput
            placeholder="Search residents by name, email, phone, or room..."
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

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="Users" className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Residents</p>
              <p className="text-lg font-semibold text-gray-900">{residents.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="Check" className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Payments Up to Date</p>
              <p className="text-lg font-semibold text-gray-900">
                {residents.filter(r => r.paymentStatus === 'paid').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="Clock" className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Payments</p>
              <p className="text-lg font-semibold text-gray-900">
                {residents.filter(r => r.paymentStatus === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="AlertCircle" className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Overdue Payments</p>
              <p className="text-lg font-semibold text-gray-900">
                {residents.filter(r => r.paymentStatus === 'overdue').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Residents List */}
      <ResidentList
        residents={filteredResidents}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRetry={loadResidents}
      />
    </div>
  );
};

export default Residents;