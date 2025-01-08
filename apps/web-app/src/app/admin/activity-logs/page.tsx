import Topbar from 'apps/web-app/src/components/topbar';

const activities = [
    {
        time: 'January 9, 2025',
        icon: '💧', // Replace this with an appropriate icon or image
        title: 'Morning watering initiated.',
        description: 'Scheduled Activity',
        action: 'View Cameras',
    },
    {
        time: 'January 9, 2025',
        icon: '🌬️',
        title: 'Ventilation system power set to 80%',
        description: 'Scheduled Activity',
    },
    {
        time: 'January 9, 2025',
        icon: '👤',
        title: 'Authorized personnel entered facility.',
        description: 'Nick R. @ Main Entrance',
        extra: 'Show 3 similar activities',
    },
    {
        time: 'January 9, 2025',
        icon: '☀️',
        title: 'Main light source set to 1200 LUX',
        description: 'Nancy T. · Manually Set',
    },
];

export default function ActivityLogging() {
    return (
        <div className='px-3'>
            <Topbar
                items={[
                    { label: 'Links', href: '/' },
                    { label: 'Activity Logs', href: '/admin/activity-logs' },
                ]}
            />

            <p className='py-6'>Activity Log History</p>
            <div className='bg-[#18181A] rounded-md p-6 w-[80%]'>
                <div className='relative'>
                    {/* Timeline Items */}
                    {activities.map((activity, index) => (
                        <div
                            key={index}
                            className='relative flex items-start h-[120px] rounded-md'>
                            {/* Circle and Line */}
                            <div className='relative flex flex-col items-center h-full'>
                                {/* Circle */}
                                <div className='w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center z-10'></div>
                                {/* Line below the circle */}
                                {index < activities.length - 1 && <div className='h-[65%] rounded-full w-[0.7px] bg-gray-500 absolute top-8'></div>}
                            </div>

                            <div className='ml-10 w-full text-center text-gray-400 max-w-[120px]'>
                                <p>12 min ago</p>
                            </div>

                            {/* Content */}
                            <div className='ml-6 hover:bg-slate-500 w-full h-[85%] rounded-md px-3 cursor-pointer'>
                                <p className=' text-gray-500'>{activity.time}</p>
                                <h3 className=''>{activity.title}</h3>
                                <p className='text-gray-700'>{activity.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
