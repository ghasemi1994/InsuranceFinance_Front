import { Autocomplete, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { ICompanyAgencyResponse } from '../../../types/Company';
import { getCompanyAgencyList } from '../../../server/services/companyService';




interface IProps {
    value?: number | null
    onChange?: (value: number | null) => void
    companyId: number
    error?: boolean
    helperText?: string
}

export default function CompanyAgencyAutoComplete(props: IProps) {

    const { value, onChange, companyId, error, helperText } = props;
    const [agency, setAgency] = useState<ICompanyAgencyResponse[]>([]);

    const getData = async () => {
        try {
            if (companyId && companyId > 0) {
                getCompanyAgencyList(companyId).then((response) => {
                    setAgency(response?.data);
                });
            }
        } catch { }
    }


    useEffect(() => {
        getData();
    }, [companyId])

    const handleChange = (event: any, newValue: ICompanyAgencyResponse | null) => {
        if (onChange) {
            onChange(newValue ? newValue.id : null);
        }
    }

    return (
        <>
            <Autocomplete              
                onChange={handleChange}
                value={agency?.find(c => c.id === value) ?? null}
                options={agency ?? []}
                getOptionLabel={(e) => e.fullName + " کد:" + e.code}
                getOptionKey={(e) => e.id}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant='outlined'
                        label=""
                        error={error}
                        helperText={helperText}
                    />
                )}               
            />
        </>
    )
}


