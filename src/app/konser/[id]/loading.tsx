export default function KonserLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section Skeleton */}
      <section className="relative">
        <div className="h-[500px] bg-gray-200 animate-pulse"></div>
      </section>

      {/* Content Skeleton */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-8">
                {/* Title Skeleton */}
                <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-6 animate-pulse"></div>
                
                {/* Description Skeleton */}
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded-md w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded-md w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>
                </div>

                <div className="mt-12">
                  {/* Subtitle Skeleton */}
                  <div className="h-6 bg-gray-200 rounded-md w-1/4 mb-4 animate-pulse"></div>
                  
                  {/* Info Boxes Skeleton */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-100 p-4 rounded-lg h-20 animate-pulse"></div>
                    <div className="bg-gray-100 p-4 rounded-lg h-20 animate-pulse"></div>
                    <div className="bg-gray-100 p-4 rounded-lg md:col-span-2 h-20 animate-pulse"></div>
                  </div>
                </div>

                <div className="mt-12">
                  {/* Share Skeleton */}
                  <div className="h-6 bg-gray-200 rounded-md w-1/4 mb-4 animate-pulse"></div>
                  <div className="flex space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="w-24 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              {/* Ticket Box Skeleton */}
              <div className="bg-white rounded-xl shadow-md p-8 sticky top-8">
                <div className="h-6 bg-gray-200 rounded-md w-1/2 mb-6 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-md w-full mb-6 animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded-md w-full mb-4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-md w-2/3 mx-auto mb-8 animate-pulse"></div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="h-5 bg-gray-200 rounded-md w-1/3 mb-4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded-md w-full mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded-md w-1/2 mb-1 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded-md w-1/2 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Events Skeleton */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="h-8 bg-gray-200 rounded-md w-1/3 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded-md w-1/2 mx-auto animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-6 bg-gray-200 rounded-md w-2/3 animate-pulse"></div>
                    <div className="h-5 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                  </div>
                  <div className="space-y-2 mb-4">
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
    </div>
  );
} 