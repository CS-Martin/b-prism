'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Switch } from '@b-prism/shadcn-ui/components/ui/switch';
import { Label } from '@b-prism/shadcn-ui/components/ui/label';

export function ModeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const [isMounted, setIsMounted] = React.useState(false);

    // Ensure theme is fully resolved before rendering
    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleToggle = (checked: boolean) => {
        setTheme(checked ? 'dark' : 'light');
    };

    if (!isMounted) return null; // Avoid rendering until theme is resolved

    return (
        <div className='flex items-center space-x-2'>
            <Switch
                id='theme-mode'
                checked={resolvedTheme === 'dark'}
                onCheckedChange={handleToggle}
            />
            <Label
                htmlFor='theme-mode'
                className='sr-only'
            >
                Toggle theme
            </Label>
        </div>
    );
}
