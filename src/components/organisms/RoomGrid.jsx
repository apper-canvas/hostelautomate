import { motion } from 'framer-motion';
import RoomCard from '@/components/molecules/RoomCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';

const RoomGrid = ({ 
  rooms, 
  loading, 
  error, 
  onRoomClick, 
  onRetry,
  className = "" 
}) => {
  if (loading) {
    return <Loading rows={6} showHeader={false} />;
  }

  if (error) {
    return <Error message={error} onRetry={onRetry} />;
  }

  if (!rooms || rooms.length === 0) {
    return (
      <Empty
        title="No rooms found"
        message="There are no rooms configured yet. Add your first room to get started."
        icon="Home"
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${className}`}
    >
      {rooms.map((room, index) => (
        <motion.div
          key={room.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <RoomCard room={room} onClick={onRoomClick} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default RoomGrid;