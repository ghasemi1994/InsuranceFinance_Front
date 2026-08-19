import { Autocomplete, TextField } from '@mui/material';
import React from 'react'


interface IProps {    value?: number | null;
    onChange?: (value: number | null) => void;
    helperText?: string
    error?: boolean
    disabled?: boolean
}

enum DueStatus {
    All = 0,
    Expired = 1,
    NotExpired = 2
}

const persianLabels: Record<DueStatus, string> = {
    [DueStatus.All]: 'همه',
    [DueStatus.Expired]: 'منقضی شده',
    [DueStatus.NotExpired]: 'منقضی نشده',
};

const formFieldOptions = Object.values(DueStatus)
    .filter(value => typeof value === 'number')
    .map(value => ({
        value: value as number,
        label: persianLabels[value as DueStatus]
    }));


export default function DueStatusAutoComplete(props: IProps) {
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
