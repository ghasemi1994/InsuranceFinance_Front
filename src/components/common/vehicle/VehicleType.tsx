import { FormControl, FormLabel, Grid2, Stack, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import VehicleTypeAutoComplete from './VehicleTypeAutoComplete';
import VehicleTypeUsageAutoComplete from './VehicleTypeUsageAutoComplete';
import VehicleTypeBrandAutoComplete from './VehicleTypeBrandAutoComplete';
import VehicleTypeTipAutoComplete from './VehicleTypeTipAutoComplete';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

export interface VehicleData {
    vehicleTypeId: number | null;
    vehicleTypeUsageId: number | null;
    vehicleTypeBrandId: number | null;
    vehicleTypeTipId: number | null;
}

interface VehicleProps {
    value?: VehicleData;
    onChange?: (data: VehicleData) => void;
    isRequired?: boolean
}

export default function VehicleType({ value, onChange, isRequired }: VehicleProps) {

    // State برای مدیریت مقادیر داخلی
    const [internalValue, setInternalValue] = useState<VehicleData>({
        vehicleTypeId: null,
        vehicleTypeUsageId: null,
        vehicleTypeBrandId: null,
        vehicleTypeTipId: null,
    });

    // همگام‌سازی مقادیر خارجی با state داخلی
    useEffect(() => {
        if (value) {
            setInternalValue(value);
        }
    }, [value]);

    // تابع برای به‌روزرسانی هر فیلد
    const handleFieldChange = (field: keyof VehicleData) => (newValue: number | null) => {
        const updatedValue = {
            ...internalValue,
            [field]: newValue,
            // ریست کردن فیلدهای وابسته هنگام تغییر فیلدهای والد
            ...(field === 'vehicleTypeId' && {
                vehicleTypeUsageId: null,
                vehicleTypeBrandId: null,
                vehicleTypeTipId: null,                
            }),
            ...(field === 'vehicleTypeBrandId' && {
                vehicleTypeTipId: null,
            }),
        };
        setInternalValue(updatedValue);
        onChange?.(updatedValue);
    };

    return (
        <Grid2 container spacing={2} sx={{ width: '100%', justifyContent: 'center' }}>
            <Grid2 size={{ xl: 3, lg: 3, md: 6, sm: 6, xs: 12 }}>
                <FormControl fullWidth>
                    <FormLabel>نوع</FormLabel>
                    <VehicleTypeAutoComplete
                        onChange={handleFieldChange('vehicleTypeId')}
                        value={internalValue.vehicleTypeId}
                        isRequired={isRequired}
                    />
                </FormControl>
            </Grid2>

            <Grid2 size={{ xl: 3, lg: 3, md: 6, sm: 6, xs: 12 }}>
                <FormControl fullWidth>
                    <FormLabel>کاربری</FormLabel>
                    <VehicleTypeUsageAutoComplete
                        vehicleTypeId={internalValue.vehicleTypeId}
                        onChange={handleFieldChange('vehicleTypeUsageId')}
                        value={internalValue.vehicleTypeUsageId}
                        isRequired={isRequired}
                    />
                </FormControl>
            </Grid2>

            <Grid2 size={{ xl: 3, lg: 3, md: 6, sm: 6, xs: 12 }}>
                <FormControl fullWidth>
                    <FormLabel>برند</FormLabel>
                    <VehicleTypeBrandAutoComplete
                        vehicleTypeId={internalValue.vehicleTypeId}
                        onChange={handleFieldChange('vehicleTypeBrandId')}
                        value={internalValue.vehicleTypeBrandId}
                        isRequired={isRequired}
                    />
                </FormControl>
            </Grid2>

            <Grid2 size={{ xl: 3, lg: 3, md: 6, sm: 6, xs: 12 }}>
                <FormControl fullWidth>
                    <Stack justifyContent={'space-between'} flexDirection={'row'}>
                        <FormLabel>تیپ</FormLabel>
                        <Tooltip title=" ثبت تیپ جدید">
                            <Link to={'/vehicle'} target='_blank'><Add /></Link>
                        </Tooltip>
                    </Stack>
                    <VehicleTypeTipAutoComplete
                        vehicleTypeId={internalValue.vehicleTypeId}
                        vehicleTypeBrandId={internalValue.vehicleTypeBrandId}
                        onChange={handleFieldChange('vehicleTypeTipId')}
                        value={internalValue.vehicleTypeTipId}
                        isRequired={isRequired}
                    />
                </FormControl>
            </Grid2>
        </Grid2>
    );
}