import { ResponseDto, UserDto } from '@dto';
import { useEffect, useState } from 'react';
import { userService } from '../services/user.service';

export const useVerifyUser = (email: string) => {
    const [user, setUser] = useState<UserDto>();

    const fetchUser = async () => {
        const response: ResponseDto<UserDto> = await userService.fetchUserByEmail(email);

        if (response.statusCode !== 201) {
            console.log('Authentication Hook: Failed to fetch user by email');

            throw new Error('Authentication Hook: Failed to fetch user by email');
        }

        setUser(response.body);
    };

    useEffect(() => {
        fetchUser();
    }, [email]);

    return { user };
};
