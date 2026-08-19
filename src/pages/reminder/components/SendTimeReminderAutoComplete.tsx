import { SendTimeReminder } from '@/types/Reminder';
import { Autocomplete, TextField } from '@mui/material';
import React from 'react'


const types: Record<SendTimeReminder, string> = {

    [SendTimeReminder.CurrentDay]: '📅 آخرین روز سررسید',
    [SendTimeReminder.ADayBefore]: '📆  1 روز مانده ',
    [SendTimeReminder.TowDayBefore]: '📆 2 روز مانده',
    [SendTimeReminder.ThreeDayBefore]: '📆 3 روز مانده',
    [SendTimeReminder.FourDayBefore]: '📆 4 روز مانده',
    [SendTimeReminder.FiveDayBefore]: '📆 5 روز مانده',
    [SendTimeReminder.SixDayBefore]: '📆 6 روز مانده',
    [SendTimeReminder.SevenDayBefore]: '📆 7 روز مانده',
    [SendTimeReminder.EightDayBefore]: '📆 8 روز مانده',
    [SendTimeReminder.NineDayBefore]: '📆 9 روز مانده',
    [SendTimeReminder.TenDayBefore]: '📆 10 روز مانده',
    [SendTimeReminder.Expired]: '📆 منقضی شده ها',
};

const baseOptions = Object.values(SendTimeReminder)
    .filter(value => typeof value === 'number')
    .map(value => ({
        value: value as number,
        label: types[value as SendTimeReminder]
    }));

interface IProps {
    value?: number | null
    onChange?: (value: number | null) => void
    error?: boolean
    helperText?: string
    disabled?: boolean
    removeOptions?: SendTimeReminder[]
    isRequired?: boolean
}

export default function SendTimeReminderAutoComplete(props: IProps) {
    const { value, onChange, removeOptions = [], disabled, error, helperText, isRequired } = props;

    const filteredOptions = baseOptions.filter(option =>
        !removeOptions.includes(option.value as SendTimeReminder)
    );

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
                    sx={{
                        '& .MuiInputBase-input': {
                            color: value && value < 0 ? '#f44336' : 'inherit',
                        }
                    }}
                />
            )}
            isOptionEqualToValue={(option, value) => option.value === value?.value}
            renderOption={(props, option) => {
                const isNegative = option.value < 0;
                return (
                    <li {...props}>
                        <span style={{ color: isNegative ? '#f44336' : 'inherit' }}>
                            {option.label}
                        </span>
                    </li>
                );
            }}
        />
    )
}
