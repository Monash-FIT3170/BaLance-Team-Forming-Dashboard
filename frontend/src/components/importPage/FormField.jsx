// Reusable component to represent a field in a form which allows user to edit a certain attribute
// Props: label, placeholder, value, onChange, options (for dropdowns)
import * as React from 'react';
import { FormControl, FormLabel, Select, Input } from '@chakra-ui/react';

const FormField = ({label, placeholder, value, onChange, options}) => {
    return (
        <FormControl>
            <FormLabel>{label}</FormLabel>
            {options ? (
                <Select
                    placeholder={placeholder}
                    value={value}
                    onChange={this.props.onChange}
                >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
                </Select>
            ) : (
                <Input
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
            )}
        </FormControl>
    );
}

export default FormField;
