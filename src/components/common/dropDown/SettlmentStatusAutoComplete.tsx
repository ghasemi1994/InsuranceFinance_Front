import { Autocomplete, TextField } from '@mui/material';
import React from 'react'


interface IProps {    value?: number | null;
    onChange?: (value: number | null) => void;
    helperText?: string
    error?: boolean
    disabled?: boolean
}

enum SettelmentStatus {
    All = 0,
    Settled = 1,
    NotSettled = 2
}

const persianLabels: Record<SettelmentStatus, string> = {
    [SettelmentStatus.All]: 'همه',
    [SettelmentStatus.Settled]: 'تسویه شده',
    [SettelmentStatus.NotSettled]: 'تسویه نشده',
};

const formFieldOptions = Object.values(SettelmentStatus)
    .filter(value => typeof value === 'number')
    .map(value => ({
        value: value as number,
        label: persianLabels[value as SettelmentStatus]
    }));


export default function SettelmentStatusAutoComplete(props: IProps) {
    const { value, onChange, disabled } = props;

    const handleChange = (event: any, newValue: { value: number; label: string } | null) => {
        if (onChange) {
            onChange(newValue ? newValue.value : null);
        }
    };

    // Find the current option based on the numeric value
    const currentValue = formFieldOptions.find(option => option.value === value) || null;
    return (
        <Autocomplete
            disabled={props.disabled}
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
