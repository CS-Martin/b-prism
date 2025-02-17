'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from '@b-prism/shadcn-ui/index';
import { Button, Separator } from '@b-prism/shadcn-ui/index';
import { Sheet, SheetTrigger, SheetContent } from '@b-prism/shadcn-ui/index';
import { cn } from '@b-prism/shadcn-lib/cn';

interface ListItemProps {
    href: string;
    title: string;
    children: React.ReactNode;
}

const components: { title: string; href: string; description: string }[] = [
    {
        title: 'Alert Dialog',
        href: '/docs/primitives/alert-dialog',
        description: 'A modal dialog that interrupts the user with important content and expects a response.',
    },
    {
        title: 'Hover Card',
        href: '/docs/primitives/hover-card',
        description: 'For sighted users to preview content available behind a link.',
    },
    {
        title: 'Progress',
        href: '/docs/primitives/progress',
        description: 'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
    },
    {
        title: 'Scroll-area',
        href: '/docs/primitives/scroll-area',
        description: 'Visually or semantically separates content.',
    },
    {
        title: 'Tabs',
        href: '/docs/primitives/tabs',
        description: 'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
    },
    {
        title: 'Tooltip',
        href: '/docs/primitives/tooltip',
        description: 'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
    },
];

const Navbar = () => {
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
            className={`z-50 fixed top-0 w-full flex justify-between items-center transition-all duration-500 ${
                isScrolled ? 'h-[80px] px-3 lg:px-[110px] 2xl:px-[350px] bg-black bg-opacity-60 shadow-md' : 'h-[130px] px-3 md:px-16 lg:px-18 translate-all duration-500'
            }`}>
            {/* Mobile Menu */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant='outline'
                        size='icon'
                        className='lg:hidden'>
                        <MenuIcon className='h-6 w-6' />
                        <span className='sr-only'>Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side='left'>
                    <div className='py-6'>
                        <Link
                            href='/home'
                            className='block w-full py-2 text-lg font-semibold'>
                            Home
                        </Link>
                        <Link
                            href='/about'
                            className='block w-full py-2 text-lg font-semibold'>
                            About
                        </Link>
                        <Link
                            href='/services'
                            className='block w-full py-2 text-lg font-semibold'>
                            Services
                        </Link>
                        <Link
                            href='/contact'
                            className='block w-full py-2 text-lg font-semibold'>
                            Contact
                        </Link>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Desktop Logo and Navigation */}
            <div className={`hidden lg:flex items-center justify-between w-full`}>
                <div>
                    <NavigationMenu>
                        <NavigationMenuList className='gap-4'>
                            <Link
                                href={'/home'}
                                className='font-semibold'>
                                Logo
                            </Link>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className='bg-transparent font-semibold'>Getting started</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className='grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
                                        <li className='row-span-3'>
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    className='flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md'
                                                    href='/'>
                                                    {/* <Icons.logo className='h-6 w-6' /> */}
                                                    <div className='mb-2 mt-4 text-lg font-medium'>shadcn/ui</div>
                                                    <p className='text-sm leading-tight text-muted-foreground'>
                                                        Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.
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
                                        <ListItem
                                            href='/docs/primitives/typography'
                                            title='Typography'>
                                            Styles for headings, paragraphs, lists...etc
                                        </ListItem>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className='font-semibold bg-transparent'>Getting Started</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] '>
                                        {components.map((component) => (
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
                            <NavigationMenuItem asChild>
                                <Link
                                    href='/docs'
                                    className='font-semibold'>
                                    Documentation
                                </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem asChild>
                                <Link
                                    href='/map'
                                    className='font-semibold'>
                                    Map
                                </Link>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
                {/* Desktop Actions */}
                <div className='hidden lg:flex items-center gap-4'>
                    <Button
                        className='rounded-full hidden xl:flex'
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
                            className='rounded-full px-8 bg-blue-500 hover:bg-blue-400 text-white'>
                            <Link href='/api/auth/signout'>Sign out</Link>
                        </Button>
                    ) : (
                        <Button
                            asChild
                            className='rounded-full px-8 bg-blue-500 hover:bg-blue-400 text-white'>
                            <Link href='/auth/login'>Sign in</Link>
                        </Button>
                    )}
                </div>
            </div>
            <div className='flex items-center lg:hidden gap-4'>
                <Button
                    className='rounded-full hidden xl:flex'
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
                        className='rounded-full px-8 bg-blue-500 hover:bg-blue-400 text-white'>
                        <Link href='/api/auth/signout'>Sign out</Link>
                    </Button>
                ) : (
                    <Button
                        asChild
                        className='rounded-full px-8 bg-blue-500 hover:bg-blue-400 text-white'>
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
                    <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>{children}</p>
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

export default Navbar;
