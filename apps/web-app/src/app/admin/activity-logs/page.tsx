import Topbar from 'apps/web-app/src/components/topbar';

export default function ActivityLogging() {
    return (
        <div className='px-3'>
            <Topbar
                items={[
                    { label: 'Links', href: '/' },
                    { label: 'Activity Logs', href: '/admin/activity-logs' },
                ]}
            />
            Hello world
        </div>
    );
}
