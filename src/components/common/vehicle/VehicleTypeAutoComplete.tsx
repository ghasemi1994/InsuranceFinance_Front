import { Autocomplete, TextField } from '@mui/material';
import React, { useEffect } from 'react'
import { IVehicleTypeResponse } from '../../../types/Vehicle';
import { useVehicleStore } from '../../../stores/vehicleStore';





interface IProps {
    value?: number | null
    onChange?: (value: number | null) => void
    isRequired?: boolean
}

export default function VehicleTypeAutoComplete(props: IProps) {

    const { value, onChange, isRequired } = props;
    const { getVehicleTypeList, status, vehicleTypeList } = useVehicleStore();

    const handleChange = (event: any, newValue: IVehicleTypeResponse | null) => {
        if (onChange) {
            onChange(newValue ? newValue.id : null);
        }
    }

    useEffect(() => {
        if (status === 'idle')
            getVehicleTypeList();
    }, [])

    return (
        <>
            <Autocomplete
                {...props}
                onChange={handleChange}
                value={vehicleTypeList?.find(c => c.id === value) ?? null}
                options={vehicleTypeList ?? []}
                getOptionLabel={(e) => e.title + ' (' + e.id + ')'}
                getOptionKey={(e) => e.id}
                renderInput={(params) => (
                    <TextField {...params} variant='outlined' required={isRequired} />
                )}
                loading={status === 'loading' ? true : false}
            />
        </>
    )
}


