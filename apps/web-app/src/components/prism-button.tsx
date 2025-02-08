import { Button } from '@b-prism/shadcn-ui/index';
import { ArrowDown } from 'lucide-react';
import Link from 'next/link';
import { PacmanLoader } from 'react-spinners';

interface PrismButtonProps {
    isLoading: boolean;
    label: string;
    loadingLabel: string;
    link: string;
    style: string;
}

export const PrismButton = ({ isLoading, label, loadingLabel, link, style }: PrismButtonProps) => {
    return (
        <Button
            type='submit'
            disabled={isLoading}
            className={`group relative ${style}`}>
            {!isLoading ? (
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
                    <Link href={link}>
                        {label}
                        {/* <p className='translate-x-6 transition-transform duration-500 ease-in-out group-hover:translate-x-6 sm:translate-x-0'>{label}</p> */}
                    </Link>
                </>
            )}
        </Button>
    );
};
