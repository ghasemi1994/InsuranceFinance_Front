import React, { useEffect, useState } from 'react'
import { IInsurancePolicyResponse, InstallmentSideType, IPolicyInstallmentItemResponse, IPolicyInstallmentResponse } from '../../../../types/Insurance'
import {
    Autocomplete, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormLabel, Grid2,
    InputAdornment, TextField,
    Tooltip,
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import PeopleAutoComplete from '../../../../components/common/dropDown/PeopleAutoComplete'
import { IGroupPolicyPaymentRequest } from '../../../../types/Payment'
import { getPolicyInstallment, getPolicyListByObligorsPersonToPay, } from '../../../../server/services/insuranceService'
import { PaymentType } from '../../../../types/Enums'
import InstallmentList from '../installment/InstallmentList'
import { digitSeprator } from '../../../../utils/text'
import toast from 'react-hot-toast'
import { getBalance } from '../../../../server/services/walletService'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { groupPolicyPayment } from '../../../../server/services/paymentService'
import MyDatePicker from '../../../../components/common/datePicker/MyDatePicker'
import { toPersianDate } from '../../../../utils/convertion'


interface IProps {
    open: boolean
    onClose: (open: boolean) => void,
}

const defaultValues = {
    insurancePolicyId: null,
    payerPersonId: null,
    policyInstallmentItemId: [],
    description: null,
    paymentDate: toPersianDate(new Date())
} as IGroupPolicyPaymentRequest

export default function GroupPolicyPaymentDialog({ onClose, open }: IProps) {

    const [policySelected, setPolicySelected] = useState<IInsurancePolicyResponse | null>(null);
    const [policyList, setPolicyList] = useState<IInsurancePolicyResponse[]>([]);
    const [customerInstallmentSide, setCustomerInstallmentSide] = useState<IPolicyInstallmentResponse | null>(null);
    const [selectedItems, setSelectedItems] = useState<IPolicyInstallmentItemResponse[]>([]);
    const [loading, setLaoding] = useState<boolean>(false);
    const [submitLoading, setSubmitLaoding] = useState<boolean>(false);
    const [initialBalance, setInitialBalance] = useState<number>(0);
    const [balanceValue, setBalanceValue] = useState<number>(0);
    const [depositTotalAmount, setDepositTotalAmount] = useState<number>(0);

    const { control, setValue, handleSubmit, reset, watch } = useForm<IGroupPolicyPaymentRequest>({
        defaultValues: defaultValues
    });

    useEffect(() => {
        reset(defaultValues);
        setPolicyList([]);
        setCustomerInstallmentSide(null);
        setSelectedItems([]);
        setBalanceValue(0);
        setDepositTotalAmount(0);
    }, [open])


    const onSelectedItemsChange = (items: IPolicyInstallmentItemResponse[]) => {
        setSelectedItems(items);
        const totalSelectedAmount = items.reduce((total, item) => total + (item.dueAmount || 0), 0);
        setDepositTotalAmount(totalSelectedAmount);
        if (initialBalance !== null) {
            setBalanceValue(initialBalance - totalSelectedAmount);
        }
    };

    const handlePeopleAutoCompleteChange = (id: number | null) => {
        if (id) {
            setValue('payerPersonId', id);
            getPolicyListByObligors(id);
            getWalletBalance(id);
        } else {
            setValue('payerPersonId', null);
            setValue('insurancePolicyId', null);
            setValue('policyInstallmentItemId', null);
            setPolicyList([]);
            setSelectedItems([]);
            setBalanceValue(0);
            setInitialBalance(0);
            setCustomerInstallmentSide(null);
            setDepositTotalAmount(0);
            setPolicySelected(null);
        }
    }

    const handlePolicyAutoCompleteChange = (e: any, value: IInsurancePolicyResponse | null) => {
        setValue('insurancePolicyId', value?.id ?? null);
        setPolicySelected(value);
        setBalanceValue(initialBalance);
        if (value?.paymentTypeId === PaymentType.Installment) {
            getInstallmentDetail(value.id);
            setDepositTotalAmount(0);
        } else {
            setDepositTotalAmount(value?.totalAmount ?? 0);
            setBalanceValue((initialBalance ?? 0) - (value?.totalAmount ?? 0));
        }
    }

    const getWalletBalance = async (personId: number) => {
        try {
            await getBalance(personId).then((res) => {
                const currentBalance = res?.data;
                setInitialBalance(currentBalance); // ذخیره موجودی اولیه
                setBalanceValue(currentBalance); // مقداردهی اولیه به balance
            });
        } catch {
            setLaoding(false);
            setInitialBalance(0);
            setBalanceValue(0);
        }
    };

    const getPolicyListByObligors = async (personId: number) => {
        try {
            setLaoding(true);
            await getPolicyListByObligorsPersonToPay(personId).then((res) => {
                setPolicyList(res?.data)
                setLaoding(false);
            });
        } catch { setLaoding(false); }
    }

    const getInstallmentDetail = async (policyId: number) => {
        try {
            await getPolicyInstallment(policyId, InstallmentSideType.Customer, null).then((res) => {
                setCustomerInstallmentSide(res?.data);
            });
        } catch { }
    }

    const handleClose = () => {
        onClose(false);
    }

    const onSubmit = async (form: IGroupPolicyPaymentRequest) => {
        const balance = initialBalance - depositTotalAmount;
        if (balance < 0) {
            toast.error('موجودی کیف پول کافی نمی باشد');
            return;
        }
        if (policySelected?.paymentTypeId == PaymentType.Installment) {
            if (selectedItems.length === 0) {
                toast.error('اقساط را انتخاب کنید');
                return;
            }
        }
        try {
            form.policyInstallmentItemId = selectedItems.map((v) => v.id);
            setSubmitLaoding(true);
            await groupPolicyPayment(form).then(() => {
                toast.success('پرداخت با موفقیت انجام شد');
                setSubmitLaoding(false);
                if (form.insurancePolicyId)
                    getInstallmentDetail(form.insurancePolicyId);
                if (form.payerPersonId)
                    getWalletBalance(form.payerPersonId);
            });
        } catch {
            setSubmitLaoding(false);
        }
    }

    return (
        <>
            <Dialog
                maxWidth='md'
                fullWidth
                open={open}
                keepMounted
                onClose={handleClose}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogTitle boxShadow={1}>
                        <Grid2 container spacing={2} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
                            <Grid2 size={{ xl: 8, lg: 8, md: 8, sm: 12, xs: 12 }}>
                                {'پرداخت گروهی بیمه نامه'}
                            </Grid2>
                            <Grid2 size={{ xl: 3, lg: 3, md: 6, sm: 6, xs: 12 }}>
                                <Tooltip title='موجودی کیف پول'>
                                    <FormControl fullWidth>
                                        <TextField
                                            variant="outlined"
                                            value={digitSeprator(balanceValue)}
                                            disabled
                                            dir="ltr"
                                            sx={{
                                                '& .MuiOutlinedInput-root.Mui-disabled': {
                                                    '& fieldset': {
                                                        borderColor: balanceValue > 0 ? '#4caf50' : '#f44336', // سبز/قرمز ماتریال
                                                        borderWidth: '2px',
                                                    },
                                                },
                                                '& .MuiInputBase-input.Mui-disabled': {
                                                    WebkitTextFillColor: balanceValue > 0 ? '#4caf50' : '#f44336',
                                                    fontWeight: 'bold',
                                                },
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <AccountBalanceWalletIcon
                                                            sx={{
                                                                color: balanceValue > 0 ? '#4caf50' : '#f44336',
                                                                ml: 1,
                                                            }}
                                                        />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: <InputAdornment position="end">ریال</InputAdornment>,
                                            }}
                                        />
                                    </FormControl>
                                </Tooltip>
                            </Grid2>
                        </Grid2>
                    </DialogTitle>

                    <Divider />
                    <DialogContent>
                        <Grid2 container spacing={2} width={'100%'}>

                            <Grid2 size={{ xl: 6, lg: 6, md: 6, sm: 6, xs: 12 }}>
                                <FormControl fullWidth>
                                    <FormLabel>متعهد پرداخت</FormLabel>
                                    <Controller
                                        control={control}
                                        name='payerPersonId'
                                        rules={{ required: "فیلد اجباری است" }}
                                        render={({ field: { value }, fieldState: { error } }) =>
                                            <PeopleAutoComplete
                                                onChange={(id) => handlePeopleAutoCompleteChange(id)}
                                                value={value}
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        }
                                    />
                                </FormControl>
                            </Grid2>

                            <Grid2 size={{ xl: 6, lg: 6, md: 6, sm: 6, xs: 12 }}>
                                <FormControl fullWidth>
                                    <FormLabel>بیمه نامه ها</FormLabel>
                                    <Controller
                                        control={control}
                                        name='insurancePolicyId'
                                        rules={{ required: "فیلد اجباری است" }}
                                        render={({ field: { value }, fieldState: { error } }) =>
                                            <Autocomplete
                                                options={policyList}
                                                onChange={handlePolicyAutoCompleteChange}
                                                value={policyList.find(c => c.id === value) || null}
                                                getOptionKey={c => c.id}
                                                loading={loading}
                                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                                getOptionLabel={c => `${c.customerName} / ${c.categoryTitle} / ${c.paymentTypeTitle}`}
                                                renderInput={(params) => (
                                                    <TextField {...params}
                                                        variant='outlined'
                                                        label=""
                                                        error={!!error}
                                                        helperText={error?.message}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            endAdornment: (
                                                                <>
                                                                    {loading ? <CircularProgress color="inherit" size={15} /> : null}
                                                                    {params.InputProps.endAdornment}
                                                                </>
                                                            ),
                                                        }}
                                                    />
                                                )}

                                            />
                                        }
                                    />
                                </FormControl>
                            </Grid2>

                            <Grid2 size={{ xl: 3, lg: 3, md: 6, sm: 6, xs: 12 }}>
                                <FormControl fullWidth>
                                    <FormLabel>مبلغ تسویه</FormLabel>
                                    <TextField
                                        variant='outlined'
                                        value={digitSeprator(depositTotalAmount)}
                                        disabled
                                        dir='ltr'
                                        slotProps={{
                                            input: {
                                                startAdornment: <InputAdornment position="end">ریال</InputAdornment>,
                                            },
                                        }}
                                    />
                                </FormControl>
                            </Grid2>

                            <Grid2 size={{ xl: 3, lg: 3, md: 6, sm: 6, xs: 12 }}>
                                <FormControl fullWidth>
                                    <FormLabel>تاریخ پرداخت</FormLabel>
                                    <Controller
                                        control={control}
                                        name='paymentDate'
                                        render={({ field: { value, onChange }, fieldState: { error } }) =>
                                            <MyDatePicker
                                                onChange={onChange}
                                                value={value}
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        }
                                    />
                                </FormControl>
                            </Grid2>

                            <Grid2 size={12}>
                                <FormControl fullWidth>
                                    <FormLabel>توضیحات</FormLabel>
                                    <Controller
                                        control={control}
                                        name='description'
                                        render={({ field: { value, onChange }, fieldState: { error } }) =>
                                            <TextField
                                                onChange={onChange}
                                                value={value || ''}
                                            />
                                        }
                                    />
                                </FormControl>
                            </Grid2>

                            {(policySelected?.paymentTypeId === PaymentType.Installment && watch('payerPersonId') && customerInstallmentSide?.items) &&
                                <Grid2 size={12}>
                                    {loading ?
                                        <>
                                            loading ...
                                        </>
                                        :
                                        <InstallmentList
                                            items={customerInstallmentSide?.items ?? []}
                                            selectable={true}
                                            onSelectedItemsChange={onSelectedItemsChange}
                                            resetSelection={submitLoading}
                                        />
                                    }
                                </Grid2>
                            }

                        </Grid2>
                    </DialogContent>
                    <DialogActions>
                        <Button size='small' onClick={handleClose} >بستن</Button>
                        <Button
                            size='small'
                            color='success'
                            variant='contained'
                            type='submit'
                            loading={submitLoading}
                        >ثبت</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    )
}
