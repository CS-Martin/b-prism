'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from '@b-prism/shadcn-ui/index';
import { Button, Separator } from '@b-prism/shadcn-ui/index';
import { Sheet, SheetTrigger, SheetContent } from '@b-prism/shadcn-ui/index';
import { cn } from '@b-prism/shadcn-lib/cn';
import Image from 'next/image';
import { haribonFeatures } from '../utils/constants';

const HomeNavbar = () => {
    const { data: session } = useSession();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`z-50 fixed top-0 w-full flex flex-row justify-between items-center transition-all duration-500 ${
                isScrolled
                    ? 'h-[80px] px-3 lg:px-[110px] 2xl:px-[350px] bg-black border-b border-b-zinc-800 shadow-md'
                    : 'h-[120px] border-none px-3 md:px-16 lg:px-20 translate-all duration-500'
            }`}>
            {/* Mobile Menu */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant='outline'
                        size='icon'
                        className='lg:hidden'>
                        <MenuIcon className='w-6 h-6' />
                        <span className='sr-only'>Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side='left'>
                    <div className='py-6'>
                        <NavigationMenu>
                            <NavigationMenuList className='flex flex-col items-start gap-5 m-0'>
                                <NavigationMenuItem asChild>
                                    <Link
                                        href='/dashboard'
                                        className='font-semibold'>
                                        Live Dashboard
                                    </Link>
                                </NavigationMenuItem>
                                <NavigationMenuItem
                                    className='ml-0'
                                    asChild>
                                    <Link
                                        href='/map'
                                        className='ml-0 font-semibold'>
                                        Haribon Field Map
                                    </Link>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                </SheetContent>
            </Sheet>

            <div className='absolute transform -translate-x-1/2 md:hidden left-1/2'>
                <Image
                    height={36}
                    width={36}
                    src={'/logo/haribon-logo.svg'}
                    alt='haribon logo'
                />
            </div>

            {/* Desktop Logo and Navigation */}
            <div className={`hidden lg:flex items-center justify-between w-full`}>
                <div>
                    <NavigationMenu>
                        <NavigationMenuList className='gap-4 text-white'>
                            <Link
                                href={'/home'}
                                className='flex items-center gap-2 font-bold'>
                                <Image
                                    src={'/logo/haribon-logo.svg'}
                                    height={40}
                                    width={40}
                                    alt='haribon logo'
                                />
                                HARIBON
                            </Link>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className='font-semibold text-white bg-transparent data-[state=open]:bg-white data-[state=open]:text-black hover:bg-black'>
                                    Getting started
                                </NavigationMenuTrigger>
                                <NavigationMenuContent className=''>
                                    <ul className='grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
                                        <li className='row-span-3'>
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    className='flex flex-col justify-end w-full h-full p-6 no-underline rounded-md outline-none select-none bg-gradient-to-b from-muted/50 to-muted focus:shadow-md'
                                                    href='/'>
                                                    {/* <Icons.logo className='w-6 h-6' /> */}
                                                    <div className='mt-4 mb-2 text-lg font-medium'>Project Haribon</div>
                                                    <p className='text-sm leading-tight text-muted-foreground'>
                                                        Hazard Assessment and Rescue Integration for Bicol Operations Network.
                                                    </p>
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                        <ListItem
                                            href='/docs'
                                            title='Introduction'>
                                            Re-usable components built using Radix UI and Tailwind CSS.
                                        </ListItem>
                                        <ListItem
                                            href='/docs/installation'
                                            title='Installation'>
                                            How to install dependencies and structure your app.
                                        </ListItem>
                                        {/* <ListItem
                                            href='/docs/primitives/typography'
                                            title='Typography'>
                                            Styles for headings, paragraphs, lists...etc
                                        </ListItem> */}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className='font-semibold text-white bg-transparent data-[state=open]:bg-white data-[state=open]:text-black hover:bg-black'>
                                    Solutions
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] '>
                                        {haribonFeatures.map((component) => (
                                            <ListItem
                                                key={component.title}
                                                href={component.href}
                                                title={component.title}>
                                                {component.description}
                                            </ListItem>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            {/* <NavigationMenuItem asChild>
                                <Link
                                    href='/docs'
                                    className='px-3 font-semibold text-white bg-transparent hover:bg-black'>
                                    Documentation
                                </Link>
                            </NavigationMenuItem> */}
                            <NavigationMenuItem asChild>
                                <Link
                                    href='/dashboard'
                                    className='px-2 font-semibold text-white bg-transparent hover:bg-black'>
                                    Live Dashboard
                                </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem asChild>
                                <Link
                                    href='/map'
                                    className='px-2 font-semibold text-white bg-transparent hover:bg-black'>
                                    Field Map
                                </Link>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
                {/* Desktop Actions */}
                <div className='items-center hidden gap-4 lg:flex'>
                    <Button
                        className='hidden text-white border rounded-full xl:flex border-zinc-800'
                        variant='ghost'>
                        Contact Us
                    </Button>
                    <Separator
                        orientation='vertical'
                        className='bg-white h-3 w-[1px] hidden xl:flex'
                    />
                    {session ? (
                        <Button
                            asChild
                            className='px-8 text-white bg-blue-500 rounded-full hover:bg-blue-400'>
                            <Link href='/api/auth/signout'>Sign out</Link>
                        </Button>
                    ) : (
                        <Button
                            asChild
                            className='px-8 text-white bg-blue-500 rounded-full hover:bg-blue-400'>
                            <Link href='/auth/login'>Sign in</Link>
                        </Button>
                    )}
                </div>
            </div>
            <div className='flex items-center gap-4 lg:hidden'>
                <Button
                    className='hidden rounded-full xl:flex'
                    variant='ghost'>
                    Contact Us
                </Button>
                <Separator
                    orientation='vertical'
                    className='bg-white h-3 w-[1px] hidden xl:flex'
                />
                {session ? (
                    <Button
                        asChild
                        className='px-8 text-white bg-blue-500 rounded-full hover:bg-blue-400'>
                        <Link href='/api/auth/signout'>Sign out</Link>
                    </Button>
                ) : (
                    <Button
                        asChild
                        size={'sm'}
                        className='px-5 text-white bg-blue-500 rounded-full hover:bg-blue-400'>
                        <Link href='/auth/login'>Sign in</Link>
                    </Button>
                )}
            </div>
        </header>
    );
};

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                        className,
                    )}
                    {...props}>
                    <div className='text-sm font-medium leading-none'>{title}</div>
                    <p className='text-sm leading-snug line-clamp-2 text-muted-foreground'>{children}</p>
                </a>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = 'ListItem';

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'>
            <line
                x1='4'
                x2='20'
                y1='12'
                y2='12'
            />
            <line
                x1='4'
                x2='20'
                y1='6'
                y2='6'
            />
            <line
                x1='4'
                x2='20'
                y1='18'
                y2='18'
            />
        </svg>
    );
}

export default HomeNavbar;
