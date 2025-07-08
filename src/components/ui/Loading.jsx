import { cn } from '@/utils/cn';

const Loading = ({ className, rows = 3, showHeader = true }) => {
  return (
    <div className={cn("animate-pulse", className)}>
      {showHeader && (
        <div className="mb-6">
          <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-48 mb-2"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-32"></div>
        </div>
      )}
      <div className="space-y-4">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-8 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;