import { Autocomplete, TextField } from '@mui/material';
import React, { useEffect } from 'react'
import { ICompanyResponse } from '../../../types/Company';
import { useCompanyStore } from '../../../stores/companyStore';




interface IProps {
    value?: number | null
    onChange?: (value: number | null) => void
    helperText?: string
    error?: boolean,
    descriptionValue?: (description: string) => void
}

export default function CompanyAutoComplete(props: IProps) {

    const { value, onChange, error, helperText, descriptionValue } = props;
    const { dataList, getList, status } = useCompanyStore();

    const getData = async () => {
        if (status === 'idle')
            await getList();
    }

    useEffect(() => {
        if (value)
            getData();
    }, [value])

    const handleChange = (event: any, newValue: ICompanyResponse | null) => {
        if (onChange) {
            onChange(newValue ? newValue.id : null);
            const current = dataList?.find(c => c.id === newValue?.id);
            descriptionValue?.(current?.description ?? '');
        }
    }

    return (
        <>
            <Autocomplete
                onChange={handleChange}
                value={dataList?.find(c => c.id === value) ?? null}
                options={dataList?.filter(c => c.isActive) ?? []}
                getOptionLabel={(e) => e.code + ' _ ' + e.name}
                getOptionKey={(e) => e.id}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
                getOptionDisabled={(option) => !option.isActive}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant='outlined'
                        label=""
                        error={error}
                        helperText={helperText}
                    />
                )}
                onOpen={() => getData()}
            // renderOption={(props, option) => (
            //     <li {...props} key={option.id}>
            //         <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            //             {option.logoUrl && (
            //                 <img
            //                     src={option.logoUrl}
            //                     alt={option.name}
            //                     style={{ width: '24px', height: '24px', objectFit: 'contain' }}
            //                 />
            //             )}
            //             <span>{option.code + ' _ ' + option.name}</span>
            //         </div>
            //     </li>
            // )}
            />
        </>
    )
}


