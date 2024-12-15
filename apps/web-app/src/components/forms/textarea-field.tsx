import { Label, Textarea } from '@b-prism/shadcn-ui/index';
import { Controller } from 'react-hook-form';

interface TextAreaFieldProps {
    name: string;
    control: any;
    label: string;
    placeholder?: string;
    rules?: any;
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
                    className='rounded-sm mt-1'
                    placeholder={placeholder}
                />
            )}
        />
    </div>
);

export default TextAreaField;
