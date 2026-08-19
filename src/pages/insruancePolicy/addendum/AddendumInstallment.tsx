import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    Button,
    Card,
    Divider,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid2,
    Radio,
    RadioGroup,
    Stack,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Controller, useFormContext } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import MyDatePicker from '../../../components/common/datePicker/MyDatePicker';
import { InstallmentSideType, PrePaymentType } from '../../../types/Insurance';
import { useEffect, useState } from 'react';
import React from 'react';
import { PaymentType } from '../../../types/Enums';
import { toMiladiDate, toPersianDate } from '../../../utils/convertion';
import { Visibility } from '@mui/icons-material';
import { useInsurancePolicyStore } from '../../../stores/insurancePolicyStore';
import DisplayInstalmentTableDialog from '../components/DisplayInstalmentTableDialog';

interface AddendumInstallmentProps {
    title: string;
    installmentSideType: InstallmentSideType;
    control: any,
    watch: any,
    setValue: any
}

export default function AddendumInstallment({ title, installmentSideType, control, setValue, watch }: AddendumInstallmentProps) {

    const [open, setOpen] = useState(false);

    // تعیین پیشوند بر اساس نوع (مشتری یا بیمه)
    const prefix = installmentSideType === InstallmentSideType.Customer
        ? 'customerSideInstallment'
        : 'insuranceSideInstallment';

    // تعیین نوع پرداخت بر اساس نوع (مشتری یا بیمه)
    const paymentTypeField = installmentSideType === InstallmentSideType.Customer
        ? 'customerPaymentType'
        : 'insurancePaymentType';

    // محاسبه تاریخ پیش‌فرض برای شروع اقساط
    /*const getDefaultInstallmentStartDate = () => {
        const issueDate = watch('issueDate');
        if (issueDate) {
            const gregorianDate = toMiladiDate(issueDate);
            const nextMonth = gregorianDate;
            nextMonth?.setMonth(nextMonth.getMonth() + 1);
            return toPersianDate(nextMonth);
        }
        return toPersianDate(new Date());
    };*/

    // تنظیم مقادیر پیش‌فرض هنگام تغییر تاریخ صدور
    /*useEffect(() => {
        if (watch('issueDate') && !watch('id')) { //در حالت ویرایش نباشیم
            setValue(`${prefix}.prePaymentStartDate`, watch('issueDate'));
            setValue(`${prefix}.installmentStartDate`, getDefaultInstallmentStartDate());
        }
    }, [watch('issueDate')]);*/


    // دریافت داده‌های فعلی برای نمایش در دیالوگ
    const getCurrentInstallmentData = () => ({
        ...watch(prefix),
        totalAmount: (watch('premiumChangeAmount') ?? 0) - (watch('discountAmount') ?? 0)
    });


    return (
        <div>
            <DisplayInstalmentTableDialog
                title={installmentSideType === InstallmentSideType.Customer
                    ? 'لیست اقساط مشتری'
                    : 'لیست اقساط بیمه'}
                open={open}
                onClose={() => setOpen(false)}
                calculationData={getCurrentInstallmentData()}
            />

            <Accordion
                defaultExpanded={true}
                sx={installmentSideType === InstallmentSideType.Customer ? { bgcolor: '#f0f8fe' } : { bgcolor: '#fff9eb' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{title}</Typography>
                </AccordionSummary>
                <AccordionDetails>

                    <Stack spacing={2}>
                        {/* بخش انتخاب نوع پرداخت (نقدی/اقساطی) */}
                        <>
                            <FormControl fullWidth>
                                <FormLabel>نوع پرداخت</FormLabel>
                                <Controller
                                    name={paymentTypeField}
                                    control={control}
                                    render={({ field }) => (
                                        <RadioGroup
                                            row
                                            value={field.value ?? PaymentType.Cash} // مقدار پیش‌فرض اگر undefined بود
                                            onChange={(e) => {
                                                field.onChange(Number(e.target.value)); // تبدیل مقدار به عدد
                                            }}
                                        >
                                            <FormControlLabel
                                                value={PaymentType.Cash}
                                                control={<Radio size="small" />}
                                                label="نقد"
                                            />
                                            <FormControlLabel
                                                value={PaymentType.Installment}
                                                control={<Radio size="small" />}
                                                label="اقساط"
                                            />
                                        </RadioGroup>
                                    )}
                                />
                            </FormControl>
                        </>

                        {/* بخش تنظیمات اقساط */}
                        {watch(paymentTypeField) === PaymentType.Installment && (
                            <>
                                <Divider variant='fullWidth' />

                                <Grid2 container spacing={2}>
                                    {/* پیش پرداخت */}
                                    <Grid2 size={{ xl: 6, lg: 6, md: 6, sm: 12, xs: 12 }}>
                                        <FormControl fullWidth>
                                            <FormLabel>نوع پیش پرداخت</FormLabel>
                                            <Controller
                                                name={`${prefix}.prePaymentType`}
                                                control={control}
                                                render={({ field }) => (
                                                    <RadioGroup row
                                                        value={field.value}
                                                        onChange={(e) => {
                                                            field.onChange(Number(e.target.value));
                                                        }}
                                                    >
                                                        <FormControlLabel
                                                            value={PrePaymentType.Amount}
                                                            control={<Radio size="small" />}
                                                            label="مبلغ"
                                                        />
                                                        <FormControlLabel
                                                            value={PrePaymentType.Percentage}
                                                            control={<Radio size="small" />}
                                                            label="درصد"
                                                        />
                                                    </RadioGroup>
                                                )}
                                            />
                                        </FormControl>
                                    </Grid2>

                                    <Grid2 size={{ xl: 6, lg: 6, md: 6, sm: 12, xs: 12 }}>
                                        <FormControl fullWidth>
                                            <FormLabel>مقدار پیش پرداخت</FormLabel>
                                            <Controller
                                                name={`${prefix}.prePaymentValue`}
                                                control={control}
                                                render={({ field, fieldState: { error } }) => (
                                                    <NumericFormat
                                                        onValueChange={(values) => {
                                                            field.onChange(values.floatValue);
                                                        }}
                                                        value={field.value}
                                                        customInput={TextField}
                                                        thousandSeparator
                                                        size="small"
                                                        dir='ltr'
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                )}
                                            />
                                        </FormControl>
                                    </Grid2>

                                    {/* تاریخ شروع پیش پرداخت */}
                                    <Grid2 size={{ xl: 6, lg: 6, md: 6, sm: 12, xs: 12 }}>
                                        <FormControl fullWidth>
                                            <FormLabel>شروع (پیش پرداخت)</FormLabel>
                                            <Controller
                                                name={`${prefix}.prePaymentStartDate`}
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

                                    {/* تعداد اقساط */}
                                    <Grid2 size={{ xl: 6, lg: 6, md: 6, sm: 12, xs: 12 }}>

                                        <FormControl fullWidth>
                                            <FormLabel>تعداد قسط</FormLabel>
                                            <Controller
                                                name={`${prefix}.installmentCount`}
                                                control={control}
                                                render={({ field, fieldState: { error } }) => (
                                                    <NumericFormat
                                                        onValueChange={(values) => {
                                                            field.onChange(values.floatValue);
                                                        }}
                                                        value={field.value}
                                                        customInput={TextField}
                                                        thousandSeparator
                                                        size="small"
                                                        dir='ltr'
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                )}
                                            />
                                        </FormControl>

                                    </Grid2>

                                    {/* فاصله بین اقساط */}
                                    <Grid2 size={{ xl: 6, lg: 6, md: 6, sm: 12, xs: 12 }}>
                                        <FormControl fullWidth>
                                            <FormLabel>فاصله بین اقساط (ماه)</FormLabel>
                                            <Controller
                                                name={`${prefix}.intervalBetweenInstalment`}
                                                control={control}
                                                render={({ field, fieldState: { error } }) => (
                                                    <NumericFormat
                                                        onValueChange={(values) => {
                                                            field.onChange(values.floatValue);
                                                        }}
                                                        value={field.value}
                                                        customInput={TextField}
                                                        thousandSeparator
                                                        size="small"
                                                        dir='ltr'
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                )}
                                            />
                                        </FormControl>
                                    </Grid2>

                                    {/* تاریخ شروع اقساط */}
                                    <Grid2 size={{ xl: 6, lg: 6, md: 6, sm: 12, xs: 12 }}>
                                        <FormControl fullWidth>
                                            <FormLabel>تاریخ شروع (قسط)</FormLabel>
                                            <Controller
                                                name={`${prefix}.installmentStartDate`}
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
                                    <Grid2 size={12}>
                                        <Tooltip title='در صورت وارد کردن این مقدار، پیش‌پرداخت اقساط به‌طور خودکار توسط سیستم محاسبه می‌شود.'>
                                            <FormControl fullWidth>
                                                <FormLabel>مبلغ هر قسط</FormLabel>
                                                <Controller
                                                    name={`${prefix}.installmentAmount`}
                                                    control={control}
                                                    render={({ fieldState: { error }, field: { onChange, value } }) => (
                                                        <NumericFormat
                                                            value={value}
                                                            onValueChange={(values) => {
                                                                onChange(values.floatValue);
                                                            }}
                                                            customInput={TextField}
                                                            thousandSeparator
                                                            valueIsNumericString
                                                            prefix=""
                                                            variant="outlined"
                                                            dir='ltr'
                                                            helperText={error?.message}
                                                            error={!!error}
                                                        />
                                                    )}
                                                />
                                            </FormControl>
                                        </Tooltip>
                                    </Grid2>

                                </Grid2>

                                {/* دکمه نمایش جدول اقساط */}
                                <Stack direction="row" justifyContent="flex-end" mt={2}>
                                    <Button
                                        onClick={() => setOpen(true)}
                                        size="small"
                                        variant="contained"
                                        endIcon={<Visibility />}
                                    >
                                        نمایش اقساط
                                    </Button>
                                </Stack>

                            </>
                        )}
                    </Stack>

                </AccordionDetails>
            </Accordion>

        </div >
    );
}