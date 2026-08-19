import React, { useEffect, useState } from 'react';
import {
    Box,
    Paper,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    TextField,
    Typography,
    Divider,
    Stack,
    Grid2,
    Tooltip,
    InputAdornment
} from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { FeeCalculationType, FeeReceiverType } from '../../../types/Enums';
import { getBalance } from '../../../server/services/walletService';
import { digitSeprator, numberToPersianWords } from '../../../utils/text';
import { useMarketerStore } from '../../../stores/marketerStore';
import { useCategoryStore } from '../../../stores/categoryStore';
import { useInsurancePolicyStore } from '@/stores/insurancePolicyStore';
import { DepositStatus } from '@/types/Insurance';

export default function FeeForm() {

    const { watch, control, setValue } = useFormContext();

    const { dataForEdit } = useInsurancePolicyStore();
    const canEdit = (watch("id") && !(dataForEdit?.customerDepositStatus === DepositStatus.Pending))

    const { dataList } = useMarketerStore();
    const [balance, setBalance] = useState(0);

    const categoryStore = useCategoryStore();

    const feeCalculationType = watch('feeCalculationType');
    const feeReceiverType = watch('feeReceiverType');

    useEffect(() => {
        setDefaultFeeValue();
    }, [])

    const handleFeeCalculationTypeChange = (fee: FeeCalculationType) => {
        setValue('feeCalculationType', fee);
        setDefaultFeeValue();
    }

    const handleFeeReceiverChange = async (receiver: FeeReceiverType) => {
        setValue('feeReceiverType', receiver);
    }


    useEffect(() => {
        const receiverId = getFeeReceiverId();
        if (receiverId)
            getWalletBalance(receiverId);
    }, [feeReceiverType])

    const getFeeReceiverId = () => {
        if (feeReceiverType === FeeReceiverType.Customer)
            return watch('personId');

        else if (feeReceiverType === FeeReceiverType.IntroducerOrGarantor)
            return watch('introducerPersonId')

        else if (feeReceiverType === FeeReceiverType.Marketer) {
            const fund = dataList?.find(c => c.id === watch('personMarketerId'))
            return fund?.personId;
        }
        return 0;
    }


    const getWalletBalance = async (receiverId: number) => {
        try {
            await getBalance(receiverId).then((res) => {
                setBalance(res?.data);
            });
        } catch { }
    }

    const setDefaultFeeValue = () => {
        if (watch('feeCalculationType') === FeeCalculationType.Default) {
            const defaultFee = categoryStore.dataList?.find(c => c.id === watch('categoryId'));
            setValue('feePercentage', defaultFee?.feePercentage);
        }
    }



    return (
        <Box sx={{
            margin: '0 auto',
            width: '100%',
            opacity: canEdit ? 0.5 : 1,
            pointerEvents: canEdit ? 'none' : 'auto'
        }}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#DDF4E7' }}>
                <Stack spacing={2}>
                    <Typography variant="h6">تنظیمات کارمزد</Typography>
                    {canEdit &&
                        <Typography variant='caption'> بدلیل داشتن وصولی برای بیمه نامه امکان تغییر وجو ندارد</Typography>
                    }
                    <Divider />

                    <Grid2 container spacing={2} alignItems="flex-start">

                        <Grid2 size={{ xl: 4, lg: 4, md: 6, sm: 6, xs: 12 }}>
                            <FormControl fullWidth>
                                <FormLabel>
                                    نوع محاسبه کارمزد
                                </FormLabel>
                                <Controller
                                    name="feeCalculationType"
                                    control={control}
                                    render={({ field: { value }, fieldState: { error } }) => (
                                        <>
                                            <RadioGroup
                                                row
                                                name="fee_Calculation_Type"
                                                value={value}
                                                onChange={(e) => handleFeeCalculationTypeChange(Number(e.target.value))}
                                            >
                                                <FormControlLabel
                                                    value={FeeCalculationType.Default}
                                                    control={<Radio size="small" />}
                                                    label="پیش فرض"
                                                />
                                                <FormControlLabel
                                                    value={FeeCalculationType.Customized}
                                                    control={<Radio size="small" />}
                                                    label="دلخواه"
                                                />
                                            </RadioGroup>
                                            {error && <Typography color="error">{error.message}</Typography>}
                                        </>
                                    )}
                                />
                            </FormControl>
                        </Grid2>


                        <Grid2 size={{ xl: 5, lg: 5, md: 6, sm: 6, xs: 12 }}>
                            <FormControl fullWidth>
                                <FormLabel>دریافت کننده کارمزد؟</FormLabel>
                                <Controller
                                    name="feeReceiverType"
                                    control={control}
                                    render={({ field: { value }, fieldState: { error } }) => (
                                        <>
                                            <RadioGroup
                                                row
                                                name="feeReceiverType"
                                                value={value}
                                                onChange={(e) => handleFeeReceiverChange(Number(e.target.value))}
                                            >
                                                <FormControlLabel
                                                    value={FeeReceiverType.Marketer}
                                                    control={<Radio size="small" />}
                                                    label="بازاریاب"
                                                />
                                                <FormControlLabel
                                                    value={FeeReceiverType.IntroducerOrGarantor}
                                                    control={<Radio size="small" />}
                                                    label="معرف / ضامن"
                                                />
                                                <FormControlLabel
                                                    value={FeeReceiverType.Customer}
                                                    control={<Radio size="small" />}
                                                    label="بیمه گذار"
                                                />
                                            </RadioGroup>
                                            {error && <Typography color="error">{error.message}</Typography>}
                                        </>
                                    )}
                                />
                            </FormControl>
                        </Grid2>


                        <Grid2 size={{ xl: 3, lg: 3, md: 12, sm: 12, xs: 12 }}>
                            <Box sx={{ p: 1 }}>
                                <Tooltip title={numberToPersianWords(balance, 'Toman')}>
                                    <Paper sx={{ p: 1, textAlign: 'center' }}>
                                        <Typography variant="subtitle2">موجودی کیف پول</Typography>
                                        <Typography variant="h6">{digitSeprator(balance)}</Typography>
                                    </Paper>
                                </Tooltip>
                            </Box>
                        </Grid2>
                    </Grid2>

                    <Grid2 container spacing={2}>
                        <Grid2 size={{ xl: 3, lg: 3, md: 6, sm: 6, xs: 12 }}>
                            <FormControl fullWidth>
                                <FormLabel>درصد کارمزد دلخواه</FormLabel>
                                <Controller
                                    control={control}
                                    name="feePercentage"
                                    rules={{
                                        validate: (v) => {
                                            if (feeCalculationType === FeeCalculationType.Customized && (v === null || v === undefined || v === ''))
                                                return 'درصد را وارد کنید';
                                            return true;
                                        },
                                    }}
                                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                                        <NumericFormat
                                            customInput={TextField}
                                            onValueChange={(values) => onChange(values.floatValue)}
                                            value={value ?? ''}
                                            thousandSeparator
                                            valueIsNumericString
                                            variant="outlined"
                                            dir="ltr"
                                            error={!!error}
                                            helperText={error?.message}
                                            disabled={feeCalculationType === FeeCalculationType.Default}
                                            slotProps={{
                                                input: {
                                                    endAdornment: <InputAdornment position="start">%</InputAdornment>,
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid2>

                        <Grid2 size={{ xl: 3, lg: 3, md: 6, sm: 6, xs: 12 }}>
                            <FormControl fullWidth>
                                <FormLabel>ارزش افزوده</FormLabel>
                                <Controller
                                    control={control}
                                    name="vatPercentage"
                                    rules={{ required: 'فیلد اجباری است' }}
                                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                                        <NumericFormat
                                            customInput={TextField}
                                            onValueChange={(values) => onChange(values.floatValue)}
                                            value={value ?? ''}
                                            thousandSeparator
                                            valueIsNumericString
                                            variant="outlined"
                                            dir="ltr"
                                            error={!!error}
                                            helperText={error?.message}
                                            slotProps={{
                                                input: {
                                                    endAdornment: <InputAdornment position="start">%</InputAdornment>,
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid2>
                        <Grid2 size={{ xl: 3, lg: 3, md: 6, sm: 6, xs: 12 }}>
                            <FormControl fullWidth>
                                <FormLabel>هزینه (ریال)</FormLabel>
                                <Controller
                                    name='cost'
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
                                            error={!!error}
                                            helperText={error?.message}
                                        />
                                    )}
                                />

                            </FormControl>
                        </Grid2>
                        <Grid2 size={{ xl: 3, lg: 3, md: 6, sm: 6, xs: 12 }}>
                            <FormControl fullWidth>
                                <FormLabel>درصد کارمزد تشویقی</FormLabel>
                                <Controller
                                    control={control}
                                    name="incentiveFeePercentage"
                                    rules={{ required: 'فیلد اجباری است' }}
                                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                                        <NumericFormat
                                            customInput={TextField}
                                            onValueChange={(values) => onChange(values.floatValue)}
                                            value={value ?? ''}
                                            thousandSeparator
                                            valueIsNumericString
                                            variant="outlined"
                                            dir="ltr"
                                            error={!!error}
                                            helperText={error?.message}
                                            slotProps={{
                                                input: {
                                                    endAdornment: <InputAdornment position="start">%</InputAdornment>,
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid2>
                    </Grid2>

                </Stack>
            </Paper>
        </Box>
    );
}
