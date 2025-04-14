'use client';

import { Button } from '@b-prism/shadcn-ui/index';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PacmanLoader } from 'react-spinners';

export const Navbar = () => {
    const { data: session, status } = useSession();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    let btn;

    if (session && status === 'authenticated') {
        btn = (
            <Button
                asChild
                className='px-8 text-white bg-blue-500 rounded-full min-w-32 hover:bg-blue-400'>
                <Link href='/api/auth/signout'>Sign out</Link>
            </Button>
        );
    } else if (status === 'loading') {
        btn = (
            <Button
                disabled={true}
                className='px-8 text-white bg-blue-500 rounded-full min-w-32 hover:bg-blue-400'>
                <PacmanLoader
                    size={10}
                    color='white'
                />
            </Button>
        );
    } else if (!session && status === 'unauthenticated') {
        btn = (
            <Button
                asChild
                className='px-8 text-white bg-blue-500 rounded-full min-w-32 hover:bg-blue-400'>
                <Link href='/auth/login'>Sign in</Link>
            </Button>
        );
    }

    return (
        <nav className={`flex z-50 fixed top-0 items-center w-full bg-sidebar shadow ${isScrolled ? 'h-20' : 'h-24'} transition-all duration-300`}>
            <div className='flex items-center justify-between w-full max-w-6xl mx-auto'>
                <Link
                    href={'/home'}
                    className='flex items-center gap-3 font-bold'>
                    <Image
                        src={'/logo/haribon-logo-blue.svg'}
                        height={40}
                        width={40}
                        alt='haribon logo'
                    />
                    <p className='font-bold leading-tight text-blue-500'>
                        PROJECT <br />
                        HARIBON
                    </p>
                </Link>
                <div className='flex flex-row items-center gap-5 font-semibold'>
                    <Link href={'/contact-us'}>Contact</Link>
                    <div>{btn}</div>
                </div>
            </div>
        </nav>
    );
};
