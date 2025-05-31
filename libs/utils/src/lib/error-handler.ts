/* eslint-disable @typescript-eslint/no-explicit-any */
export function parseErrorMessage(error: unknown): string {
    if (typeof error === 'string') {
        return error;
    }

    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === 'object' && error !== null && 'name' in error && (error as any).name === 'TypeError') {
        throw new Error('Network error: Please check your internet connection and try again.');
    }

    if (typeof error === 'object' && error !== null && 'message' in error) {
        return String((error as any).message);
    }

    return 'An unexpected error occurred';
}
