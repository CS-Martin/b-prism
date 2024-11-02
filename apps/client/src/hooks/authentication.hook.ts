import { signIn } from "next-auth/react";

export async function doCredentialLogin(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const response = await signIn('credentials', {
        email,
        password,
        redirect: false
    });

    return response;
}