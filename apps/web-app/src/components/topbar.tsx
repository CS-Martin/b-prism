import { Separator, SidebarTrigger } from '@b-prism/shadcn-ui/index';
import { Breadcrumbs } from './breadcrumbs';

interface TopBarProps {
    items: {
        label: string;
        href: string;
    }[];
}

const Topbar = ({ items }: TopBarProps) => {
    return (
        <div className='flex items-center border-b border-white-200 p-4 mt-2 gap-4'>
            <SidebarTrigger />
            <Separator orientation='vertical' />
            <div className='flex items-center gap-4'>
                <Breadcrumbs items={items} />
            </div>
        </div>
    );
};

export default Topbar;
