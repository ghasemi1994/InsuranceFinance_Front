import { getRoleList } from '@/server/services/permissionService';
import { RoleResponse } from '@/types/PermissionTypes';
import { Autocomplete, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'


interface IProps {
    value?: number | null
    onChange?: (value: number | null) => void
    error?: boolean,
    helperText?: string
}

export default function RoleAutoComplete(props: IProps) {

    const [data, setData] = useState<RoleResponse[]>([]);
    const { value, onChange, error, helperText } = props;

    const handleChange = (event: any, newValue: RoleResponse | null) => {
        if (onChange) {
            onChange(newValue ? newValue.id : null);
        }
    }

    const getData = async () => {
        await getRoleList().then((res) => {
            setData(res?.data);
        });
    }

    useEffect(() => { 
        getData();
    }, [])

    return (
        <Autocomplete
            {...props}
            clearOnEscape
            onChange={handleChange}
            value={data?.find(c => c.id === value) ?? null}
            options={data ?? []}
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
        />
    )
}
