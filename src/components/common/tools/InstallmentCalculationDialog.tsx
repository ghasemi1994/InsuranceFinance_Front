import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { Box, Button, Card, Dialog, DialogTitle, Divider, FormControl, FormControlLabel, FormLabel, Grid2, Paper, Radio, RadioGroup, Stack, TextField, Tooltip } from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { IInstallmentCalculationRequest, PrePaymentType } from '../../../types/Insurance';
import { toPersianDate } from '../../../utils/convertion';
import MyDatePicker from '../datePicker/MyDatePicker';
import DisplayInstalmentTableDialog from '../../../pages/insruancePolicy/components/DisplayInstalmentTableDialog';

interface IProps {
    openDialog: boolean
    onCloseDialog: (open: boolean) => void,
}

export default function InstallmentCalculationDialog({ openDialog, onCloseDialog }: IProps) {

    const [open, setOpen] = useState(false);

    const date = new Date();
    date.setMonth(date.getMonth() + 1);

    const defaultValues: IInstallmentCalculationRequest = {
        installmentCount: 5,
        installmentStartDate: toPersianDate(date),
        prePaymentStartDate: toPersianDate(new Date()),
        intervalBetweenInstalment: 1,
        totalAmount: null,
        prePaymentType: PrePaymentType.Percentage,
        prePaymentValue: 30
    }

    const { control, handleSubmit, watch } = useForm<IInstallmentCalculationRequest>({
        defaultValues: defaultValues
    });

    const onSubmit = (req: IInstallmentCalculationRequest) => {

    }

    const handleClose = () => {
        onCloseDialog(false);
    };

    return (
        <>
            <Dialog
                maxWidth='md'
                open={openDialog}
                keepMounted
                onClose={handleClose}
                aria-describedby="dialog-person"
                fullWidth
            >
                <DialogTitle>{"محاسبه اقساط"}</DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Divider />
                    <Box p={3}>
                        <Grid2 container spacing={2}>
                            <Grid2 size={{ xl: 3, lg: 3, md: 6, sm: 6, xs: 12 }}>
                                <FormControl fullWidth>
                                    <FormLabel>مبلغ</FormLabel>
                                    <Controller
                                        name={`totalAmount`}
                                        control={control}
                                        rules={{ required: 'فیلد اجباری' }}
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
                            {/* پیش پرداخت */}
                            <Grid2 size={{ xl: 3, lg: 3, md: 6, sm: 6, xs: 12 }}>
                                <FormControl fullWidth>
                                    <FormLabel>پیش پرداخت</FormLabel>
                                    <Controller
                                        name={`prePaymentType`}
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
                            <Grid2 size={{ xl: 3, lg: 3, md: 6, sm: 6, xs: 12 }}>
                                <FormControl fullWidth>
                                    <FormLabel>مقدار</FormLabel>
                                    <Controller
                                        name={`prePaymentValue`}
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
                            <Grid2 size={{ xl: 3, lg: 3, md: 6, sm: 6, xs: 12 }}>
                                <FormControl fullWidth>
                                    <FormLabel>شروع (پیش پرداخت)</FormLabel>
                                    <Controller
                                        name={`prePaymentStartDate`}
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
                            <Grid2 size={{ xl: 3, lg: 3, md: 6, sm: 6, xs: 12 }}>
                                <FormControl fullWidth>
                                    <FormLabel>تعداد قسط</FormLabel>
                                    <Controller
                                        name={`installmentCount`}
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
                            <Grid2 size={{ xl: 3, lg: 3, md: 6, sm: 6, xs: 12 }}>
                                <FormControl fullWidth>
                                    <FormLabel>فاصله بین اقساط (ماه)</FormLabel>
                                    <Controller
                                        name={`intervalBetweenInstalment`}
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
                            <Grid2 size={{ xl: 3, lg: 3, md: 6, sm: 6, xs: 12 }}>
                                <FormControl fullWidth>
                                    <FormLabel>تاریخ شروع (قسط)</FormLabel>
                                    <Controller
                                        name={`installmentStartDate`}
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
                            <Grid2 size={{ xl: 3, lg: 3, md: 6, sm: 6, xs: 12 }}>
                                <Tooltip title='در صورت وارد کردن این مقدار، پیش‌پرداخت اقساط به‌طور خودکار توسط سیستم محاسبه می‌شود.'>
                                    <FormControl fullWidth>
                                        <FormLabel>مبلغ هر قسط</FormLabel>
                                        <Controller
                                            name={'installmentAmount'}
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
                        <Stack direction="row" justifyContent="flex-end" mt={2} spacing={1}>
                            <FormControl>
                                <Button
                                    onClick={() => setOpen(true)}
                                    size="small"
                                    color="primary"
                                    variant="contained"
                                    type='submit'
                                >
                                    نمایش جدول اقساط
                                </Button>
                            </FormControl>
                            <FormControl>
                                <Button
                                    onClick={handleClose}
                                    size="small"
                                    color="warning"
                                    variant="contained"
                                    type='button'
                                >
                                    بستن
                                </Button>
                            </FormControl>
                        </Stack>
                        <DisplayInstalmentTableDialog
                            title={'لیست اقساط'}
                            open={open}
                            onClose={() => setOpen(false)}
                            calculationData={watch()}
                        />
                    </Box>
                </form>
            </Dialog>
        </>
    )
}
