import { Button, FormControl, FormLabel, Grid2, TextField } from '@mui/material'
import React, { useEffect } from 'react'
import { IPersonResponse, IUpdatePersonRequest, PersonGroupType } from '../../../types/Person';
import { updatePersonApi } from '../../../server/services/personService';
import { NumericFormat } from 'react-number-format';
import toast from 'react-hot-toast';
import { usePeopleStore } from '../../../stores/peopleStore';
import { Controller, useForm } from 'react-hook-form';
import MyDatePicker from '../../../components/common/datePicker/MyDatePicker';

interface IProps {
    personId?: number | null,
    title?: string
    setPersonData?: (data: IPersonResponse | null) => void
}

export default function CorporatePersonModifier({ personId, title, setPersonData }: IProps) {
    const initialFormValue = {
        id: null,
        phoneNumber: '',
        phoneNumber2: '',
        phoneNumber3: '',
        phoneNumber4: '',
        ceoFullName: '',
        nationalId: '',
        companyName: '',
        personGroupTypeId: PersonGroupType.Corporate,
        registrationCode: '',
        registrationDate: null,
        jobAddress: '',
        economicCode: '',
    } as IUpdatePersonRequest

    const { person } = usePeopleStore();
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<IUpdatePersonRequest>({
        defaultValues: initialFormValue
    });

    useEffect(() => {
        if (person) {
            const newFormData = {
                id: person.id,
                ceoFullName: person.ceoFullName || '',
                nationalId: person.nationalId || '',
                companyName: person.companyName || '',
                phoneNumber: person.phoneNumber || '',
                phoneNumber2: person.phoneNumber2 || '',
                personGroupTypeId: PersonGroupType.Corporate,
                registrationCode: person.registrationCode || '',
                registrationDate: person.registrationDate || null,
                jobAddress: person.jobAddress || '',
                economicCode: person.economicCode || '',
                phoneNumber3: person.phoneNumber3,
                phoneNumber4: person.phoneNumber4
            };
            reset(newFormData);
            setPersonData?.(person);
        }
    }, [person, reset]);

    const onSubmit = async (data: IUpdatePersonRequest) => {
        try {
            await updatePersonApi(data);
            toast.success('اطلاعات با موفقيت ثبت شد');
        } catch (error) {
            toast.error('خطا در ثبت اطلاعات');
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid2 container spacing={2} marginTop={3}>
                <Grid2 size={{ xl: 4, lg: 4, sm: 12, md: 6, xs: 12 }}>
                    <FormControl fullWidth>
                        <FormLabel>نام شرکت</FormLabel>
                        <Controller
                            name="companyName"
                            control={control}
                            rules={{ required: 'فیلد اجباری' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    variant='outlined'
                                    error={!!errors.companyName}
                                    helperText={errors.companyName?.message}
                                />
                            )}
                        />
                    </FormControl>
                </Grid2>

                <Grid2 size={{ xl: 4, lg: 4, sm: 12, md: 6, xs: 12 }}>
                    <FormControl fullWidth>
                        <FormLabel>نام مدیر عامل</FormLabel>
                        <Controller
                            name="ceoFullName"
                            control={control}
                            rules={{ required: 'فیلد اجباری' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    variant='outlined'
                                    error={!!errors.ceoFullName}
                                    helperText={errors.ceoFullName?.message}
                                />
                            )}
                        />
                    </FormControl>
                </Grid2>

                <Grid2 size={{ xl: 4, lg: 4, sm: 12, md: 6, xs: 12 }}>
                    <FormControl fullWidth>
                        <FormLabel>شناسه اقتصادی</FormLabel>
                        <Controller
                            name="nationalId"
                            control={control}
                            rules={{ required: 'فیلد اجباری' }}
                            render={({ field }) => (
                                <NumericFormat
                                    {...field}
                                    customInput={TextField}
                                    variant='outlined'
                                    dir='ltr'
                                    allowLeadingZeros
                                    error={!!errors.nationalId}
                                    helperText={errors.nationalId?.message}
                                />
                            )}
                        />
                    </FormControl>
                </Grid2>

                <Grid2 size={{ xl: 4, lg: 4, sm: 12, md: 6, xs: 12 }}>
                    <FormControl fullWidth>
                        <FormLabel>شماره همراه</FormLabel>
                        <Controller
                            name="phoneNumber"
                            control={control}
                            rules={{
                                required: 'فیلد اجباری',
                                pattern: {
                                    value: /^[0-9]{11}$/,
                                    message: 'شماره همراه باید 11 رقم باشد'
                                }
                            }}
                            render={({ field }) => (
                                <NumericFormat
                                    {...field}
                                    customInput={TextField}
                                    variant='outlined'
                                    dir='ltr'
                                    allowLeadingZeros
                                    error={!!errors.phoneNumber}
                                    helperText={errors.phoneNumber?.message}
                                />
                            )}
                        />
                    </FormControl>
                </Grid2>

                <Grid2 size={{ xl: 4, lg: 4, sm: 12, md: 6, xs: 12 }}>
                    <FormControl fullWidth>
                        <FormLabel>شماره همراه (دوم)</FormLabel>
                        <Controller
                            name="phoneNumber2"
                            control={control}
                            rules={{
                                pattern: {
                                    value: /^[0-9]{0,11}$/,
                                    message: 'شماره همراه باید حداکثر 11 رقم باشد'
                                }
                            }}
                            render={({ field }) => (
                                <NumericFormat
                                    {...field}
                                    customInput={TextField}
                                    variant='outlined'
                                    dir='ltr'
                                    allowLeadingZeros
                                    error={!!errors.phoneNumber2}
                                    helperText={errors.phoneNumber2?.message}
                                />
                            )}
                        />
                    </FormControl>
                </Grid2>
                <Grid2 size={{ xl: 4, lg: 4, sm: 12, md: 6, xs: 12 }}>
                    <FormControl fullWidth>
                        <FormLabel>کد ثبتی</FormLabel>
                        <Controller
                            control={control}
                            name='registrationCode'
                            rules={{ required: 'فیلد اجباری است' }}
                            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) =>
                                <TextField variant='outlined'
                                    value={value}
                                    onBlur={onBlur}
                                    onChange={onChange}
                                    error={!!error}
                                    helperText={error?.message}
                                    dir='ltr'
                                />
                            }
                        />
                    </FormControl>
                </Grid2>
                <Grid2 size={{ xl: 4, lg: 4, sm: 12, md: 6, xs: 12 }}>
                    <FormControl fullWidth>
                        <FormLabel>تاریخ ثبت</FormLabel>
                        <Controller
                            control={control}
                            name='registrationDate'
                            render={({ field: { value, onChange }, fieldState: { error } }) =>
                                <MyDatePicker
                                    value={value}
                                    onChange={onChange}
                                    error={!!error}
                                    helperText={error?.message}
                                />
                            }
                        />
                    </FormControl>
                </Grid2>
                <Grid2 size={{ xl: 4, lg: 4, sm: 12, md: 6, xs: 12 }}>
                    <FormControl fullWidth>
                        <FormLabel>کد اقتصادی</FormLabel>
                        <Controller
                            control={control}
                            name='economicCode'
                            rules={{ required: 'فیلد اجباری است' }}
                            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) =>
                                <TextField variant='outlined'
                                    value={value}
                                    onBlur={onBlur}
                                    onChange={onChange}
                                    error={!!error}
                                    helperText={error?.message}
                                    dir='ltr'
                                />
                            }
                        />
                    </FormControl>
                </Grid2>
                <Grid2 size={{ xl: 4, lg: 4, sm: 12, md: 6, xs: 12 }}>
                    <FormControl fullWidth>
                        <FormLabel>شماره تلفن ثابت 1</FormLabel>
                        <Controller
                            control={control}
                            name='phoneNumber3'
                            render={({ field: { value, onChange, onBlur } }) =>
                                <NumericFormat
                                    customInput={TextField}
                                    variant='outlined'
                                    value={value}
                                    onBlur={onBlur}
                                    onChange={onChange}
                                    dir='ltr'
                                    allowLeadingZeros
                                />
                            }
                        />
                    </FormControl>
                </Grid2>
                <Grid2 size={{ xl: 4, lg: 4, sm: 12, md: 6, xs: 12 }}>
                    <FormControl fullWidth>
                        <FormLabel>شماره تلفن ثابت 2</FormLabel>
                        <Controller
                            control={control}
                            name='phoneNumber4'
                            render={({ field: { value, onChange, onBlur } }) =>
                                <NumericFormat
                                    customInput={TextField}
                                    variant='outlined'
                                    value={value}
                                    onBlur={onBlur}
                                    onChange={onChange}
                                    dir='ltr'
                                    allowLeadingZeros
                                />
                            }
                        />
                    </FormControl>
                </Grid2>
                <Grid2 size={{ xl: 12, lg: 12, sm: 12, md: 12, xs: 12 }}>
                    <FormControl fullWidth>
                        <FormLabel>آدرس</FormLabel>
                        <Controller
                            control={control}
                            name='jobAddress'
                            render={({ field: { value, onChange, onBlur } }) =>
                                <TextField variant='outlined'
                                    value={value}
                                    onBlur={onBlur}
                                    onChange={onChange}
                                />
                            }
                        />
                    </FormControl>
                </Grid2>

                <Grid2 size={12}>
                    <Button
                        type="submit"
                        color='success'
                        variant='contained'
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'در حال ثبت...' : 'ثبت اطلاعات'}
                    </Button>
                </Grid2>
            </Grid2>
        </form>
    )
}