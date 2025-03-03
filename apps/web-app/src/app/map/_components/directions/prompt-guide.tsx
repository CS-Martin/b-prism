export const PromptGuide = ({ start, destination }: { start: [number, number] | null; destination: [number, number] | null }) => {
    let message = '';

    if (!start) {
        message = 'Select a Warehouse as a Starting Point';
    } else if (!destination) {
        message = 'Select a Dispensing Point as Destination';
    }

    if (!message) return null; // Hide if both are selected

    return (
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/40 shadow-md px-4 py-2 rounded-md text-center text-white font-semibold text-lg'>
            {message}
        </div>
    );
};
