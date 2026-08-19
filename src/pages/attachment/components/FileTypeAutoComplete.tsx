import React, { useEffect, useState } from 'react'
import { IAttachmentTypeResponse } from '../../../types/Attachment';
import { getAttachmentTypeByEntityList } from '../../../server/services/attachmentService';
import { Autocomplete, TextField } from '@mui/material';

interface IProps {
    value?: number | null;
    onChange?: (value: IAttachmentTypeResponse | null) => void;
    entityName: string
    error?: boolean
    helperText?: string
}
export default function FileTypeAutoComplete({ onChange, value, error, helperText, entityName }: IProps) {

    const [data, setData] = useState<IAttachmentTypeResponse[]>([]);

    useEffect(() => {
        if (entityName)
            getData();
    }, [entityName])

    const getData = async () => {
        try {
            await getAttachmentTypeByEntityList(entityName)
                .then((res) => {
                    setData(res.data);
                });
        } catch { }
    }

    const handleChange = (event: any, newValue: IAttachmentTypeResponse | null) => {
        if (onChange) {
            onChange(newValue ? newValue : null);
        }
    };

    return (
        <>
            <Autocomplete
                onChange={handleChange}
                value={data.find(c => c.id === value) ?? null}
                options={data}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        sx={{ width: '100%' }}
                        error={error}
                        helperText={helperText}
                    />
                )}
                disableClearable={false}
                fullWidth
            />
        </>
    )
}
