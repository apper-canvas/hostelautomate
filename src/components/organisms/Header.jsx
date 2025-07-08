import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import SearchInput from '@/components/atoms/SearchInput';
import Button from '@/components/atoms/Button';

const Header = ({ title, onSearch, onMenuToggle, showSearch = true, actions }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white border-b border-gray-200 px-4 py-4 lg:px-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden mr-3"
          >
            <ApperIcon name="Menu" className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        </div>

        <div className="flex items-center space-x-4">
          {showSearch && (
            <div className="hidden md:block">
              <SearchInput
                placeholder="Search residents, rooms..."
                onSearch={handleSearch}
                className="w-80"
              />
            </div>
          )}
          
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <ApperIcon name="Bell" className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <ApperIcon name="Settings" className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {showSearch && (
        <div className="mt-4 md:hidden">
          <SearchInput
            placeholder="Search residents, rooms..."
            onSearch={handleSearch}
            className="w-full"
          />
        </div>
      )}
    </motion.header>
  );
};

export default Header;