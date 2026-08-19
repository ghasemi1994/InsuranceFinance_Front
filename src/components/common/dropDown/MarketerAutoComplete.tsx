import { Autocomplete, TextField } from '@mui/material';
import React, { useEffect } from 'react'
import { IMarketerResponse } from '../../../types/Person';
import { useMarketerStore } from '../../../stores/marketerStore';




interface IProps {
    value?: number | null
    onChange?: (value: number | null) => void
    error?: boolean,
    helperText?: string,
    setText?: (text: string | null) => void
}

export default function MarketerAutoComplete(props: IProps) {

    const { value, onChange, error, helperText, setText } = props;
    const { dataList, getList, status } = useMarketerStore();


    useEffect(() => {
        if (status === 'idle') {
            getList();
        }
    }, [status])

    useEffect(() => {
        if (value) {
            const marketer: IMarketerResponse | null | undefined = dataList?.find(c => c.id === value);
            setText?.(marketer?.fullName ?? '')
        }
    }, [value])

    const handleChange = (event: any, newValue: IMarketerResponse | null) => {
        if (onChange) {
            onChange(newValue ? newValue.id : null);
            setText?.(newValue ? newValue.fullName ?? '' : null);
        }
    }



    return (
        <>
            <Autocomplete
                loading={status === 'loading' ? true : false}
                onChange={handleChange}
                value={dataList?.find(c => c.id === value) ?? null}
                options={dataList?.filter(c => c.isActive) ?? []}
                getOptionLabel={(e) => e.fullName + " " + e?.nationalCode + " کد:" + e.marketerCode}
                getOptionKey={(e) => e.id}
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

            />
        </>
    )
}


