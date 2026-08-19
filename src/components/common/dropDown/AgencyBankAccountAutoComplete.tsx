import { Autocomplete, TextField } from '@mui/material';
import React, { useState } from 'react'
import { getAgencyBankAccount } from '../../../server/services/companyService';
import { ICompanyAgencyBankAccountResponse } from '../../../types/Company';


interface IProps {
    value?: number | null
    onChange?: (value: number | null) => void,
    companyAgencyId: number
}

export default function AgencyBankAccountAutoComplete(props: IProps) {

    const { value, onChange } = props;
    const [data, setData] = useState<Array<ICompanyAgencyBankAccountResponse>>([]);
    const [loading, setLoading] = useState(false);

    const handleChange = (event: any, newValue: ICompanyAgencyBankAccountResponse | null) => {
        if (onChange) {
            onChange(newValue ? newValue.id : null);
        }
    }

    const handleOpen = () => {
        getData();
    }

    const getData = async () => {
        try {
            setLoading(true);
            await getAgencyBankAccount(props.companyAgencyId).then((res) => {
                setData(res.data);
            });
        } catch { } finally { setLoading(false); }
    }


    return (
        <>
            <Autocomplete
                {...props}
                clearOnEscape
                onChange={handleChange}
                value={data?.find(c => c.id === value) ?? null}
                options={data ?? []}
                getOptionLabel={(e) => e.bankName + '-' + ' ' + e.accountNumber}
                getOptionKey={(e) => e.id ?? -1}
                //getOptionDisabled={(option) => !option.isActive}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant='outlined'
                        label=""
                    />
                )}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
                loading={loading}
                onOpen={handleOpen}

            />
        </>
    )
}


