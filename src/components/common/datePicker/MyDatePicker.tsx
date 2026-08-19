import React, { useEffect, useState } from 'react';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalaliV3';
import { FormHelperText } from '@mui/material';
import { parse } from 'date-fns-jalali';
import { format } from 'date-fns-jalali';

interface IProps {
    onChange?: (date: string | null) => void;
    value?: string | null;
    error?: boolean;
    helperText?: string;
    disabled?: boolean;
    label?: string;
    isRequired?: boolean
}

export default function MyDatePicker({
    onChange,
    value,
    error,
    helperText,
    disabled = false,
    label,
    isRequired
}: IProps) {

    const [dateValue, setDateValue] = useState<Date | null>(null);

    useEffect(() => {
        if (!value) {
            setDateValue(null);
            return;
        }
        // parse رشته Jalali به Date
        const dt = parse(value, 'yyyy/MM/dd', new Date());
        setDateValue(!isNaN(dt.getTime()) ? dt : null);
    }, [value]);

    const handleOnChange = (newValue: Date | null) => {
        if (newValue && !isNaN(newValue.getTime())) {
            setDateValue(newValue);
            const jalaliStr = format(newValue, 'yyyy/MM/dd');
            onChange?.(jalaliStr);
        } else {
            setDateValue(null);
            onChange?.(null);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
            <DatePicker
                onChange={handleOnChange}
                value={dateValue}
                disabled={disabled}
                label={label}
                format='dd/MM/yyyy'
                slotProps={{ textField: { fullWidth: true, required: isRequired } }}

            />
            {error && (
                <FormHelperText error={error}>
                    {helperText}
                </FormHelperText>
            )}
        </LocalizationProvider>
    );
}
