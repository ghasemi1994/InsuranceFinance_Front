import { Autocomplete, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { IVehicleTypeUsageResponse } from '../../../types/Vehicle';
import { getVehicleTypeUsage } from '../../../server/services/vehicleService';





interface IProps {
    value?: number | null
    onChange?: (value: number | null) => void
    vehicleTypeId: number | null
    isRequired?: boolean
}

export default function VehicleTypeUsageAutoComplete(props: IProps) {

    const { value, onChange, vehicleTypeId, isRequired } = props;
    const [options, setOPtions] = useState<Array<IVehicleTypeUsageResponse>>([]);

    useEffect(() => {
        getData();
    }, [vehicleTypeId])

    const getData = async () => {
        if (vehicleTypeId) {
            await getVehicleTypeUsage(vehicleTypeId).then((response) => {
                setOPtions(response.data);
            });
        }
    }

    const handleChange = (event: any, newValue: IVehicleTypeUsageResponse | null) => {
        if (onChange) {
            onChange(newValue ? newValue.id : null);
        }
    }

    return (
        <>
            <Autocomplete
                {...props}
                onChange={handleChange}
                value={options.find(c => c.id === value) ?? null}
                options={options}
                getOptionLabel={(e) => e.title + ' (' + e.id + ')'}
                getOptionKey={(e) => e.id}
                renderInput={(params) => (
                    <TextField {...params} variant='outlined' required={isRequired} />
                )}
            />
        </>
    )
}


