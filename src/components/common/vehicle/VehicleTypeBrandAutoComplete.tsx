import { Autocomplete, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { IVehicleTypeBrandResponse } from '../../../types/Vehicle';
import { getVehicleTypeBrand } from '../../../server/services/vehicleService';


interface IProps {
    value?: number | null
    onChange?: (value: number | null) => void
    vehicleTypeId: number | null,
    isRequired?: boolean
    refreshTrigger?: any
}

export default function VehicleTypeBrandAutoComplete(props: IProps) {

    const { value, onChange, vehicleTypeId, isRequired } = props;
    const [options, setOPtions] = useState<Array<IVehicleTypeBrandResponse>>([]);

    useEffect(() => {
        getData();
    }, [vehicleTypeId])

    useEffect(() => {
        if (vehicleTypeId) {
            getData();
        }
    }, [props.refreshTrigger]);

    const getData = async () => {
        if (vehicleTypeId) {
            await getVehicleTypeBrand(vehicleTypeId).then((response) => {
                setOPtions(response.data);
            });
        }
    }

    const handleChange = (event: any, newValue: IVehicleTypeBrandResponse | null) => {
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
                    <TextField
                        {...params}
                        variant='outlined'
                        required={isRequired}
                    />
                )}
            />
        </>
    )
}


