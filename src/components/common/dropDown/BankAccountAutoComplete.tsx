import { Autocomplete, TextField } from '@mui/material';
import React from 'react'
import { IBankAccount } from '../../../types/BankAccount';
import { useBankStore } from '../../../stores/bankStore';


interface IProps {
    value?: number | null
    onChange?: (value: number | null) => void
}

export default function BankAccountAutoComplete(props: IProps) {

    const { value, onChange } = props;
    const { account: { dataList, status }, getAccountList } = useBankStore();


    const handleChange = (event: any, newValue: IBankAccount | null) => {
        if (onChange) {
            onChange(newValue ? newValue.id : null);
        }
    }

    const handleOpen = () => {
        if (status === 'idle')
            getAccountList();
    }

    return (
        <>
            <Autocomplete
                {...props}
                clearOnEscape
                onChange={handleChange}
                value={dataList?.find(c => c.id === value) ?? null}
                options={dataList ?? []}
                getOptionLabel={(e) => e.bankName + '-' + ' ' + e.accountNumber}
                getOptionKey={(e) => e.id ?? -1}
                getOptionDisabled={(option) => !option.isActive}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant='outlined'
                        label=""
                    />
                )}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
                loading={status === 'loading' ? true : false}
                onOpen={handleOpen}

            />
        </>
    )
}


