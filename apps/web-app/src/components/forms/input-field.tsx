import { Input, Label } from '@b-prism/shadcn-ui/index';
import { Controller } from 'react-hook-form';

interface InputFieldProps {
    className?: string;
    name: string;
    control: any;
    label: string;
    type?: string;
    placeholder?: string;
    rules?: any;
}

const InputField: React.FC<InputFieldProps> = ({
    className,
    name,
    control,
    label,
    type = 'text',
    placeholder,
    rules,
}) => (
    <div className={`${className}`}>
        <Label
            className=' font-normal'
            htmlFor={name}>
            {label}
        </Label>
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState }) => (
                <>
                    <Input
                        {...field}
                        type={type}
                        placeholder={placeholder}
                        className={`rounded-sm mt-1`}
                    />
                    {fieldState.error && <small className='text-red-400'>{fieldState.error.message}</small>}
                </>
            )}
        />
    </div>
);

export default InputField;
