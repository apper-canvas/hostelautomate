import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import PaymentList from '@/components/organisms/PaymentList';
import Button from '@/components/atoms/Button';
import SearchInput from '@/components/atoms/SearchInput';
import ApperIcon from '@/components/ApperIcon';
import paymentService from '@/services/api/paymentService';
import residentService from '@/services/api/residentService';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [residents, setResidents] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const [paymentsData, residentsData] = await Promise.all([
        paymentService.getAll(),
        residentService.getAll()
      ]);
      setPayments(paymentsData);
      setResidents(residentsData);
      setFilteredPayments(paymentsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
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
    let filtered = [...payments];

    if (statusFilter !== 'all') {
      if (statusFilter === 'overdue') {
        filtered = filtered.filter(payment => 
          payment.status === 'pending' && new Date(payment.dueDate) < new Date()
        );
      } else {
        filtered = filtered.filter(payment => payment.status === statusFilter);
      }
    }

    if (query) {
      filtered = filtered.filter(payment => {
        const resident = residents.find(r => r.id === payment.residentId);
        return (
          resident?.name.toLowerCase().includes(query.toLowerCase()) ||
          payment.period.toLowerCase().includes(query.toLowerCase()) ||
          payment.amount.toString().includes(query)
        );
      });
    }

    setFilteredPayments(filtered);
  };

  const handleMarkPaid = async (payment) => {
    try {
      const updatedPayment = await paymentService.update(payment.id, {
        status: 'paid',
        paidDate: new Date().toISOString(),
        method: 'cash'
      });
      setPayments(prev => prev.map(p => p.id === payment.id ? updatedPayment : p));
      applyFilters(searchQuery, filter);
      toast.success('Payment marked as paid successfully');
    } catch (err) {
      toast.error('Failed to update payment status');
    }
  };

  const handleDelete = async (payment) => {
    if (window.confirm('Are you sure you want to delete this payment record?')) {
      try {
        await paymentService.delete(payment.id);
        setPayments(prev => prev.filter(p => p.id !== payment.id));
        applyFilters(searchQuery, filter);
        toast.success('Payment record deleted successfully');
      } catch (err) {
        toast.error('Failed to delete payment record');
      }
    }
  };

  const statusCounts = {
    all: payments.length,
    pending: payments.filter(p => p.status === 'pending').length,
    paid: payments.filter(p => p.status === 'paid').length,
    overdue: payments.filter(p => p.status === 'pending' && new Date(p.dueDate) < new Date()).length,
  };

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const paidAmount = payments.filter(p => p.status === 'paid').reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = totalAmount - paidAmount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600">Track and manage resident payments</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Payment
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="DollarSign" className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-lg font-semibold text-gray-900">${totalAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="Check" className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Paid Amount</p>
              <p className="text-lg font-semibold text-gray-900">${paidAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="Clock" className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Amount</p>
              <p className="text-lg font-semibold text-gray-900">${pendingAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="AlertCircle" className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-lg font-semibold text-gray-900">{statusCounts.overdue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchInput
            placeholder="Search payments by resident name, period, or amount..."
            onSearch={handleSearch}
            className="w-full"
          />
        </div>
        <div className="flex items-center space-x-2">
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
          { key: 'paid', label: 'Paid', count: statusCounts.paid },
          { key: 'overdue', label: 'Overdue', count: statusCounts.overdue },
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

      {/* Payments List */}
      <PaymentList
        payments={filteredPayments}
        residents={residents}
        loading={loading}
        error={error}
        onMarkPaid={handleMarkPaid}
        onDelete={handleDelete}
        onRetry={loadPayments}
      />
    </div>
  );
};

export default Payments;