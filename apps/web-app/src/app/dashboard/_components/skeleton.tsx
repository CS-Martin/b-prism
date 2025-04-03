export const OverviewSkeleton = () => {
    return (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
            {/* Heatmap Card Skeleton */}
            <div className='p-4 bg-gray-200 rounded-md lg:col-span-4 animate-pulse'>
                <div className='w-1/3 h-6 mb-2 bg-gray-300 rounded-md'></div>
                <div className='w-2/3 h-4 mb-4 bg-gray-300 rounded-md'></div>
                <div className='h-[300px] bg-gray-300 rounded-md flex items-center justify-center'>
                    <p className='text-gray-500'>Loading heatmap...</p>
                </div>
            </div>

            {/* Rescue Request Trends Skeleton */}
            <div className='p-4 bg-gray-200 rounded-md lg:col-span-3 animate-pulse'>
                <div className='w-1/3 h-6 mb-2 bg-gray-300 rounded-md'></div>
                <div className='w-2/3 h-4 mb-4 bg-gray-300 rounded-md'></div>
                <div className='h-[200px] bg-gray-300 rounded-md flex items-center justify-center'>
                    <p className='text-gray-500'>Loading trends...</p>
                </div>
            </div>
        </div>
    );
};
