
import { Autocomplete, TextField } from '@mui/material';
import React from 'react'
import { AddendumType } from '../../../types/Insurance';


interface IProps {
    value?: number | null;
    onChange?: (value: number | null) => void;
    helperText?: string
    error?: boolean
    disabled?: boolean
}


const persianLabels: Record<AddendumType, string> = {
    [AddendumType.WithFinancial]: 'با بار مالی',
    [AddendumType.WithoutFinance]: 'بدون بار مالی',
    [AddendumType.Cancellation]: 'ابطال',
};

const formFieldOptions = Object.values(AddendumType)
    .filter(value => typeof value === 'number')
    .map(value => ({
        value: value as number,
        label: persianLabels[value as AddendumType]
    }));


export default function AddendumTypeAutoComplete(props: IProps) {
    const { value, onChange, disabled } = props;

    const handleChange = (event: any, newValue: { value: number; label: string } | null) => {
        if (onChange) {
            onChange(newValue ? newValue.value : null);
        }
    };

    const currentValue = formFieldOptions.find(option => option.value === value) || null;
    
    return (
        <Autocomplete
            disabled={disabled}
            clearOnEscape
            onChange={handleChange}
            value={currentValue}
            options={formFieldOptions}
            getOptionLabel={(option) => option.label}

            renderInput={(params) => (
                <TextField
                    {...params}
                    variant='outlined'
                    helperText={props.helperText}
                    error={props.error}
                />
            )}
            isOptionEqualToValue={(option, value) => option.value === value?.value}

        />
    )
}
