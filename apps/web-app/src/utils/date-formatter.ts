export const customDateFormatter = (date: Date | string) => {
    const parsedDate = typeof date === 'string' ? new Date(date) : date;

    const formatted = parsedDate.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

    return formatted;
};
