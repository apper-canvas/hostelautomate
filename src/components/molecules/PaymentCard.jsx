import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import { format } from 'date-fns';

const PaymentCard = ({ payment, resident, onMarkPaid, onDelete, className }) => {
  const isOverdue = payment.status === 'pending' && new Date(payment.dueDate) < new Date();

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 ${className}`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-4">
              <ApperIcon name="CreditCard" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{resident?.name || 'Unknown Resident'}</h3>
              <p className="text-sm text-gray-600">{payment.period}</p>
            </div>
          </div>
          <Badge variant={isOverdue ? 'overdue' : payment.status}>
            {isOverdue ? 'Overdue' : payment.status}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Amount:</span>
            <span className="text-lg font-semibold text-gray-900">${payment.amount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Due Date:</span>
            <span className="text-sm font-medium text-gray-900">
              {format(new Date(payment.dueDate), 'MMM dd, yyyy')}
            </span>
          </div>
          {payment.paidDate && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Paid Date:</span>
              <span className="text-sm font-medium text-gray-900">
                {format(new Date(payment.paidDate), 'MMM dd, yyyy')}
              </span>
            </div>
          )}
          {payment.method && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Method:</span>
              <span className="text-sm font-medium text-gray-900">{payment.method}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-600">
            ID: {payment.id}
          </div>
          <div className="flex space-x-2">
            {payment.status === 'pending' && (
              <Button
                variant="success"
                size="sm"
                onClick={() => onMarkPaid?.(payment)}
              >
                <ApperIcon name="Check" className="w-4 h-4 mr-1" />
                Mark Paid
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete?.(payment)}
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentCard;