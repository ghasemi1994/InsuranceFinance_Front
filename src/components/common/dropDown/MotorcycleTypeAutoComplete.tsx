import { Autocomplete, TextField } from '@mui/material';
import React from 'react'
import { MotorcycleType } from '../../../types/Form';


const motorcycleTypes: Record<MotorcycleType, string> = {
    [MotorcycleType.Singlecylinder]: 'تک سیلندر',
    [MotorcycleType.TwocylindersAbove]: 'دوسیلندر به بالا',
    [MotorcycleType.Threewheels]: 'سه چرخ',
    [MotorcycleType.Electric]: 'برقی',

};

// Create base options array
const baseOptions = Object.values(MotorcycleType)
    .filter(value => typeof value === 'number')
    .map(value => ({
        value: value as number,
        label: motorcycleTypes[value as MotorcycleType]
    }));

interface IProps {
    value?: number | null
    onChange?: (value: number | null) => void
    error?: boolean
    helperText?: string
    disabled?: boolean
    removeOptions?: MotorcycleType[]
    isRequired?: boolean
}

export default function MotorcycleTypeAutoComplete(props: IProps) {
    const { value, onChange, removeOptions = [], disabled, error, helperText, isRequired } = props;

    // Filter options based on removeOptions
    const filteredOptions = baseOptions.filter(option =>
        !removeOptions.includes(option.value as MotorcycleType)
    );

    // Find the current option based on the numeric value
    const currentValue = filteredOptions.find(option => option.value === value) || null;

    const handleChange = (event: any, newValue: any | null) => {
        if (onChange) {
            onChange(newValue ? newValue.value : null);
        }
    }

    return (
        <Autocomplete
            onChange={handleChange}
            value={currentValue}
            options={filteredOptions}
            getOptionLabel={(option) => option.label}
            getOptionKey={(option) => option.value}
            disabled={disabled}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant='outlined'
                    error={!!error}
                    helperText={helperText}
                    required={isRequired}
                />
            )}
            isOptionEqualToValue={(option, value) => option.value === value?.value}
        />
    );
}