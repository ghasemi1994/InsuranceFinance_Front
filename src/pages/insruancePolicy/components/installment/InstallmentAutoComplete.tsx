import React from 'react'
import { IPolicyInstallmentItemResponse } from '../../../../types/Insurance'
import { Autocomplete, TextField } from '@mui/material';
import { digitSeprator } from '../../../../utils/text';



interface IProps {
    items: IPolicyInstallmentItemResponse[],
    value?: number | null
    onChange?: (value: number | null) => void,
    error?: boolean,
    helperText?: string,
    disabled?: boolean
}
export default function InstallmentAutoComplete({ items, error, helperText, onChange, value, disabled }: IProps) {

    const handleChange = (event: any, newValue: IPolicyInstallmentItemResponse | null) => {
        if (onChange) {
            onChange(newValue ? newValue.id : null);
        }
    }

    return (
        <>
            <Autocomplete
                options={items ?? []}
                getOptionLabel={(e) => e.dueTitle + " - " + e.dueDate + " - " + digitSeprator(e.dueAmount)}
                getOptionKey={(e) => e.id}
                onChange={handleChange}
                value={items.find(c => c.id === value) || null}
                getOptionDisabled={(option) => option.isPaid}
                disabled={disabled}
                renderInput={(params) => (
                    <TextField {...params}
                        variant='outlined'
                        label=""
                        sx={{ width: '100%' }}
                        error={!!error}
                        helperText={helperText}
                    />
                )}
            />
        </>
    )
}
