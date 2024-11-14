import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@b-prism/shadcn-ui/index';

interface BreadcrumProps {
    items: {
        label: string;
        href: string;
    }[];
    className?: string;
}

export const Breadcrumbs = ({ items, className }: BreadcrumProps) => {
    return (
        <Breadcrumb className={className}>
            <BreadcrumbList>
                {items?.map((item, index) => (
                    <>
                        <BreadcrumbItem key={index}>
                            {index === items.length - 1 ? (
                                <BreadcrumbPage>{item.label}</BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                        {index !== items.length - 1 && <BreadcrumbSeparator />}
                    </>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
};
