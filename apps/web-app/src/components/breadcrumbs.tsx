import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@b-prism/shadcn-ui/index';
import React from 'react';

interface BreadcrumbsProps {
    items: {
        label: string;
        href: string;
    }[];
    className?: string;
}

export const Breadcrumbs = ({ items, className }: BreadcrumbsProps) => {
    return (
        <Breadcrumb className={className}>
            <BreadcrumbList>
                {items?.map((item, index) => (
                    <React.Fragment key={item.href || item.label}>
                        <BreadcrumbItem>
                            {index === items.length - 1 ? (
                                <BreadcrumbPage>{item.label}</BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                        {index !== items.length - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
};
