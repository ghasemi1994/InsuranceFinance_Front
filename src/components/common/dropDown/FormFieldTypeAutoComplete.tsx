import { Autocomplete, TextField } from '@mui/material';
import React from 'react';
import { FormFieldType } from '../../../types/Form';


interface IProps {
    value?: number | null;
    onChange?: (value: number | null) => void;
    helperText?: string
    error?: boolean
    disabled?: boolean
}

const persianLabels: Record<FormFieldType, string> = {
    [FormFieldType.Text]: 'متن',
    [FormFieldType.Number]: 'عدد',
    [FormFieldType.List]: 'لیست',
    [FormFieldType.MotorcyclePlate]: 'پلاک موتورسیکلت',
    [FormFieldType.CarPlate]: 'پلاک خودرو',
    [FormFieldType.NationalCode]: 'کد ملی',
    [FormFieldType.PhoneNumber]: 'شماره تلفن',
    [FormFieldType.Date]: 'تاریخ',
    [FormFieldType.Vehicle]: 'وسیله نقلیه',
    [FormFieldType.People]: 'اشخاص',
    [FormFieldType.File]: 'فایل',
    [FormFieldType.MotorcycleType]: 'نوع موتور سیکلت'
};

// Convert enum to array of { value: number, label: string } objects
const formFieldOptions = Object.values(FormFieldType)
    .filter(value => typeof value === 'number')
    .map(value => ({
        value: value as number,
        label: persianLabels[value as FormFieldType]
    }));

export default function FormFieldTypeAutoComplete(props: IProps) {
    const { value, onChange } = props;

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
    );
}