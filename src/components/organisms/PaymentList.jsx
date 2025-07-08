import { motion } from 'framer-motion';
import PaymentCard from '@/components/molecules/PaymentCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';

const PaymentList = ({ 
  payments, 
  residents,
  loading, 
  error, 
  onMarkPaid, 
  onDelete, 
  onRetry,
  className = "" 
}) => {
  if (loading) {
    return <Loading rows={4} showHeader={false} />;
  }

  if (error) {
    return <Error message={error} onRetry={onRetry} />;
  }

  if (!payments || payments.length === 0) {
    return (
      <Empty
        title="No payments found"
        message="There are no payment records yet. Payments will appear here once residents are added."
        icon="CreditCard"
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 ${className}`}
    >
      {payments.map((payment, index) => {
        const resident = residents.find(r => r.id === payment.residentId);
        return (
          <motion.div
            key={payment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <PaymentCard 
              payment={payment} 
              resident={resident}
              onMarkPaid={onMarkPaid} 
              onDelete={onDelete} 
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default PaymentList;