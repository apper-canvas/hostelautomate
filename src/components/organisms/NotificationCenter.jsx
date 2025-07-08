import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import notificationService from '@/services/api/notificationService';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    loadNotificationCount();
    
    // Start the reminder system
    const intervalId = notificationService.startReminderSystem();
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadNotificationCount = async () => {
    try {
      const count = await notificationService.getNotificationCount();
      setNotificationCount(count);
    } catch (error) {
      console.error('Failed to load notification count:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const upcomingPayments = await notificationService.getUpcomingPayments();
      setNotifications(upcomingPayments);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleSendTestReminders = async () => {
    try {
      const result = await notificationService.sendReminders();
      if (result.success) {
        toast.success(`Sent ${result.remindersSent} payment reminders`);
        loadNotificationCount();
      } else {
        toast.error(`Failed to send reminders: ${result.error}`);
      }
    } catch (error) {
      toast.error('Failed to send reminders');
    }
  };

  const formatDaysUntilDue = (days) => {
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    return `Due in ${days} days`;
  };

  const getUrgencyColor = (days) => {
    if (days === 0) return 'bg-red-500';
    if (days === 1) return 'bg-orange-500';
    if (days <= 3) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <ApperIcon name="Bell" className="w-5 h-5" />
        {notificationCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {notificationCount > 9 ? '9+' : notificationCount}
          </Badge>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSendTestReminders}
                  className="text-xs"
                >
                  <ApperIcon name="Send" className="w-3 h-3 mr-1" />
                  Send Reminders
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-1">Upcoming payment due dates</p>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center">
                  <ApperIcon name="Loader2" className="w-5 h-5 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center">
                  <ApperIcon name="CheckCircle" className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No upcoming payment due dates</p>
                  <p className="text-xs text-gray-500 mt-1">All payments are up to date!</p>
                </div>
              ) : (
                <div className="py-2">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.Id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${getUrgencyColor(notification.daysUntilDue)}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {notification.resident.name}
                            </p>
                            <span className="text-xs text-gray-500">
                              ${notification.amount}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {notification.period}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              notification.isUrgent 
                                ? 'bg-red-100 text-red-700' 
                                : notification.daysUntilDue <= 3
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {formatDaysUntilDue(notification.daysUntilDue)}
                            </span>
                            <span className="text-xs text-gray-500">
                              Due: {new Date(notification.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>{notifications.length} upcoming payment{notifications.length !== 1 ? 's' : ''}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsOpen(false);
                      // In a real app, this would navigate to the payments page with filters
                      window.location.hash = '#/payments';
                    }}
                    className="text-xs p-1 h-auto"
                  >
                    View all payments →
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;