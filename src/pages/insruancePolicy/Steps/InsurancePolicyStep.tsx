import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    Grid2,
    Radio,
    RadioGroup,
    Stack,
    TextField,
    Tooltip,
} from '@mui/material'
import React, { useState } from 'react'
import { InsuranceTermType } from '../../../types/Enums';
import MyDatePicker from '../../../components/common/datePicker/MyDatePicker';
import { NumericFormat } from 'react-number-format';
import CategoryAutoComplete from '../../../components/common/dropDown/CategoryAutoComplete';
import CompanyAutoComplete from '../../../components/common/dropDown/CompanyAutoComplete';
import CompanyAgencyAutoComplete from '../../../components/common/dropDown/CompanyAgencyAutoComplete';
import { Controller, useFormContext } from 'react-hook-form';
import { useInsurancePolicyStore } from '../../../stores/insurancePolicyStore';
import { useFormStore } from '../../../stores/formStore';
import { toMiladiDate, toPersianDate } from '../../../utils/convertion';


interface IProps {
    policyRenewal: boolean
}
/**بیمه نامه */
export default function InsurancePolicyStep({ policyRenewal }: IProps) {

    const { control, watch, setValue } = useFormContext();
    const { setFormData, formData } = useInsurancePolicyStore();

    const { resetFormFieldValue } = useFormStore();
    const [companyDescription, setCompanyDescription] = useState('');

    const handleTermType = (value: number) => {
        setValue('insuranceTermTypeId', value);
    }

    const getExpireDate = (insuranceTermValue: number) => {
        if (!watch('insuranceStartDate'))
            return

        const dateString = toMiladiDate(watch('insuranceStartDate'));
        const expireDate = dateString ? new Date(dateString) : null;

        if (watch('insuranceTermTypeId') === InsuranceTermType.Monthly) {
            expireDate?.setMonth(expireDate.getMonth() + insuranceTermValue);
        }
        else {
            expireDate?.setDate(expireDate.getDate() + insuranceTermValue);
        }
        const persianExpireDate = toPersianDate(expireDate);
        return persianExpireDate;
    }

    const handleCategoryChange = (id: number, code: string | null) => {
        resetFormFieldValue();
        setValue('categoryId', id);
        setFormData({ ...formData, categoryId: id, categoryCode: code });
    }

    return (
        <>

            <Grid2 container spacing={2}>
                <Grid2 size={{ xl: 3, lg: 3, sm: 12, md: 6, xs: 12 }}>
                    <FormControl fullWidth>
                        <FormLabel>دسته بندی / بیمه</FormLabel>
                        <Controller
                            name="categoryId"
                            control={control}
                            render={({ fieldState: { error }, field: { onChange, value } }) => (
                                <CategoryAutoComplete
                                    onChange={(e, code) => handleCategoryChange(Number(e), code ? code : null)}
                                    value={value}
                                    error={!!error}
                                    helperText={error?.message}
                                    disable={policyRenewal}

                                />
                            )}
                        />
                    </FormControl>
                </Grid2>
                <Grid2 size={{ xl: 3, lg: 3, sm: 12, md: 6, xs: 12 }}>
                    <FormControl fullWidth>
                        <FormLabel>بیمه گر (شرکت بیمه)</FormLabel>
                        <Controller
                            name="companyId"
                            control={control}
                            render={({ fieldState: { error }, field: { onChange, value } }) => (
                                <CompanyAutoComplete
                                    onChange={onChange}
                                    value={value}
                                    error={!!error}
                                    helperText={error?.message}
                                    descriptionValue={setCompanyDescription}
                                />
                            )}
                        />
                        <FormHelperText sx={{ color: '#1976d2' }}>{companyDescription}</FormHelperText>
                    </FormControl>
                </Grid2>
                <Grid2 size={{ xl: 3, lg: 3, sm: 12, md: 6, xs: 12 }}>
                    <FormControl fullWidth>
                        <FormLabel>واحد صدور</FormLabel>
                        <Controller
                            name="insuranceCompanyAgencyId_IssueUnit"
                            control={control}
                            render={({ fieldState: { error }, field: { onChange, value } }) => (
                                <CompanyAgencyAutoComplete
                                    onChange={onChange}
                                    value={value}
                                    companyId={watch('companyId')}
                                    error={!!error}
                                    helperText={error?.message}

                                />
                            )}
                        />

                    </FormControl>
                </Grid2>
                <Grid2 size={{ xl: 3, lg: 3, sm: 12, md: 6, xs: 12 }}>
                    <FormControl fullWidth>
                        <FormLabel>واحد معرف</FormLabel>
                        <Controller
                            name="insuranceCompanyAgencyId_IntroducerUnit"
                            control={control}
                            render={({ fieldState: { error }, field: { onChange, value } }) => (
                                <CompanyAgencyAutoComplete
                                    onChange={onChange}
                                    value={value}
                                    companyId={watch('companyId')}
                                    error={!!error}
                                    helperText={error?.message}

                                />
                            )}
                        />

                    </FormControl>
                </Grid2>
                <Grid2 size={{ xl: 4, lg: 6, sm: 12, md: 6, xs: 12 }}>
                    <FormControl fullWidth>
                        <FormLabel>کد یکتا بیمه نامه</FormLabel>
                        <Controller
                            name="uniqueCode"
                            control={control}
                            render={({ fieldState: { error }, field: { onChange, value, onBlur } }) => (
                                <NumericFormat
                                    value={value || ''}
                                    onValueChange={(values) => {
                                        onChange(values.floatValue);
                                    }}
                                    onBlur={onBlur}
                                    customInput={TextField}
                                    prefix=""
                                    variant="outlined"
                                    dir='ltr'
                                    allowLeadingZeros
                                    error={!!error}
                                    helperText={error?.message}
                                    maxLength={11}
                                />
                            )}
                        />
                    </FormControl>
                </Grid2>
                <Grid2 size={{ xl: 2, lg: 3, sm: 12, md: 6, xs: 12 }}>
                    <FormControl fullWidth>
                        <FormLabel>تاریخ صدور بیمه نامه</FormLabel>
                        <Controller
                            name="issueDate"
                            control={control}
                            rules={{ required: 'فیلد اجباری' }}
                            render={({ fieldState: { error }, field: { onChange, value } }) => (
                                <MyDatePicker
                                    onChange={onChange}
                                    value={value}
                                    error={!!error}
                                    helperText={error?.message}
                                />
                            )}
                        />

                    </FormControl>
                </Grid2>
                <Grid2 size={{ xl: 2, lg: 3, sm: 12, md: 6, xs: 12 }}>
                    <FormControl fullWidth>
                        <FormLabel>تاریخ شروع بیمه نامه</FormLabel>
                        <Controller
                            name="insuranceStartDate"
                            control={control}
                            rules={{ required: 'فیلد اجباری' }}
                            render={({ fieldState: { error }, field: { onChange, value } }) => (
                                <MyDatePicker
                                    onChange={onChange}
                                    value={value}
                                    error={!!error}
                                    helperText={error?.message}
                                />
                            )}
                        />

                    </FormControl>
                </Grid2>
                <Grid2 size={{ xl: 4, lg: 5, sm: 12, md: 6, xs: 12 }}>
                    <Stack flexDirection={'row'}>
                        <FormControl fullWidth>
                            <FormLabel>نوع مدت بیمه نامه</FormLabel>
                            <Controller
                                name="insuranceTermTypeId"
                                control={control}
                                render={({ fieldState: { error }, field: { value } }) => (
                                    <RadioGroup
                                        row
                                        name="Insurance_Term_Type"
                                        defaultValue={value}
                                        value={value}
                                        onChange={(e) => handleTermType(Number(e.target.value))}
                                    >
                                        <FormControlLabel value={InsuranceTermType.Monthly} control={<Radio />} label="ماهانه" />
                                        <FormControlLabel value={InsuranceTermType.Daily} control={<Radio />} label="روزانه" />
                                    </RadioGroup>
                                )}
                            />

                        </FormControl>
                        <FormControl fullWidth>
                            <FormLabel>مقدار</FormLabel>
                            <Controller
                                name="insuranceTermValue"
                                control={control}
                                render={({ fieldState: { error }, field: { onChange, value } }) => (
                                    <NumericFormat
                                        value={value || ''}
                                        onValueChange={(values) => {
                                            onChange(values.floatValue);
                                        }}
                                        customInput={TextField}
                                        prefix=""
                                        variant="outlined"
                                        dir='ltr'
                                        allowLeadingZeros
                                        error={!!error}
                                        helperText={error?.message}
                                        maxLength={11}
                                    />
                                )}
                            />
                        </FormControl>
                    </Stack>
                </Grid2>
                <Grid2 size={{ xl: 2, lg: 3, sm: 12, md: 6, xs: 12 }}>
                    <FormControl fullWidth>
                        <FormLabel>تاریخ انقضاء</FormLabel>
                        <Tooltip title='با وارد كردن `تاريخ شروع بیمه نامه` و `مدت بيمه نامه` تاريخ انقضاء محاسبه ميگردد'>
                            <TextField
                                variant='outlined'
                                dir='ltr'
                                disabled
                                value={getExpireDate(watch('insuranceTermValue'))}
                            />
                        </Tooltip>
                    </FormControl>
                </Grid2>
                <Grid2 size={{ xl: 2, lg: 2, sm: 12, md: 6, xs: 12 }}>
                    <FormControl>
                        <FormLabel>{'-'}</FormLabel>
                        <Controller
                            control={control}
                            name='hasRenewalReminder'
                            render={({ fieldState: { error }, field: { onChange, value } }) => (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            color='error'
                                            onChange={onChange}
                                            value={value}
                                            defaultChecked={value}
                                        />
                                    }
                                    label="یاد آوری تمدید؟"
                                />
                            )}
                        />
                    </FormControl>
                </Grid2>
                <Grid2 size={{ xl: 2, lg: 2, sm: 12, md: 6, xs: 12 }}>
                    <FormControl fullWidth>
                        <FormLabel>تعداد روز قبل از انقضا</FormLabel>
                        <Controller
                            name="renewalReminderDay"
                            control={control}
                            render={({ fieldState: { error }, field: { onChange, value } }) => (
                                <NumericFormat
                                    value={value || ''}
                                    onValueChange={(values) => {
                                        onChange(values.floatValue);
                                    }}
                                    customInput={TextField}
                                    prefix=""
                                    variant="outlined"
                                    dir='ltr'
                                    allowLeadingZeros
                                    error={!!error}
                                    helperText={error?.message}
                                    maxLength={1}
                                />
                            )}
                        />
                    </FormControl>
                </Grid2>
            </Grid2>



        </>
    )
}
