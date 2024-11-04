import { useEffect, useState } from "react";
import { userService } from "../services/user-service";
import { ResponseDto, UserDto } from "@dto";

export const useDisplayUsers = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [users, setUsers] = useState<UserDto[]>([]);

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {

                setIsLoading(true)

                const response: ResponseDto<UserDto[]> = await userService.fetchAllUsers();

                if (response.statusCode !== 201) {
                    throw new Error('Failed to fetch users');
                }

                setUsers(response.body)

                setIsLoading(false)

            } catch (error) {
                console.error(error);

                throw new Error('Failed to fetch users');
            }
        };

        fetchAllUsers();
    }, [])

    return { users, isLoading };
}