import { Autocomplete, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { IVehicleTypeModelResponse } from '../../../types/Vehicle';
import { getVehicleTypeModel } from '../../../server/services/vehicleService';


interface IProps {
    value?: number | null
    onChange?: (value: number | null) => void
    vehicleTypeId: number | null
    vehicleTypeBrandId: number | null,
    isRequired?: boolean
}

export default function VehicleTypeTipAutoComplete(props: IProps) {

    const { value, onChange, vehicleTypeId, vehicleTypeBrandId, isRequired } = props;
    const [options, setOPtions] = useState<Array<IVehicleTypeModelResponse>>([]);

    useEffect(() => {
        getData();
    }, [vehicleTypeId, vehicleTypeBrandId])

    const getData = async () => {
        if (vehicleTypeId && vehicleTypeBrandId) {
            await getVehicleTypeModel(vehicleTypeId, vehicleTypeBrandId).then((response) => {
                setOPtions(response.data);
            });
        }
    }

    const handleChange = (event: any, newValue: IVehicleTypeModelResponse | null) => {
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
                onOpen={() => getData()}
            />
        </>
    )
}


