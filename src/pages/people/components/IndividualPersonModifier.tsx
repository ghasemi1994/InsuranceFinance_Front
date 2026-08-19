import { Button, Checkbox, FormControl, FormControlLabel, FormLabel, Grid2, Stack, TextField } from '@mui/material'
import React, { useEffect } from 'react'
import { IPersonResponse, IUpdatePersonRequest, PersonGroupType } from '../../../types/Person';
import { updatePersonApi } from '../../../server/services/personService';
import { NumericFormat } from 'react-number-format';
import MyDatePicker from '../../../components/common/datePicker/MyDatePicker';
import moment from 'moment-jalaali';
import toast from 'react-hot-toast';
import { toPersianDate } from '../../../utils/convertion';
import { usePeopleStore } from '../../../stores/peopleStore';
import { useForm, Controller } from 'react-hook-form';

interface IProps {
    personId?: number | null,
    title?: string
    setPersonData?: (data: IPersonResponse | null) => void
}

export default function IndividualPersonModifier({ personId, title, setPersonData }: IProps) {
    const initialFormValue = {
        firstName: '',
        certificateNo: '',
        dateOfBirth: null,
        fatherName: '',
        homeAddress: '',
        homePostalCode: '',
        issuedFrom: '',
        lastName: '',
        nationalCode: '',
        id: null,
        phoneNumber: '',
        phoneNumber2: '',
        isForeigner: false,
        foreignerCode: '',
        personGroupTypeId: PersonGroupType.Individual,
        phoneNumber3: '',
        phoneNumber4: '',
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
                firstName: person.firstName || '',
                lastName: person.lastName || '',
                nationalCode: person.nationalCode || '',
                phoneNumber: person.phoneNumber || '',
                phoneNumber2: person.phoneNumber2 || '',
                fatherName: person.fatherName || '',
                homePostalCode: person.homePostalCode || '',
                homeAddress: person.homeAddress || '',
                certificateNo: person.certificateNo || '',
                dateOfBirth: person.dateOfBirth,
                personGroupTypeId: PersonGroupType.Individual,
                isForeigner: person.isForeigner,
                foreignerCode: person.foreignerCode,
                phoneNumber3: person.phoneNumber3,
                phoneNumber4: person.phoneNumber4
            };
            reset(newFormData);
            setPersonData?.(person);
        }
    }, [person, reset]);

    const onSubmit = async (data: IUpdatePersonRequest) => {
        try {
            const requestData = {
                ...data,
                dateOfBirth: data.dateOfBirth,
            };
            await updatePersonApi(requestData);
            toast.success('اطلاعات با موفقيت ثبت شد');
        } catch (error) {
            toast.error('خطا در ثبت اطلاعات');
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid2 container spacing={2}>
                <Grid2 size={{ xl: 4, lg: 4, sm: 12, md: 6, xs: 12 }}>
                    <FormControl fullWidth>
                        <FormLabel>نام</FormLabel>
                        <Controller
                            name="firstName"
                            control={control}
                            rules={{ required: 'فیلد اجباری' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    variant='outlined'
                                    error={!!errors.firstName}
                                    helperText={errors.firstName?.message}
                                />
                            )}
                        />
                    </FormControl>
                </Grid2>
                <Grid2 size={{ xl: 4, lg: 4, sm: 12, md: 6, xs: 12 }}>
                    <FormControl fullWidth>
                        <FormLabel>نام خانوادگی</FormLabel>
                        <Controller
                            name="lastName"
                            control={control}
                            rules={{ required: 'فیلد اجباری' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    variant='outlined'
                                    error={!!errors.lastName}
                                    helperText={errors.lastName?.message}
                                />
                            )}
                        />
                    </FormControl>
                </Grid2>
                <Grid2 size={{ xl: 4, lg: 4, sm: 12, md: 6, xs: 12 }}>
                    <FormControl fullWidth>
                        <FormLabel>کد ملی</FormLabel>
                        <Controller
                            name="nationalCode"
                            control={control}
                            render={({ field }) => (
                                <NumericFormat
                                    {...field}
                                    customInput={TextField}
                                    variant='outlined'
                                    dir='ltr'
                                    allowLeadingZeros
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
                                    value: /^\d{11}$/,
                                    message: 'شماره همراه باید 11 رقم باشد'
                                }
                            }}
                            render={({ field }) => (
                                <NumericFormat
                                    {...field}
                                    customInput={TextField}
                                    variant='outlined'
                                    error={!!errors.phoneNumber}
                                    helperText={errors.phoneNumber?.message}
                                    dir='ltr'
                                    allowLeadingZeros
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
                            render={({ field }) => (
                                <NumericFormat
                                    {...field}
                                    customInput={TextField}
                                    variant='outlined'
                                    dir='ltr'
                                    allowLeadingZeros
                                />
                            )}
                        />
                    </FormControl>
                </Grid2>
                <Grid2 size={{ xl: 4, lg: 4, sm: 12, md: 6, xs: 12 }}>
                    <FormControl fullWidth>
                        <FormLabel>نام پدر</FormLabel>
                        <Controller
                            name="fatherName"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    variant='outlined'
                                />
                            )}
                        />
                    </FormControl>
                </Grid2>
                <Grid2 size={{ xl: 4, lg: 4, sm: 12, md: 6, xs: 12 }}>
                    <FormControl fullWidth>
                        <FormLabel>کد پستی</FormLabel>
                        <Controller
                            name="homePostalCode"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    variant='outlined'
                                />
                            )}
                        />
                    </FormControl>
                </Grid2>
                <Grid2 size={{ xl: 4, lg: 4, sm: 12, md: 6, xs: 12 }}>
                    <FormControl fullWidth>
                        <FormLabel>تاریخ تولد</FormLabel>
                        <Controller
                            name="dateOfBirth"
                            control={control}
                            render={({ field }) => (
                                <MyDatePicker
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </FormControl>
                </Grid2>
                <Grid2 size={{ xl: 4, lg: 4, sm: 12, md: 6, xs: 12 }}>
                    <FormControl fullWidth>
                        <FormLabel>شماره شناسنامه</FormLabel>
                        <Controller
                            name="certificateNo"
                            control={control}
                            render={({ field }) => (
                                <NumericFormat
                                    {...field}
                                    customInput={TextField}
                                    variant='outlined'
                                    dir='ltr'
                                    allowLeadingZeros
                                />
                            )}
                        />
                    </FormControl>
                </Grid2>
                <Grid2 size={{ xl: 4, lg: 4, sm: 12, md: 6, xs: 12 }}>
                    <FormControl fullWidth>
                        <FormLabel>اتباع می باشد؟</FormLabel>
                        <Controller
                            control={control}
                            name='isForeigner'
                            render={({ field: { onChange, value } }) => (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            color='error'
                                            onChange={onChange}
                                            value={value}
                                            checked={value}
                                        //defaultChecked={value}
                                        />
                                    }
                                    label="اتباع می باشد؟"
                                />
                            )}
                        />
                    </FormControl>
                </Grid2>
                <Grid2 size={{ xl: 4, lg: 4, sm: 12, md: 6, xs: 12 }}>
                    <FormControl fullWidth>
                        <FormLabel>کد اختصاصی اتباع</FormLabel>
                        <Controller
                            control={control}
                            name='foreignerCode'
                            render={({ field: { value, onChange, onBlur } }) =>
                                <TextField variant='outlined'
                                    value={value}
                                    onBlur={onBlur}
                                    onChange={onChange}
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
                <Grid2 size={{ xl: 12, lg: 12, sm: 12, md: 6, xs: 12 }}>
                    <FormControl fullWidth>
                        <FormLabel>آدرس</FormLabel>
                        <Controller
                            name="homeAddress"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    variant='outlined'
                                />
                            )}
                        />
                    </FormControl>
                </Grid2>

            </Grid2>
            <Grid2 sx={{ textAlign: 'end' }}>
                <Button
                    type='submit'
                    color='primary'
                    variant='contained'
                    disabled={isSubmitting}
                    sx={{ marginTop: 2 }}
                >
                    {isSubmitting ? 'در حال ثبت...' : 'ویرایش اطلاعات'}
                </Button>
            </Grid2>
        </form>
    )
}