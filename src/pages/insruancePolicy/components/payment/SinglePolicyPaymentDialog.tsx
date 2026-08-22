import React, { useEffect, useState } from 'react'
import {
    AddendumResponse,
    IInsurancePolicyResponse,
    InstallmentSideType,
    IPolicyInstallmentItemResponse,
    IPolicyInstallmentResponse,
    PolicyPaymentGroupType
} from '../../../../types/Insurance'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    FormLabel,
    Grid2,
    InputAdornment,
    Stack,
    TextField,
    Tooltip,
    Typography
} from '@mui/material'
import { getPolicyInstallment, getPolicyInstallmentByItemId } from '../../../../server/services/insuranceService'
import { PaymentType } from '../../../../types/Enums'
import PaymentMethodAutoComplete from '../../../../components/common/dropDown/PaymentMethodAutoComplete'
import { IPolicyPaymentRequest, PolicyPaymentOption, PolicyPaymentPendingDebtResponse } from '../../../../types/Payment'
import { NumericFormat } from 'react-number-format'
import MyDatePicker from '../../../../components/common/datePicker/MyDatePicker'
import BankAccountAutoComplete from '../../../../components/common/dropDown/BankAccountAutoComplete'
import { Controller, useForm } from 'react-hook-form'
import { singlePolicyPayment } from '../../../../server/services/paymentService'
import toast from 'react-hot-toast'
import InstallmentList from '../installment/InstallmentList'
import InstallmentAutoComplete from '../installment/InstallmentAutoComplete'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PaymentOptionConfirmDialog from './PaymentOptionConfirmDialog'
import PeopleAutoComplete from '../../../../components/common/dropDown/PeopleAutoComplete'
import { DepositMethodType, DepositRequest } from '../../../../types/Wallet'
import { getBalance } from '../../../../server/services/walletService'
import { digitSeprator } from '../../../../utils/text'
import useConfirm from '../../../../hooks/useConfirm'
import { useAuthStore } from '../../../../stores/authStore'
import AttachmentFileList from '../../../attachment/AttachmentFileList'
import { WalletOutlined } from '@mui/icons-material'
import { toPersianDate } from '../../../../utils/convertion'
import AgencyBankAccountAutoComplete from '../../../../components/common/dropDown/AgencyBankAccountAutoComplete'
import LifeInsuranceYearAutoComplete from './LifeInsuranceYearAutoComplete'


interface IProps {
    open: boolean
    onClose: (open: boolean) => void,
    row: IInsurancePolicyResponse | null
    defaultInstallmentItemId?: number | null,
    showInstallmentList?: boolean,
    sideType: InstallmentSideType,
    addendum?: AddendumResponse | null,
    debt?: PolicyPaymentPendingDebtResponse | null,
    paymentGroupType?: PolicyPaymentGroupType
}

const defaultValues = {
    payerPersonId: null,
    policyInstallmentItemId: null,
    insurancePolicyId: null,
    newInstallmentStartDate: null,
    description: null,
    addendumId: null,
    lifeInsuranceYear: Number(toPersianDate(new Date())?.toString().split("/")[0]),
    depositRequest: {
        chequeAccountNumber: null,
        chequeAccountOwner: null,
        chequeDueDate: null,
        chequeNumber: null,
        chequeBankName: null,
        targetBankAccountId: null,
        companyAgencyBankAccountId: null,
        paymentDate: toPersianDate(new Date()),
        depositMethodType: null,
        receivedBy: null,
        amount: null,
        transactionId: null
    }

} as IPolicyPaymentRequest

export default function SinglePolicyPaymentDialog(props: IProps) {

    const {
        row,
        onClose,
        open,
        defaultInstallmentItemId,
        showInstallmentList = true,
        sideType,
        addendum,
        debt,
        paymentGroupType
    } = props;

    type ValidatePaymentAmountType = "invalidAmount" | "depositAmount" | "equals" | "unknown";

    const [files, setFiles] = useState<File[]>([]);
    const [customerInstallmentSide, setCustomerInstallmentSide] = useState<IPolicyInstallmentResponse | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<DepositMethodType | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [submissionRequest, setSubmissionRequest] = useState<IPolicyPaymentRequest | null>(null);
    const [initialBalance, setInitialBalance] = useState<number>(0);
    const [balanceValue, setBalanceValue] = useState<number>(0);
    const { control, setValue, reset, handleSubmit, watch } = useForm<IPolicyPaymentRequest>({
        defaultValues: defaultValues
    });
    const { confirm, ConfirmDialog } = useConfirm();
    const { userInfo } = useAuthStore();
    const isLifeInsurance = row?.categoryCode === "210";
    let _paymentType: PaymentType | null = null;

    if (addendum) {
        if (sideType == InstallmentSideType.Customer)
            _paymentType = addendum.customerPaymentType;
        else _paymentType = addendum.insurancePaymentType
    } else {
        if (sideType == InstallmentSideType.Customer)
            _paymentType = row?.paymentTypeId ?? null;
        else _paymentType = row?.insurancePaymentTypeId ?? null
    }

    useEffect(() => {
        if (row && open) {
            console.log(row.addendums)
            getInstallment(sideType, _paymentType ?? PaymentType.Cash, addendum?.id ?? null);

            setValue('payerPersonId', row.customerId);
            setValue('policyInstallmentItemId', defaultInstallmentItemId ?? null);
            if (sideType === InstallmentSideType.Insurance) {
                setValue('payerPersonId', userInfo?.organizationPersonId ?? null);
                if (userInfo?.organizationPersonId)
                    getWalletBalance(userInfo?.organizationPersonId);
                else
                    toast.error('موجودی کیف پول یافت نشد');
            } else {
                getWalletBalance(row.customerId);
            }
            if (addendum && _paymentType === PaymentType.Cash) {
                setValue('depositRequest.amount', addendum.premiumChangeAmount);
            }
            if (debt) {
                setValue('depositRequest.amount', debt.amount);
            }

            setFiles([]);
        }
        else {
            reset(defaultValues);
            setPaymentMethod(null);
            setCustomerInstallmentSide(null);
            setValue('payerPersonId', null);
        }
    }, [row, open])


    const hasDefaultInstalmmentItemId = defaultInstallmentItemId != null && defaultInstallmentItemId != undefined;

    const handleInstallmentItemChange = (value: number | null) => {

        const item = customerInstallmentSide?.items.find(c => c.id === value);
        if (item) {
            setValue('policyInstallmentItemId', value ?? null);
            setValue('depositRequest.amount', item?.dueAmount ?? 0);
            calculateWalletBalance();
        }
        else {
            setValue('policyInstallmentItemId', null);
            setValue('depositRequest.amount', null);
            setBalanceValue(initialBalance);
        }
    }

    const handlePaymentMethodChange = (method: DepositMethodType | null) => {
        setPaymentMethod(method);
        setValue('depositRequest.depositMethodType', method ?? null);
        if (method === DepositMethodType.Wallet) {
            calculateWalletBalance();
        } else {
            setBalanceValue(initialBalance);
        }
    }

    const calculateWalletBalance = () => {
        let amount: number = 0;
        if (_paymentType === PaymentType.Installment) {
            if (paymentGroupType === PolicyPaymentGroupType.DebtGroup) {
                amount = debt?.amount ?? 0;
            }
            else {
                const item = customerInstallmentSide?.items.find(c => c.id === watch('policyInstallmentItemId'));
                amount = item?.dueAmount ?? 0;
            }
        } else {
            if (paymentGroupType === PolicyPaymentGroupType.DebtGroup) {
                amount = debt?.amount ?? 0;
            }
            else if (paymentGroupType === PolicyPaymentGroupType.AddendumGroup) {
                amount = addendum?.premiumChangeAmount ?? 0;
            }
            else
                amount = row?.totalAmount ?? 0;
        }
        setValue('depositRequest.amount', amount);
        setBalanceValue(initialBalance - amount);
    }

    const handlePeopleAutoChange = (personId: number | null) => {
        setValue('payerPersonId', personId);
        if (personId)
            getWalletBalance(personId);
        else {
            setBalanceValue(0);
            setInitialBalance(0);
        }
    }

    const getWalletBalance = async (personId: number) => {
        try {
            await getBalance(personId).then((res) => {
                const currentBalance = res?.data;
                setBalanceValue(currentBalance);
                setInitialBalance(currentBalance);
            });
        } catch {

        }
    };

    const getInstallment = async (sideType: InstallmentSideType, paymentTypeId: PaymentType, addendumId: number | null) => {
        try {
            if (row && paymentTypeId === PaymentType.Installment) {
                setLoading(true);

                if (defaultInstallmentItemId) {
                    await getPolicyInstallmentByItemId(defaultInstallmentItemId)
                        .then((response) => {
                            setCustomerInstallmentSide(response?.data);
                            const item: IPolicyInstallmentItemResponse = response?.data?.items.find((c: IPolicyInstallmentItemResponse) => c.id === defaultInstallmentItemId);
                            setValue('depositRequest.amount', item.dueAmount)
                            setLoading(false);
                        });
                } else {
                    await getPolicyInstallment(row.id, sideType, isLifeInsurance ? watch('lifeInsuranceYear') : null, addendumId).then((res) => {
                        setCustomerInstallmentSide(res?.data);
                        if (defaultInstallmentItemId) {
                            const item: IPolicyInstallmentItemResponse = res?.data?.items.find((c: IPolicyInstallmentItemResponse) => c.id === defaultInstallmentItemId);
                            setValue('depositRequest.amount', item.dueAmount)
                        }
                        setLoading(false);
                    })
                }

            } else {
                setValue('depositRequest.amount', row?.totalAmount ?? 0);
            }
        }
        catch { setLoading(false); }
    }

    const handleClose = () => {
        onClose(false);
    }

    let differenceDeposit = 0;
    const validatePaymentAmount = (
        req: IPolicyPaymentRequest,
        addendum?: AddendumResponse | null,
        debt?: PolicyPaymentPendingDebtResponse | null): ValidatePaymentAmountType => {

        if (!_paymentType) return "unknown";

        let amount = req?.depositRequest?.amount ?? 0;

        if (req.depositRequest?.depositMethodType === DepositMethodType.Wallet)
            if (balanceValue > 0 || balanceValue === 0)
                return 'equals'
            else return 'invalidAmount'


        if (req.depositRequest?.depositMethodType === DepositMethodType.TransferToInsuranceCompanyAccount)
            return 'equals';

        let dueAmount = 0

        if (addendum && _paymentType === PaymentType.Cash) { //الحاقیه
            dueAmount = addendum.premiumChangeAmount ?? 0;
        }

        else if (debt) {
            dueAmount = debt.amount;
        }
        else {
            const currentInstallmentItem = _paymentType === PaymentType.Installment
                ? customerInstallmentSide?.items.find(c => c.id === req.policyInstallmentItemId)
                : null;

            dueAmount = _paymentType === PaymentType.Installment
                ? currentInstallmentItem?.dueAmount ?? 0
                : row?.totalAmount ?? 0;
        }

        const isAmountInvalid = dueAmount > amount;

        if (isAmountInvalid) {
            return "invalidAmount"; // مقدار نامعتبر
        }

        const isAmountValid = dueAmount < amount;
        if (isAmountValid) {
            differenceDeposit = amount - dueAmount;
            return "depositAmount"
        }

        return "equals"
    };

    const onSubmit = async (req: IPolicyPaymentRequest) => {
        try {

            req.sideType = sideType;
            req.insurancePolicyId = row?.id ?? 0;

            if (_paymentType === PaymentType.Cash) {
                req.policyPaymentGroupTypeId = PolicyPaymentGroupType.CashGroup;
            }
            if (_paymentType === PaymentType.Installment) {
                req.policyPaymentGroupTypeId = PolicyPaymentGroupType.InstallmentGroup;
            }
            if (addendum) {
                req.policyPaymentGroupTypeId = PolicyPaymentGroupType.AddendumGroup;
                req.addendumId = addendum.id;
            }
            if (debt) {
                req.policyPaymentGroupTypeId = PolicyPaymentGroupType.DebtGroup;
                req.policyPaymentPendingDebtId = debt.id
            }

            const validType = validatePaymentAmount(req, addendum, debt);
            if (validType === 'unknown') {
                toast.error('validate payment amount is unknown.');
                return;
            }
            if (validType === 'invalidAmount') {
                setSubmissionRequest(req);
                setOpenDialog(true);
                return;
            } if (validType === 'depositAmount') {
                const isConfirmed = await confirm({
                    title: 'هشدار',
                    content: (
                        <Stack>
                            <Typography fontWeight={500} component={'h4'} mb={1}>کاربر گرامی!</Typography>
                            <Typography>
                                مبلغ واريزی بیشتر از مبلغ سر رسید است. در صورت تسویه‌حساب، مابه‌التفاوت به کیف پول مشتری واریز خواهد شد.
                                <Typography color='error' fontWeight={500}>
                                    {" "}
                                    مبلغ واریزی به کیف پول:
                                    {" "}
                                    {digitSeprator(differenceDeposit)}
                                </Typography>
                            </Typography>
                        </Stack>
                    ),
                    confirmationText: 'بله، ادامه می دهم',
                    cancellationText: 'نه، انصراف',
                });
                if (!isConfirmed)
                    return;
            }


            await submitPayment(req);

        } catch {
            setLoading(false);
        }
    };

    const handleConfirm = async (confirm: boolean, startDate?: Date | null | string, paymentOption?: PolicyPaymentOption | null) => {
        if (!confirm || !submissionRequest)
            return;
        setOpenDialog(false);
        submissionRequest.newInstallmentStartDate = startDate ?? null;
        submissionRequest.policyPaymentOption = paymentOption ?? PolicyPaymentOption.None
        await submitPayment(submissionRequest);
    };

    const submitPayment = async (request: IPolicyPaymentRequest) => {
        try {

            setLoading(true);
            request.files = files;
            await singlePolicyPayment(request).then(() => {
                toast.success('پرداخت با موفقیت انجام شد');
                getWalletBalance(watch('payerPersonId') ?? 0);
                getInstallment(sideType, _paymentType ?? PaymentType.Cash, addendum?.id ?? null);
                setSubmissionRequest(null);
                handleClose();
                setFiles([]);
                setLoading(false);
            });

        } catch { setLoading(false); }
    };

    useEffect(() => {
        getInstallment(sideType, _paymentType ?? PaymentType.Cash, addendum?.id ?? null);

    }, [watch('lifeInsuranceYear')])

    return (
        <>
            <ConfirmDialog />

            <PaymentOptionConfirmDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                confirm={(c, s, p) => handleConfirm(c, s, p)}
                row={row}
                installment={customerInstallmentSide}
                depositMethodType={paymentMethod}
                installmentItemId={watch('policyInstallmentItemId')}
                paymentGroupType={paymentGroupType}
                depositRequest={watch('depositRequest') as DepositRequest}
            />

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
                                {'پرداخت بیمه نامه'}{' / '}{row?.customerName}{' / '}
                                {_paymentType === PaymentType.Installment ? 'اقساطی' : 'نقدی'}
                                {' / '}
                                {paymentGroupType === PolicyPaymentGroupType.AddendumGroup && "الحاقیه"}
                                {paymentGroupType === PolicyPaymentGroupType.DebtGroup && "بدهی"}
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
                                                        <WalletOutlined
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
                            {(open) &&
                                <Grid2 size={{ xl: 6, lg: 6, md: 6, sm: 6, xs: 12 }}>
                                    <FormControl fullWidth>
                                        <FormLabel>پرداخت کننده</FormLabel>
                                        <Controller
                                            control={control}
                                            name='payerPersonId'
                                            rules={{ required: "فیلد اجباری است" }}
                                            render={({ field: { value }, fieldState: { error } }) =>
                                                <PeopleAutoComplete
                                                    onChange={handlePeopleAutoChange}
                                                    value={value}
                                                    error={!!error}
                                                    helperText={error?.message}
                                                    disabled={sideType === InstallmentSideType.Insurance}
                                                />
                                            }
                                        />
                                    </FormControl>
                                </Grid2>
                            }
                            {(_paymentType === PaymentType.Installment && paymentGroupType !== PolicyPaymentGroupType.DebtGroup) &&
                                <>
                                    {isLifeInsurance &&
                                        <Grid2 size={{ xl: 2, lg: 2, md: 2, sm: 12, xs: 12 }}>
                                            <FormControl fullWidth>
                                                <FormLabel>سال</FormLabel>
                                                <Controller
                                                    control={control}
                                                    name='lifeInsuranceYear'
                                                    render={({ field: { value, onChange }, fieldState: { error } }) =>
                                                        <LifeInsuranceYearAutoComplete
                                                            onChange={onChange}
                                                            value={value}
                                                            lifeInsuranceYear={Number(watch('lifeInsuranceYear'))} />
                                                    }
                                                />

                                            </FormControl>
                                        </Grid2>
                                    }
                                    <Grid2 size={{ xl: isLifeInsurance ? 4 : 6, lg: isLifeInsurance ? 4 : 6, md: 4, sm: 12, xs: 12 }}>
                                        <FormControl fullWidth>
                                            <FormLabel>سر رسید اقساط</FormLabel>
                                            <Controller
                                                control={control}
                                                name='policyInstallmentItemId'
                                                rules={{ required: "فیلد اجباری است" }}
                                                render={({ field: { value }, fieldState: { error } }) =>
                                                    <InstallmentAutoComplete
                                                        items={customerInstallmentSide?.items ?? []}
                                                        error={!!error}
                                                        helperText={error?.message}
                                                        onChange={handleInstallmentItemChange}
                                                        value={value}
                                                        disabled={hasDefaultInstalmmentItemId}
                                                    />
                                                }
                                            />
                                        </FormControl>
                                    </Grid2>
                                </>
                            }
                            <Grid2 size={{ xl: 4, lg: 4, md: 6, sm: 6, xs: 12 }}>
                                <FormControl fullWidth>
                                    <FormLabel>نوع واریز</FormLabel>
                                    <Controller
                                        control={control}
                                        name='depositRequest.depositMethodType'
                                        rules={{ required: "فیلد اجباری است" }}
                                        render={({ field: { value }, fieldState: { error } }) =>
                                            <PaymentMethodAutoComplete
                                                onChange={(e) => handlePaymentMethodChange(e)}
                                                value={value}
                                                error={!!error}
                                                helperText={error?.message}
                                                excludeOptions={
                                                    sideType === InstallmentSideType.Insurance ?
                                                        [DepositMethodType.Cash, DepositMethodType.Wallet]
                                                        :
                                                        []
                                                }
                                            />
                                        }
                                    />
                                </FormControl>
                            </Grid2>


                            <Grid2 size={{ xl: 4, lg: 4, md: 6, sm: 6, xs: 12 }}>
                                <FormControl fullWidth>
                                    <FormLabel>مبلغ واریز (ریال)</FormLabel>
                                    <Controller
                                        control={control}
                                        name='depositRequest.amount'
                                        rules={{ required: "فیلد اجباری است" }}
                                        render={({ field: { value, onChange }, fieldState: { error } }) =>
                                            <NumericFormat
                                                customInput={TextField}
                                                onValueChange={(values) => {
                                                    onChange(values.floatValue);
                                                    if (paymentMethod === DepositMethodType.Wallet)
                                                        setBalanceValue(initialBalance - (values.floatValue ?? 0));
                                                }}
                                                value={value || ''}
                                                thousandSeparator
                                                valueIsNumericString
                                                prefix=""
                                                variant="outlined"
                                                dir='ltr'
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        }
                                    />
                                </FormControl>
                            </Grid2>

                            <Grid2 size={{ xl: 4, lg: 4, md: 6, sm: 6, xs: 12 }}>
                                <FormControl fullWidth>
                                    <FormLabel>تاریخ پرداخت</FormLabel>
                                    <Controller
                                        control={control}
                                        name='depositRequest.paymentDate'
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

                            {(paymentMethod === DepositMethodType.BankTransfer || paymentMethod === DepositMethodType.Agency || paymentMethod === DepositMethodType.TransferToInsuranceCompanyAccount) &&

                                <Grid2 size={{ xl: 4, lg: 4, md: 6, sm: 6, xs: 12 }}>
                                    <FormControl fullWidth>
                                        <FormLabel>شماره پیگیری</FormLabel>
                                        <Controller
                                            control={control}
                                            name='depositRequest.transactionId'
                                            render={({ field: { value, onChange }, fieldState: { error } }) =>
                                                <TextField
                                                    onChange={onChange}
                                                    value={value || ''}
                                                    dir='ltr'
                                                />
                                            }
                                        />
                                    </FormControl>
                                </Grid2>
                            }

                            {paymentMethod === DepositMethodType.Agency &&
                                <Grid2 size={{ xl: 4, lg: 4, md: 6, sm: 6, xs: 12 }}>
                                    <FormControl fullWidth>
                                        <FormLabel>بانک مقصد</FormLabel>
                                        <Controller
                                            control={control}
                                            name='depositRequest.companyAgencyBankAccountId'
                                            render={({ field: { value, onChange }, fieldState: { error } }) =>
                                                <AgencyBankAccountAutoComplete
                                                    onChange={onChange}
                                                    value={value}
                                                    companyAgencyId={row?.insuranceCompanyAgencyId_IssueUnit ?? 0}
                                                />
                                            }
                                        />
                                    </FormControl>
                                </Grid2>
                            }

                            {paymentMethod === DepositMethodType.BankTransfer &&
                                <Grid2 size={{ xl: 4, lg: 4, md: 6, sm: 6, xs: 12 }}>
                                    <FormControl fullWidth>
                                        <FormLabel>بانک مقصد</FormLabel>
                                        <Controller
                                            control={control}
                                            name='depositRequest.targetBankAccountId'
                                            render={({ field: { value, onChange }, fieldState: { error } }) =>
                                                <BankAccountAutoComplete
                                                    onChange={onChange}
                                                    value={value}

                                                />
                                            }
                                        />
                                    </FormControl>
                                </Grid2>
                            }

                            {paymentMethod === DepositMethodType.Cash &&
                                <Grid2 size={{ xl: 4, lg: 4, md: 6, sm: 6, xs: 12 }}>
                                    <FormControl fullWidth>
                                        <FormLabel>دریافت کننده</FormLabel>
                                        <Controller
                                            control={control}
                                            name='depositRequest.receivedBy'
                                            render={({ field: { value, onChange }, fieldState: { error } }) =>
                                                <TextField
                                                    onChange={onChange}
                                                    value={value || ''}
                                                />
                                            }
                                        />
                                    </FormControl>
                                </Grid2>
                            }

                            {paymentMethod === DepositMethodType.Cheque &&
                                <>
                                    <Grid2 size={{ xl: 4, lg: 4, md: 6, sm: 6, xs: 12 }}>
                                        <FormControl fullWidth>
                                            <FormLabel>شماره چک</FormLabel>
                                            <Controller
                                                control={control}
                                                name='depositRequest.chequeNumber'
                                                render={({ field: { value, onChange }, fieldState: { error } }) =>
                                                    <TextField
                                                        onChange={onChange}
                                                        value={value || ''}
                                                        dir='ltr'
                                                    />
                                                }
                                            />
                                        </FormControl>
                                    </Grid2>
                                    <Grid2 size={{ xl: 4, lg: 4, md: 6, sm: 6, xs: 12 }}>
                                        <FormControl fullWidth>
                                            <FormLabel>تاریخ چک</FormLabel>
                                            <Controller
                                                control={control}
                                                name='depositRequest.chequeDueDate'
                                                render={({ field: { value, onChange }, fieldState: { error } }) =>
                                                    <MyDatePicker
                                                        onChange={onChange}
                                                        value={value}
                                                    />
                                                }
                                            />
                                        </FormControl>
                                    </Grid2>
                                    <Grid2 size={{ xl: 4, lg: 4, md: 6, sm: 6, xs: 12 }}>
                                        <FormControl fullWidth>
                                            <FormLabel>بانک صادر کننده چک</FormLabel>
                                            <Controller
                                                control={control}
                                                name='depositRequest.chequeBankName'
                                                render={({ field: { value, onChange }, fieldState: { error } }) =>
                                                    <TextField
                                                        onChange={onChange}
                                                        value={value || ''}
                                                    />
                                                }
                                            />
                                        </FormControl>
                                    </Grid2>
                                    <Grid2 size={{ xl: 4, lg: 4, md: 6, sm: 6, xs: 12 }}>
                                        <FormControl fullWidth>
                                            <FormLabel>شماره حساب چک</FormLabel>
                                            <Controller
                                                control={control}
                                                name='depositRequest.chequeAccountNumber'
                                                render={({ field: { value, onChange }, fieldState: { error } }) =>
                                                    <TextField
                                                        onChange={onChange}
                                                        value={value || ''}
                                                        dir='ltr'
                                                    />
                                                }
                                            />
                                        </FormControl>
                                    </Grid2>
                                    <Grid2 size={{ xl: 4, lg: 4, md: 6, sm: 6, xs: 12 }}>
                                        <FormControl fullWidth>
                                            <FormLabel>صاحب حساب چک</FormLabel>
                                            <Controller
                                                control={control}
                                                name='depositRequest.chequeAccountOwner'
                                                render={({ field: { value, onChange }, fieldState: { error } }) =>
                                                    <TextField
                                                        onChange={onChange}
                                                        value={value || ''}
                                                    />
                                                }
                                            />
                                        </FormControl>
                                    </Grid2>
                                </>
                            }

                            {open &&
                                <Grid2 size={12}>
                                    <AttachmentFileList
                                        entityType='PolicyPayment'
                                        setFiles={setFiles}
                                    />
                                </Grid2>
                            }

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


                        </Grid2>

                        {(_paymentType === PaymentType.Installment && showInstallmentList) &&
                            <Accordion sx={{ marginTop: 2 }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography component="span"> لیست اقساط</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <InstallmentList items={customerInstallmentSide?.items ?? []} />
                                </AccordionDetails>
                            </Accordion>
                        }

                    </DialogContent>

                    <DialogActions>
                        <Button size='small' onClick={handleClose} >بستن</Button>
                        <Button
                            size='small'
                            color='success'
                            variant='contained'
                            type='submit'
                            loading={loading}
                        >ثبت</Button>
                    </DialogActions>

                </form>

            </Dialog >

        </>
    )
}

