import { toPersianDate } from '@/utils/convertion'
import { Autocomplete, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'


interface IProps {
    value?: number | null
    onChange?: (value: number | null) => void
    width?: string
    error?: boolean,
    helperText?: string,
    disabled?: boolean
    setText?: (text: string | null) => void
    isRequired?: boolean,
    lifeInsuranceYear: number
}

export default function LifeInsuranceYearAutoComplete(props: IProps) {
    const {
        value,
        onChange,
        width,
        error,
        helperText,
        disabled,
        setText,
        isRequired,
        lifeInsuranceYear
    } = props;


    const currentYear = Number(toPersianDate(new Date())?.toString().split("/")[0]);
    const [years, setYears] = useState<{ id: number, label: string }[]>([{ id: currentYear, label: currentYear.toString() }]);

    useEffect(() => {
        let year = currentYear;
        for (let index = 1; index < lifeInsuranceYear; index++) {
            year = year + 1;
            years.push({ id: year, label: (year).toString() });
        }
    }, [])


    const handleChange = (event: any, newValue: { id: number, label: string } | null) => {
        if (onChange) {
            onChange(newValue ? newValue?.id : null);
            setText?.(newValue ? newValue.label : null);
        }
    }


    return (
        <>
            <Autocomplete
                sx={{ width: width ?? '100%' }}
                onChange={handleChange}
                value={years?.find(c => c.id === value) ?? null}
                options={years ?? []}
                getOptionLabel={(e) => e.label}
                getOptionKey={(e) => e.id}
                loadingText='در حال دريافت اطلاعات ...'
                noOptionsText='اطلاعاتی یافت نشد'
                disabled={disabled}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant='outlined'
                        disabled={disabled}
                        label=""
                        sx={{ width: '100%' }}
                        error={error}
                        helperText={helperText}
                        required={isRequired}
                    />
                )}
                isOptionEqualToValue={(option, value) => option.id === value?.id}

            />
        </>
    )

}

