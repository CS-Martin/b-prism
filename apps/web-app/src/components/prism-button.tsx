import { Button } from '@b-prism/shadcn-ui/index';
import { ButtonType } from '@b-prism/types';
import { Icon } from 'next/dist/lib/metadata/types/metadata-types';
import Link from 'next/link';
import React from 'react';
import { PacmanLoader } from 'react-spinners';

interface PrismButtonProps {
    type: ButtonType;
    isLoading: boolean;
    label: string;
    loadingLabel?: string | null;
    link?: string | null;
    style?: string;
    icon?: React.ReactNode;
}

export const PrismButton = ({ type, isLoading, label, loadingLabel, link, style, icon }: PrismButtonProps) => {
    return (
        <Button
            type={type}
            disabled={isLoading}
            className={`group relative ${style}`}>
            {isLoading ? (
                <>
                    <PacmanLoader
                        className={`${isLoading ? 'pacman-loader-slide-in' : 'pacman-loader-slide-out'}`}
                        color='white'
                        size={10}
                    />
                </>
            ) : (
                <>
                    {/* <ArrowDown
                        size={24}
                        className='absolute left-0 ml-4 transition-opacity duration-500 ease-in-out animate-bounce group-hover:ml-4 group-hover:opacity-100 sm:opacity-0'
                    /> */}

                    {/* To handle events that sometimes do not require links */}
                    {link ? (
                        <Link
                            href={link}
                            className='flex flex-row items-center gap-2'>
                            {icon && icon}
                            {label}
                            {/* <p className='transition-transform duration-500 ease-in-out translate-x-6 group-hover:translate-x-6 sm:translate-x-0'>{label}</p> */}
                        </Link>
                    ) : (
                        <span>{label}</span>
                    )}
                </>
            )}
        </Button>
    );
};
