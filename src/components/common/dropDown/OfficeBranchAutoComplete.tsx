import { getBranchList } from '@/server/services/officeService'
import { getUserList } from '@/server/services/userService'
import { BranchResponse } from '@/types/OfficeTypes'
import { IUserResponse } from '@/types/User'
import { Autocomplete, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'



interface IProps {
    value?: number | null
    onChange?: (value: number | null) => void
    error?: boolean,
    helperText?: string
}
export default function OfficeBranchAutoComplete({ error, helperText, onChange, value }: IProps) {

    const [dataList, setDataList] = useState<BranchResponse[]>([]);


    const getData = async () => {
        await getBranchList().then((res) => {
            setDataList(res?.data ?? []);
        });
    }

    const handleChange = (event: any, newValue: BranchResponse | null) => {
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
                getOptionLabel={(e) => e.name + ' ' + e.code}
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
