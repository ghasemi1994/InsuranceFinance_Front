import { Autocomplete, TextField, Chip } from '@mui/material';
import React, { useEffect } from 'react'
import { ICategoryResponse } from '../../../types/Category';
import { useCategoryStore } from './../../../stores/categoryStore';

{/** onChange return id,code */ }
interface IProps {
    value?: number | null
    onChange?: (value: number | null, code?: string | null) => void
    helperText?: string
    error?: boolean,
    disable?: boolean
}

export default function CategoryAutoComplete(props: IProps) {
    const { value, onChange, helperText, error, disable } = props;
    const { dataList, getList, status } = useCategoryStore();

    const handleChange = (event: any, newValue: ICategoryResponse | null) => {
        if (!onChange) return;
        onChange(newValue ? (newValue as ICategoryResponse).id : null, newValue ? (newValue as ICategoryResponse).code : null);

    };

    const handleOpen = () => {
        if (status === 'idle') {
            getList();
        }
    };
    useEffect(() => {
        if (value)
            if (status === 'idle') {
                getList();
            }
    }, [value])


    return (
        <Autocomplete
            disabled={disable}
            onChange={handleChange}
            value={dataList?.find(c => c.id === value) ?? null}
            options={dataList ?? []}
            getOptionLabel={(option) => `${option.code} - ${option.name}`}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    helperText={helperText}
                    error={error}
                />
            )}
            renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                    <Chip
                        {...getTagProps({ index })}
                        key={option.id}
                        label={`${option.code} - ${option.name}`}
                    />
                ))
            }
            loading={status === 'loading'}
            onOpen={handleOpen}
        />
    );
}