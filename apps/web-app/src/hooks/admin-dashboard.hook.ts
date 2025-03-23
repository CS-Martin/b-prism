'use client';

import { useState } from 'react';
import { UserDto } from '@dto';
import { userService } from '../services/user.service';
import { toast } from '@b-prism/shadcn-ui/hooks/use-toast';

export const useDisplayUsers = (access_token: string | null) => {
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState<UserDto[]>([]);

    const fetchAllUsers = async () => {
        try {
            setIsLoading(true);

            const users: UserDto[] = await userService.fetchAllUsers(access_token);

            setUsers(users);
        } catch (error) {
            console.error(error);
            throw new Error('Failed to fetch users');
        } finally {
            setIsLoading(false);
        }
    };

    return { users, isLoading, fetchAllUsers };
};

export const useChangeUserRole = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const changeUserRole = async (user: UserDto, newRole: string, author: string, token: string) => {
        setIsLoading(true);
        setError(null);

        try {
            await userService.update(user.id, newRole, author, token);

            toast({
                title: 'Success',
                description: `User role changed to ${newRole}`,
                variant: 'success',
            });
        } catch (error) {
            console.error(error);

            setError('Failed to change user role');

            toast({
                title: 'Error',
                description: `Failed to change user role, ${error}`,
                variant: 'destructive',
            });

            throw new Error('Failed to change user role');
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, error, changeUserRole };
};
