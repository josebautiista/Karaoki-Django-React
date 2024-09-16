export const SkeletonLoader: React.FC = () => {
  return (
    <div className="animate-pulse flex items-center p-2 bg-gray-200 rounded-lg shadow-md">
      <div className="w-16 h-16 bg-gray-300 rounded-md mr-4"></div>
      <div className="flex-1 space-y-4 py-1">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  );
};
