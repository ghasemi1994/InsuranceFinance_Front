import { Divider, FormControl, FormLabel, Grid2, Stack, TextField, Tooltip } from '@mui/material';
import React, { useState } from 'react'
import PeopleAutoComplete from '../../../components/common/dropDown/PeopleAutoComplete';
import MarketerAutoComplete from '../../../components/common/dropDown/MarketerAutoComplete';
import { Link } from 'react-router-dom';
import { Add } from '@mui/icons-material';
import { Controller, useFormContext } from 'react-hook-form';
import useKeyPress from '../../../hooks/useKeyPress';
import CreateOrUpdateDialog from '../../people/components/CreateOrUpdate';
import { useInsurancePolicyStore } from '@/stores/insurancePolicyStore';
import { checkInsuranceNo } from '@/server/services/insuranceService';

/**بیمه گذار */
export default function InsurerStep() {

    const [open, setOpen] = useState(false);
    useKeyPress('F2', () => setOpen(true));

    const { control, watch, setError, clearErrors } = useFormContext();

    const { setFormData, formData } = useInsurancePolicyStore();

    const onBlurCheckInsuranceNo = async (value: string) => {
        if (value) {
            try {
                await checkInsuranceNo(watch('id') ?? null, watch('insuranceNo')?.toString() ?? '')
                    .then((res) => {
                        if (res?.data === true) {
                            //toast.error('شماره بیمه نامه قبلا ثبت شده است');
                            //return;
                            setError('insuranceNo', {
                                type: 'manual',
                                message: 'شماره بیمه نامه قبلا ثبت شده است'
                            });
                        } else {
                            clearErrors('insuranceNo');
                        }
                    })
            } catch (error) {

            }
        }
    }

    return (
        <>

            {/* create-prson dialog */}
            <CreateOrUpdateDialog
                open={open}
                onClose={() => setOpen(false)}
            />
            {/* end create-prson dialog */}
            <Grid2 container>
                <Grid2 size={{ xl: 2, lg: 3, sm: 12, md: 6, xs: 12 }}>
                    <FormControl fullWidth>
                        <FormLabel>شماره بیمه</FormLabel>
                        <Controller
                            name="insuranceNo"
                            control={control}
                            render={({ fieldState: { error }, field: { onChange, value, onBlur } }) => (
                                <TextField
                                    onChange={(e) => {
                                        onChange(e);
                                        clearErrors('insuranceNo');
                                    }}
                                    value={value}
                                    variant='outlined'
                                    dir='ltr'
                                    error={!!error}
                                    helperText={error?.message}
                                    onBlur={(e) => {
                                        onBlur();
                                        onBlurCheckInsuranceNo(value);
                                    }}
                                />
                            )}
                        />

                    </FormControl>
                </Grid2>
            </Grid2>
            <Divider />
            <Grid2 container spacing={2}>
                <Grid2 size={{ xl: 4, lg: 4, sm: 12, md: 6, xs: 12 }}>
                    <FormControl fullWidth>
                        <Stack justifyContent={'space-between'} flexDirection={'row'}>
                            <FormLabel>بیمه گذار</FormLabel>
                            <Tooltip title="ثبت شخص جدید (F2)">
                                <span onClick={() => setOpen(true)}>
                                    <Add color='primary' sx={{ cursor: 'pointer' }} />
                                </span>
                            </Tooltip>
                        </Stack>
                        <Controller
                            name="personId"
                            control={control}
                            render={({ fieldState: { error }, field: { value, onChange } }) => (
                                <PeopleAutoComplete
                                    onChange={onChange}
                                    value={value}
                                    error={!!error}
                                    helperText={error?.message}
                                    setText={(fullName) => setFormData({ ...formData, customerFullName: fullName ?? '' })}
                                />
                            )}
                        />
                    </FormControl>
                </Grid2>
                <Grid2 size={{ xl: 4, lg: 4, sm: 12, md: 6, xs: 12 }}>
                    <FormControl fullWidth>
                        <Stack justifyContent={'space-between'} flexDirection={'row'}>
                            <FormLabel>بازاریاب</FormLabel>
                            <Tooltip title="ایجاد بازاریاب جدید">
                                <Link to='/marketer'><Add color='primary' /></Link>
                            </Tooltip>
                        </Stack>
                        <Controller
                            name="personMarketerId"
                            control={control}
                            render={({ fieldState: { error }, field: { onChange, value } }) => (
                                <MarketerAutoComplete
                                    onChange={onChange}
                                    value={value}
                                    error={!!error}
                                    helperText={error?.message}
                                    setText={(fullName) => setFormData({ ...formData, marketerFullName: fullName ?? '' })}
                                />
                            )}
                        />
                    </FormControl>
                </Grid2>
                <Grid2 size={{ xl: 4, lg: 4, sm: 12, md: 6, xs: 12 }}>
                    <FormControl fullWidth>
                        <Stack justifyContent={'space-between'} flexDirection={'row'}>
                            <FormLabel>معرف / ضامن</FormLabel>
                            <Tooltip title="ثبت شخص جدید (F2)">
                                <span onClick={() => setOpen(true)}>
                                    <Add color='primary' sx={{ cursor: 'pointer' }} />
                                </span>
                            </Tooltip>
                        </Stack>
                        <Controller
                            name="introducerPersonId"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <PeopleAutoComplete
                                    onChange={onChange}
                                    value={value}
                                    setText={(fullName) => setFormData({ ...formData, introducerFullName: fullName ?? '' })}
                                />
                            )}
                        />

                    </FormControl>
                </Grid2>
            </Grid2>

        </>
    )
}
