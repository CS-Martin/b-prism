'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@b-prism/shadcn-ui/index';
import { Button } from '@b-prism/shadcn-ui/index';

interface ThemeTogglerProps {
    className?: string;
}

export function ThemeToggler({ className }: ThemeTogglerProps) {
    const { setTheme } = useTheme();

    return (
        <div className={`${className} `}>
            <DropdownMenu>
                <DropdownMenuTrigger
                    className='text-black bg-white'
                    asChild>
                    <Button
                        variant='outline'
                        size='icon'>
                        <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
                        <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
                        <span className='sr-only'>Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className='bg-background'
                    align='end'>
                    <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
