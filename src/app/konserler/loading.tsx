export default function KonserlerLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section Skeleton */}
      <section className="relative">
        <div className="h-[400px] bg-gray-200 animate-pulse"></div>
      </section>

      {/* Filters Skeleton */}
      <section className="bg-gray-50 py-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-6 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="w-40 h-10 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="w-40 h-10 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
            <div className="w-64 h-10 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Events Skeleton */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="h-8 bg-gray-200 rounded-md w-1/3 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded-md w-1/2 mx-auto animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-6 bg-gray-200 rounded-md w-2/3 animate-pulse"></div>
                    <div className="h-5 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded-md w-full mb-4 animate-pulse"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-200 rounded-md w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-full animate-pulse"></div>
                  </div>
                  <div className="flex justify-end">
                    <div className="h-5 bg-gray-200 rounded-md w-24 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Event Skeleton */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="h-8 bg-gray-200 rounded-md w-1/3 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded-md w-1/2 mx-auto animate-pulse"></div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="h-64 lg:h-auto bg-gray-200 animate-pulse"></div>
              <div className="p-8">
                <div className="h-5 bg-gray-200 rounded-full w-16 mb-4 animate-pulse"></div>
                <div className="h-7 bg-gray-200 rounded-md w-3/4 mb-4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-md w-full mb-6 animate-pulse"></div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="h-5 bg-gray-200 rounded-md animate-pulse"></div>
                  <div className="h-5 bg-gray-200 rounded-md animate-pulse"></div>
                  <div className="h-5 bg-gray-200 rounded-md col-span-2 animate-pulse"></div>
                </div>
                <div className="flex justify-end">
                  <div className="h-10 bg-gray-200 rounded-md w-32 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar Skeleton */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="h-8 bg-gray-200 rounded-md w-1/3 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded-md w-1/2 mx-auto animate-pulse"></div>
          </div>

          <div className="space-y-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="h-12 bg-gray-200 animate-pulse"></div>
                <div className="p-6">
                  <div className="divide-y divide-gray-200">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="py-4 first:pt-0 last:pb-0">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                          <div className="flex-1">
                            <div className="h-5 bg-gray-200 rounded-md w-3/4 mb-2 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded-md w-full animate-pulse"></div>
                          </div>
                          <div className="flex flex-col md:flex-row items-start md:items-center mt-2 md:mt-0 space-y-2 md:space-y-0 md:space-x-4">
                            <div className="h-4 bg-gray-200 rounded-md w-24 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded-md w-24 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded-md w-24 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 