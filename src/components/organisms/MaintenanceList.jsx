import { motion } from 'framer-motion';
import MaintenanceCard from '@/components/molecules/MaintenanceCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';

const MaintenanceList = ({ 
  requests, 
  loading, 
  error, 
  onStatusChange, 
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

  if (!requests || requests.length === 0) {
    return (
      <Empty
        title="No maintenance requests found"
        message="There are no maintenance requests yet. Requests will appear here when residents report issues."
        icon="Wrench"
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 ${className}`}
    >
{requests.map((request, index) => (
        <motion.div
          key={request.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <MaintenanceCard 
            request={request} 
            onStatusChange={onStatusChange} 
            onDelete={onDelete} 
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default MaintenanceList;