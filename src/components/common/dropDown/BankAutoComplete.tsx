import { Autocomplete, TextField } from '@mui/material';
import React, { useEffect } from 'react'
import { IBankResponse } from '../../../types/Bank';
import { useBankStore } from '../../../stores/bankStore';


interface IProps {
    value?: number | null
    onChange?: (value: number | null) => void
    error?: boolean,
    helperText?: string
}

export default function BankAutoComplete(props: IProps) {

    const { value, onChange, error, helperText } = props;
    const { bank: { dataList, status }, getBankList } = useBankStore();

    const handleChange = (event: any, newValue: IBankResponse | null) => {
        if (onChange) {
            onChange(newValue ? newValue.id : null);
        }
    }

    const handleOpen = () => {
        if (status === 'idle')
            getBankList();
    }

    useEffect(() => {
        if (value)
            getBankList();
    }, [value])

    return (
        <>
            <Autocomplete
                {...props}
                clearOnEscape
                onChange={handleChange}
                value={dataList?.find(c => c.id === value) ?? null}
                options={dataList ?? []}
                getOptionLabel={(e) => e.name}
                getOptionKey={(e) => e.id ?? -1}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant='outlined'
                        label=""
                        error={error}
                        helperText={helperText}
                    />
                )}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
                loading={status === 'loading' ? true : false}
                onOpen={handleOpen}

            />
        </>
    )
}


