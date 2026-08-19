import { Autocomplete, TextField } from '@mui/material';
import React, { useState } from 'react';

interface IProps {
    value?: number | null;
    onChange?: (value: number | null) => void;
    error?: boolean
    helperText?: string
}

interface IFileSize {
    text: string;
    value: number | null;
}

export default function FileSizeAutoComplete({ onChange, value, error, helperText }: IProps) {
    const [data] = useState<IFileSize[]>([
        { text: '1MB', value: 1048576 },
        { text: '2MB', value: 2097152 },
        { text: '3MB', value: 3145728 },
        { text: '4MB', value: 4194304 },
        { text: '5MB', value: 5242880 },
        { text: '10MB', value: 10485760 },
        //{ text: '25MB', value: 26214400 },
        //{ text: '50MB', value: 52428800 },
        //{ text: '100MB', value: 104857600 }
    ]);

    const handleChange = (event: any, newValue: IFileSize | null) => {
        if (onChange) {
            onChange(newValue ? newValue.value : null);
        }
    };

    return (
        <Autocomplete
            onChange={handleChange}
            value={data.find(c => c.value === value) ?? null}
            options={data}
            getOptionLabel={(option) => option.text}
            isOptionEqualToValue={(option, value) => option.value === value?.value}
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
    );
}