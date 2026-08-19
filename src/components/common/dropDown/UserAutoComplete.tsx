import { getUserList } from '@/server/services/userService'
import { IUserResponse } from '@/types/User'
import { Autocomplete, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'



interface IProps {
    value?: number | null
    onChange?: (value: number | null) => void
    error?: boolean,
    helperText?: string
}
export default function UserAutoComplete({ error, helperText, onChange, value }: IProps) {

    const [dataList, setDataList] = useState<IUserResponse[]>([]);


    const getData = async () => {
        await getUserList().then((res) => {
            setDataList(res?.data ?? []);
        });
    }

    const handleChange = (event: any, newValue: IUserResponse | null) => {
        if (onChange) {
            onChange(newValue ? newValue.id : null);
        }
    }

    useEffect(() => {
        getData();
    }, [])


    return (
        <>
            <Autocomplete
                clearOnEscape
                onChange={handleChange}
                value={dataList?.find(c => c.id === value) ?? null}
                options={dataList ?? []}
                getOptionLabel={(e) => e.fullName + ' ' + e.userName}
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
            //loading={status === 'loading' ? true : false}
            //onOpen={handleOpen}

            />
        </>
    )
}
