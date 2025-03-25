import { Separator, SidebarTrigger } from '@b-prism/shadcn-ui/index';
import { Breadcrumbs } from './breadcrumbs';
import { ThemeToggler } from './theme-toggler';

interface TopBarProps {
    items: {
        label: string;
        href: string;
    }[];
}

const Topbar = ({ items }: TopBarProps) => {
    return (
        <div className='flex flex-row items-center justify-between p-5'>
            <div className='flex flex-row items-center gap-4'>
                <SidebarTrigger />
                <Separator orientation='vertical' />
                <div className='flex items-center gap-4'>
                    <Breadcrumbs items={items} />
                </div>
            </div>
            <div>
                <ThemeToggler />
            </div>
        </div>
    );
};

export default Topbar;
