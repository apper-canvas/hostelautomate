import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

const Button = React.forwardRef(({
  className,
  variant = 'primary',
  size = 'default',
  children,
  disabled,
  ...props
}, ref) => {
  const variants = {
    primary: 'bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl border border-primary/20',
    secondary: 'bg-secondary hover:bg-secondary/90 text-white shadow-lg hover:shadow-xl border border-secondary/20',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 shadow-sm hover:shadow-md',
    ghost: 'hover:bg-gray-100 text-gray-700',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl border border-red-500/20',
    success: 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl border border-green-500/20',
  };

  const sizes = {
    sm: 'h-8 px-3 text-sm',
    default: 'h-10 px-4 py-2',
    lg: 'h-12 px-6 text-lg',
  };

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = "Button";

export default Button;