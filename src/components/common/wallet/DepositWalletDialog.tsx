import React, { useEffect, useState } from 'react'
import {
    Button, Dialog, DialogActions, DialogContent,
    DialogTitle, Divider, FormControl,
    FormLabel, Grid2, TextField
} from '@mui/material'

import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { DepositMethodType, DepositWallet } from '../../../types/Wallet'
import { depositWallet } from '../../../server/services/walletService'
import PeopleAutoComplete from '../dropDown/PeopleAutoComplete'
import PaymentMethodAutoComplete from '../dropDown/PaymentMethodAutoComplete'
import { NumericFormat } from 'react-number-format'
import MyDatePicker from '../datePicker/MyDatePicker'
import BankAccountAutoComplete from '../dropDown/BankAccountAutoComplete'
import AttachmentFileList from '../../../pages/attachment/AttachmentFileList'
import { toPersianDate } from '../../../utils/convertion'
import WalletBalance from './WalletBalance'




interface IProps {
    open: boolean
    onClose: (open: boolean) => void,
}

const defaultValues = {
    depositRequest: {
        chequeAccountNumber: null,
        chequeAccountOwner: null,
        chequeDueDate: toPersianDate(new Date()),
        chequeNumber: null,
        chequeBankName: null,
        targetBankAccountId: null,
        paymentDate: toPersianDate(new Date()),
        depositMethodType: null,
        receivedBy: null,
        amount: null,
        transactionId: null
    },
    personId: null
} as DepositWallet

export default function DepositWalletDialog({ onClose, open }: IProps) {

    const [paymentMethod, setPaymentMethod] = useState<DepositMethodType | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [files, setFiles] = useState<File[] | null>(null);
    const [refreshBalance, setRefreshBalance] = useState(false);
    const [resetFlag, setResetFlag] = useState(0);


    const { control, setValue, handleSubmit, reset, watch } = useForm<DepositWallet>({
        defaultValues: defaultValues
    });

    useEffect(() => {
        reset(defaultValues);
        setPaymentMethod(null);
    }, [open])


    const handlePaymentMethodChange = (method: DepositMethodType | null) => {
        setPaymentMethod(method);
        setValue('depositRequest.depositMethodType', method ?? null);
    }

    const handleClose = () => {
        onClose(false);
    }



    const onSubmit = async (req: DepositWallet) => {
        try {
            setLoading(true);
            await depositWallet(req, files).then(() => {
                toast.success('کیف پول با موفقیت شارژ شد');
                reset(defaultValues);
                setPaymentMethod(null);
                setFiles([]);
                setRefreshBalance(prev => !prev);
                setLoading(false);
                setResetFlag((prev) => prev + 1);
            });
        } catch { setLoading(false); }
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
                                {'شارژ کیف پول'}
                            </Grid2>
                            <Grid2 size={{ xl: 3, lg: 3, md: 6, sm: 6, xs: 12 }}>
                                <WalletBalance
                                    personId={watch('personId') ?? null}
                                    refreshBalance={refreshBalance}
                                />
                            </Grid2>
                        </Grid2>
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        <Grid2 container spacing={2} width={'100%'}>

                            <Grid2 size={{ xl: 6, lg: 6, md: 6, sm: 6, xs: 12 }}>
                                <FormControl fullWidth>
                                    <FormLabel>واریز کننده</FormLabel>
                                    <Controller
                                        control={control}
                                        name='personId'
                                        rules={{ required: "فیلد اجباری است" }}
                                        render={({ field: { value, onChange }, fieldState: { error } }) =>
                                            <PeopleAutoComplete
                                                onChange={onChange}
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
                                    <FormLabel>نوع واریز</FormLabel>
                                    <Controller
                                        control={control}
                                        name='depositRequest.depositMethodType'
                                        rules={{ required: "فیلد اجباری است" }}
                                        render={({ field: { value }, fieldState: { error } }) =>
                                            <PaymentMethodAutoComplete
                                                onChange={(e) => handlePaymentMethodChange(e)}
                                                value={value}
                                                excludeOptions={
                                                    [
                                                        DepositMethodType.TransferToInsuranceCompanyAccount,
                                                        DepositMethodType.Wallet,
                                                        DepositMethodType.Agency
                                                    ]
                                                }
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        }
                                    />
                                </FormControl>
                            </Grid2>

                            <Grid2 size={{ xl: 3, lg: 3, md: 6, sm: 6, xs: 12 }}>
                                <FormControl fullWidth>
                                    <FormLabel>مبلغ واریز (ریال)</FormLabel>
                                    <Controller
                                        control={control}
                                        name='depositRequest.amount'
                                        rules={{ required: "فیلد اجباری است" }}
                                        render={({ field: { value, onChange }, fieldState: { error } }) =>
                                            <NumericFormat
                                                customInput={TextField}
                                                onChange={onChange}
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


                            <Grid2 size={{ xl: 3, lg: 3, md: 6, sm: 6, xs: 12 }}>
                                <FormControl fullWidth>
                                    <FormLabel>تاریخ واریز</FormLabel>
                                    <Controller
                                        control={control}
                                        name='depositRequest.paymentDate'
                                        rules={{ required: "فیلد اجباری است" }}
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



                            {paymentMethod === DepositMethodType.BankTransfer &&
                                <>
                                    <Grid2 size={{ xl: 3, lg: 3, md: 6, sm: 6, xs: 12 }}>
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
                                    <Grid2 size={{ xl: 3, lg: 3, md: 6, sm: 6, xs: 12 }}>
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
                                </>
                            }

                            {paymentMethod === DepositMethodType.Cash &&
                                <Grid2 size={{ xl: 6, lg: 6, md: 6, sm: 6, xs: 12 }}>
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
                                    <Grid2 size={{ xl: 3, lg: 3, md: 6, sm: 6, xs: 12 }}>
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
                                    <Grid2 size={{ xl: 3, lg: 3, md: 6, sm: 6, xs: 12 }}>
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
                                        entityType='WalletTransaction'
                                        setFiles={setFiles}
                                        resetTrigger={resetFlag}
                                    />
                                </Grid2>
                            }

                            <Grid2 size={12}>
                                <FormControl fullWidth>
                                    <FormLabel>توضیحات</FormLabel>
                                    <Controller
                                        control={control}
                                        name='depositRequest.description'
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
            </Dialog>
        </>
    )
}
