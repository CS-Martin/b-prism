/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input, Label } from '@b-prism/shadcn-ui/index';
import { UseFormRegister } from 'react-hook-form';

interface InputFieldProps {
    className?: string;
    name: string;
    register: UseFormRegister<any>;
    label: string;
    type: React.HTMLInputTypeAttribute;
    placeholder?: string;
    errors?: any;
    rules?: any;
    isDisabled: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ className, name, register, label, type, placeholder, errors, rules, isDisabled }) => (
    <div className={`${className}`}>
        <Label
            className='font-normal '
            htmlFor={name}>
            {label}
        </Label>
        <Input
            {...register(name, { valueAsNumber: type === 'number', ...rules })}
            type={type}
            placeholder={placeholder}
            disabled={isDisabled}
            className={`rounded-sm mt-1`}
        />
        {errors && <small className='text-red-400'>{errors.message}</small>}
    </div>
);

export default InputField;
