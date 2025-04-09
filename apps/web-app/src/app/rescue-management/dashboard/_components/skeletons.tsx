export const RescueStatisticsCardsSkeleton = () => {
    const skeletonCards = Array.from({ length: 4 }, (_, index) => (
        <div
            key={index}
            className='w-full bg-gray-200 rounded-md h-28 animate-pulse'>
            <div className='flex items-center justify-between h-full p-4'>
                <div className='w-1/3 h-6 bg-gray-300 rounded-md'></div>
                <div className='w-1/3 h-6 bg-gray-300 rounded-md'></div>
            </div>
        </div>
    ));
    return <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>{skeletonCards}</div>;
};
