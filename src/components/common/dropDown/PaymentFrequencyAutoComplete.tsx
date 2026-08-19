import React from 'react'
import { Autocomplete, TextField } from '@mui/material';
import { PaymentFrequencyType } from '@/types/Insurance';


interface IProps {
    value?: number | null;
    onChange?: (value: number | null) => void;
    helperText?: string
    error?: boolean
    disabled?: boolean
}


const persianLabels: Record<PaymentFrequencyType, string> = {
    [PaymentFrequencyType.Yearly]: 'سالانه',
    [PaymentFrequencyType.Monthly]: 'ماهانه',
    [PaymentFrequencyType.BiMonthly]: 'دوماهه',
    [PaymentFrequencyType.Quarterly]: 'سه‌ماهه',
    [PaymentFrequencyType.FourMonthly]: 'چهارماهه',
    [PaymentFrequencyType.SemiAnnually]: 'شش‌ماهه',

};

const formFieldOptions = Object.values(PaymentFrequencyType)
    .filter(value => typeof value === 'number')
    .map(value => ({
        value: value as number,
        label: persianLabels[value as PaymentFrequencyType]
    }));


{/**روش پرداخت برای بیمه های عمر */ }
export default function PaymentFrequencyAutoComplete(props: IProps) {
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
