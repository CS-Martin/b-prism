'use client';

import { useEffect, useState } from 'react';
import { ResponseDto, UserDto } from '@dto';
import { userService } from '../services/user.service';

export const useDisplayUsers = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState<UserDto[]>([]);

    const fetchAllUsers = async () => {
        try {
            setIsLoading(true);

            const response: ResponseDto<UserDto[]> = await userService.fetchAllUsers();

            if (response.statusCode !== 201) {
                throw new Error('Failed to fetch users');
            }

            setUsers(response.body);
        } catch (error) {
            console.error(error);
            throw new Error('Failed to fetch users');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllUsers();
    }, []);

    return { users, isLoading, fetchAllUsers };
};
