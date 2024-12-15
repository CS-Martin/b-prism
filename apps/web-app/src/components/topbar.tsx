import { Separator, SidebarTrigger } from '@b-prism/shadcn-ui/index';
import { Breadcrumbs } from './breadcrumbs';

const Topbar = () => {
    return (
        <div className='flex items-center border-b border-white-200 p-4 mt-2 gap-4'>
            <SidebarTrigger />
            <Separator orientation='vertical' />
            <div className='flex items-center gap-4'>
                <Breadcrumbs
                    items={[
                        { label: 'Links', href: '/' },
                        { label: 'Admin Dashboard', href: '/admin/dashboard' },
                    ]}
                />
            </div>
        </div>
    );
};

export default Topbar;
