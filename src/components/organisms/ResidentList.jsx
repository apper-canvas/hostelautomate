import { motion } from 'framer-motion';
import ResidentCard from '@/components/molecules/ResidentCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';

const ResidentList = ({ 
  residents, 
  loading, 
  error, 
  onEdit, 
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

  if (!residents || residents.length === 0) {
    return (
      <Empty
        title="No residents found"
        message="There are no residents registered yet. Add your first resident to get started."
        icon="Users"
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 ${className}`}
    >
      {residents.map((resident, index) => (
        <motion.div
          key={resident.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <ResidentCard 
            resident={resident} 
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ResidentList;