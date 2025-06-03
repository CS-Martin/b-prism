import { Label, Textarea } from '@b-prism/shadcn-ui/index';
import { Controller, Control, RegisterOptions, FieldValues } from 'react-hook-form';

interface TextAreaFieldProps<T extends FieldValues = FieldValues> {
    name: string;
    control: Control<T>;
    label: string;
    placeholder?: string;
    rules?: RegisterOptions;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({ name, control, label, placeholder, rules }) => (
    <div>
        <Label htmlFor={name}>{label}</Label>
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field }) => (
                <Textarea
                    {...field}
                    id={name}
                    className='mt-1 rounded-sm'
                    placeholder={placeholder}
                />
            )}
        />
    </div>
);

export default TextAreaField;
