import React from 'react';

/**
 * Skeleton loader component for better loading states
 * Provides visual feedback during async operations
 */
const SkeletonLoader = ({ type = 'default', className = '' }) => {
  const skeletonTypes = {
    text: (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    ),
    card: (
      <div className="animate-pulse p-6 border rounded">
        <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    ),
    calculator: (
      <div className="animate-pulse space-y-6">
        <div className="h-10 bg-gray-200 rounded w-3/4"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
        <div className="h-12 bg-gray-200 rounded"></div>
      </div>
    ),
    form: (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded w-1/3"></div>
      </div>
    ),
    default: (
      <div className="animate-pulse space-y-2">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    )
  };

  return (
    <div className={className} role="status" aria-label="Loading">
      {skeletonTypes[type] || skeletonTypes.default}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default SkeletonLoader;
