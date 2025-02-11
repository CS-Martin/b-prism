import { Button } from '@b-prism/shadcn-ui/index';
import { ButtonType } from '@b-prism/types';
import { ArrowDown } from 'lucide-react';
import Link from 'next/link';
import { PacmanLoader } from 'react-spinners';

interface PrismButtonProps {
    type: ButtonType;
    isLoading: boolean;
    label: string;
    loadingLabel: string | null;
    link: string | null;
    style: string;
}

export const PrismButton = ({ type, isLoading, label, loadingLabel, link, style }: PrismButtonProps) => {
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
                        className='absolute left-0 ml-4 animate-bounce transition-opacity duration-500 ease-in-out group-hover:ml-4 group-hover:opacity-100 sm:opacity-0'
                    /> */}

                    {/* To handle events that sometimes do not require links */}
                    {link ? (
                        <Link href={link}>
                            {label}
                            {/* <p className='translate-x-6 transition-transform duration-500 ease-in-out group-hover:translate-x-6 sm:translate-x-0'>{label}</p> */}
                        </Link>
                    ) : (
                        <span>{label}</span>
                    )}
                </>
            )}
        </Button>
    );
};
