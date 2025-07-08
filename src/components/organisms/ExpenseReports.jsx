import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

const ExpenseReports = ({ expenses, onClose }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  const monthlyData = useMemo(() => {
    const selectedDate = new Date(selectedMonth + '-01');
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);

    const monthlyExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
    });

    const categoryTotals = monthlyExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    const totalAmount = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    const categoryPercentages = Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
      percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0
    }));

    return {
      expenses: monthlyExpenses,
      categoryTotals,
      categoryPercentages,
      totalAmount,
      totalTransactions: monthlyExpenses.length
    };
  }, [expenses, selectedMonth]);

  const getCategoryColor = (category) => {
    const colors = {
      utilities: '#3b82f6',
      supplies: '#10b981',
      maintenance: '#f59e0b',
      other: '#6b7280'
    };
    return colors[category] || colors.other;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const categoryLabels = {
    utilities: 'Utilities',
    supplies: 'Supplies',
    maintenance: 'Maintenance',
    other: 'Other'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Expense Reports</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Month
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-4 bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="flex items-center">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <ApperIcon name="DollarSign" className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {formatCurrency(monthlyData.totalAmount)}
                  </h3>
                  <p className="text-sm text-gray-600">Total Expenses</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-r from-green-50 to-green-100">
              <div className="flex items-center">
                <div className="p-3 bg-green-500 rounded-lg">
                  <ApperIcon name="Receipt" className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {monthlyData.totalTransactions}
                  </h3>
                  <p className="text-sm text-gray-600">Transactions</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-r from-purple-50 to-purple-100">
              <div className="flex items-center">
                <div className="p-3 bg-purple-500 rounded-lg">
                  <ApperIcon name="TrendingUp" className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {formatCurrency(monthlyData.totalAmount / Math.max(monthlyData.totalTransactions, 1))}
                  </h3>
                  <p className="text-sm text-gray-600">Avg per Transaction</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Expenses by Category
              </h3>
              {monthlyData.categoryPercentages.length > 0 ? (
                <div className="space-y-4">
                  {monthlyData.categoryPercentages.map(({ category, amount, percentage }) => (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded mr-3"
                          style={{ backgroundColor: getCategoryColor(category) }}
                        />
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {categoryLabels[category]}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(amount)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No expenses found for the selected month
                </p>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Transactions
              </h3>
              {monthlyData.expenses.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {monthlyData.expenses.slice(0, 10).map(expense => (
                    <div key={expense.Id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {expense.description}
                        </div>
                        <div className="text-xs text-gray-500">
                          {expense.vendor} • {format(new Date(expense.date), 'MMM dd')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(expense.amount)}
                        </div>
                        <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${
                          expense.category === 'utilities' ? 'bg-blue-100 text-blue-800' :
                          expense.category === 'supplies' ? 'bg-green-100 text-green-800' :
                          expense.category === 'maintenance' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {expense.category}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No transactions found for the selected month
                </p>
              )}
            </Card>
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ExpenseReports;