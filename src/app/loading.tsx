export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <div className="h-6 sm:h-8 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-4 w-24 sm:w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      {/* Ticker Skeleton */}
      <div className="bg-gray-900 py-1.5 sm:py-2 overflow-hidden">
        <div className="flex gap-6 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 text-white">
              <div className="h-4 w-12 bg-gray-700 rounded" />
              <div className="h-4 w-16 bg-gray-700 rounded" />
              <div className="h-4 w-12 bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Skeleton */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md p-3 sm:p-4 min-h-[120px] sm:min-h-[140px] animate-pulse"
            >
              <div className="flex justify-between items-start mb-2 sm:mb-3">
                <div className="flex-1">
                  <div className="h-5 sm:h-6 w-20 bg-gray-200 rounded mb-1" />
                  <div className="h-3 w-16 bg-gray-200 rounded" />
                </div>
                <div className="h-6 w-12 bg-gray-200 rounded ml-2" />
              </div>
              <div className="mt-2 sm:mt-3">
                <div className="h-6 sm:h-8 w-24 bg-gray-200 rounded mb-1" />
                <div className="h-4 w-20 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
