import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import NavItem from '@/components/molecules/NavItem';
import { cn } from '@/utils/cn';

const Sidebar = ({ isOpen, onClose, className }) => {
const menuItems = [
    { to: '/', icon: 'LayoutDashboard', label: 'Dashboard' },
    { to: '/rooms', icon: 'Home', label: 'Rooms' },
    { to: '/residents', icon: 'Users', label: 'Residents' },
    { to: '/payments', icon: 'CreditCard', label: 'Payments' },
    { to: '/maintenance', icon: 'Wrench', label: 'Maintenance' },
    { to: '/expenses', icon: 'Receipt', label: 'Expenses' },
    { to: '/reports', icon: 'FileText', label: 'Reports' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn(
        'hidden lg:block w-64 bg-white border-r border-gray-200 h-screen',
        className
      )}>
        <div className="p-6">
          <div className="flex items-center mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="Building" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">HostelHub</h2>
              <p className="text-sm text-gray-600">Management System</p>
            </div>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
              >
                {item.label}
              </NavItem>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50"
          />
          
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            className="w-80 bg-white h-full shadow-xl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <ApperIcon name="Building" className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">HostelHub</h2>
                    <p className="text-sm text-gray-600">Management System</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>
              
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <NavItem
                    key={item.to}
                    to={item.to}
                    icon={item.icon}
                    onClick={onClose}
                  >
                    {item.label}
                  </NavItem>
                ))}
              </nav>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Sidebar;