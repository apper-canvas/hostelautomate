import { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const SearchInput = ({ placeholder = "Search...", onSearch, className, ...props }) => {
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    onSearch?.(newValue);
  };

  return (
    <div className={cn('relative', className)}>
      <ApperIcon 
        name="Search" 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
      />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
        {...props}
      />
    </div>
  );
};

export default SearchInput;