import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormLabel,
    Grid2,
    TextField
} from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { NumericFormat } from 'react-number-format';
import { IBankAccount } from '../../types/BankAccount';
import { createBankAccount, updateBankAccount } from '../../server/services/bankService';
import { useBankStore } from '../../stores/bankStore';
import BankAutoComplete from '../../components/common/dropDown/BankAutoComplete';


interface IProps {
    open: boolean
    onClose: (open: boolean) => void,
    data?: IBankAccount | null
}

const defaultValues: IBankAccount = {
    id: null,
    accountNumber: null,
    bankId: null,
    branchName: '',
    cardNumber: '',
    ownerAccountName: '',
    shebaNumber: '',
    isActive: true
}

export default function CreateOrUpdateDialog(props: IProps) {

    const { open, onClose, data } = props;
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = React.useState(open);
    const { getAccountList } = useBankStore();

    const { control, handleSubmit, reset } = useForm<IBankAccount>({
        defaultValues: defaultValues
    });

    useEffect(() => {
        if (open) {
            setOpenDialog(true);
            if (data) {
                reset(data)
            } else {
                reset(defaultValues)
            }
        }
    }, [open])

    const handleClose = () => {
        onClose(false);
        setOpenDialog(false);
        reset(defaultValues);
    };

    const onSubmit = (req: IBankAccount) => {
        if (data) {
            update(req);
        }
        else {
            insert(req);
        }
    }

    const insert = async (data: IBankAccount) => {
        try {
            setLoading(true);
            await createBankAccount(data).then(() => {
                reset(defaultValues)
                handleClose();
                toast.success('اطلاعات با موفقیت ثبت شد');
                getAccountList();
                setLoading(false);

            });
        } catch {
            setLoading(false);
        }
    }

    const update = async (data: IBankAccount) => {
        try {
            setLoading(true);
            await updateBankAccount(data).then(() => {
                reset(defaultValues)
                handleClose();
                toast.success('اطلاعات با موفقیت ثبت شد');
                getAccountList();
                setLoading(false);
            });
        } catch {
            setLoading(false);
        }
    }


    return (
        <>
            <Dialog
                maxWidth='md'
                open={openDialog}
                keepMounted
                onClose={handleClose}
                aria-describedby="dialog-person"
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogTitle>{!data ? "جدید" : "ویرایش"}</DialogTitle>
                    <DialogContent sx={{ paddingBottom: 2 }}>
                        <Grid2 container spacing={2}>
                            <Grid2 size={{ lg: 4, xl: 4, md: 6, sm: 6, xs: 12 }}>
                                <FormControl fullWidth>
                                    <FormLabel>بانک</FormLabel>
                                    <Controller
                                        control={control}
                                        name='bankId'
                                        rules={{ required: 'فیلد اجباری' }}
                                        render={({ field: { onChange, value }, fieldState: { error } }) =>
                                            <BankAutoComplete
                                                onChange={onChange}
                                                value={value}
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        }
                                    />
                                </FormControl>
                            </Grid2>
                            <Grid2 size={{ lg: 4, xl: 4, md: 6, sm: 6, xs: 12 }}>
                                <FormControl fullWidth>
                                    <FormLabel>شعبه</FormLabel>
                                    <Controller
                                        control={control}
                                        name='branchName'
                                        rules={{
                                            required: 'فیلد اجباری'
                                        }}
                                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) =>
                                            <TextField
                                                variant='outlined'
                                                onBlur={onBlur}
                                                value={value || ''}
                                                onChange={onChange}
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        }
                                    />
                                </FormControl>
                            </Grid2>
                            <Grid2 size={{ lg: 4, xl: 4, md: 6, sm: 6, xs: 12 }}>
                                <FormControl fullWidth>
                                    <FormLabel>شماره حساب</FormLabel>
                                    <Controller
                                        control={control}
                                        name='accountNumber'
                                        rules={{
                                            required: 'فیلد اجباری'
                                        }}
                                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) =>
                                            <NumericFormat
                                                customInput={TextField}
                                                variant='outlined'
                                                value={value || ''}
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                error={!!error}
                                                helperText={error?.message}
                                                dir='ltr'
                                                allowLeadingZeros
                                            />
                                        }
                                    />
                                </FormControl>
                            </Grid2>
                            <Grid2 size={{ lg: 4, xl: 4, md: 6, sm: 6, xs: 12 }}>
                                <FormControl fullWidth>
                                    <FormLabel>صاحب حساب</FormLabel>
                                    <Controller
                                        control={control}
                                        rules={{ required: 'فیلد اجباری' }}
                                        name='ownerAccountName'
                                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) =>
                                            <TextField
                                                variant='outlined'
                                                onBlur={onBlur}
                                                value={value || ''}
                                                onChange={onChange}
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        }
                                    />
                                </FormControl>
                            </Grid2>
                            <Grid2 size={{ lg: 4, xl: 4, md: 6, sm: 6, xs: 12 }}>
                                <FormControl fullWidth>
                                    <FormLabel>شماره شبا</FormLabel>
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: 'فیلد اجباری است',
                                            pattern: {
                                                value: /^IR[0-9]{24}$/,
                                                message: 'فرمت شماره شبا معتبر نیست (مثال: IR123456789012345678901234)',
                                            },
                                            validate: (value) => {
                                                if (value?.length !== 26) return 'شماره شبا باید 26 کاراکتر باشد';
                                                if (!value.startsWith('IR')) return 'شماره شبا باید با IR شروع شود';
                                                return true;
                                            },
                                        }}
                                        name="shebaNumber"
                                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                            <TextField
                                                variant="outlined"
                                                value={value || ''}
                                                onChange={(e) => {
                                                    const val = e.target.value.toUpperCase(); // تبدیل به حروف بزرگ
                                                    onChange(val);
                                                }}
                                                onBlur={onBlur}
                                                error={!!error}
                                                helperText={error?.message}
                                                dir="ltr"
                                                inputProps={{
                                                    maxLength: 26,
                                                }}
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid2>
                            <Grid2 size={{ lg: 4, xl: 4, md: 6, sm: 6, xs: 12 }}>
                                <FormControl fullWidth>
                                    <FormLabel>شماره كارت</FormLabel>
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: 'فیلد اجباری',
                                            minLength: {
                                                value: 16,
                                                message: 'شماره کارت باید 16 رقم باشد'
                                            },
                                            maxLength: {
                                                value: 16,
                                                message: 'شماره کارت باید 16 رقم باشد'
                                            },
                                            pattern: {
                                                value: /^[0-9]{16}$/,
                                                message: 'فقط ارقام مجاز هستند'
                                            }
                                        }}
                                        name='cardNumber'
                                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                                            <NumericFormat
                                                customInput={TextField}
                                                variant='outlined'
                                                value={value || ''}
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                error={!!error}
                                                helperText={error?.message}
                                                dir='ltr'
                                                allowLeadingZeros
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid2>
                            <Grid2 size={{ lg: 4, xl: 4, md: 6, sm: 6, xs: 12 }}>
                                <FormControl fullWidth>
                                    <FormLabel>وضعیت</FormLabel>
                                    <Controller
                                        control={control}
                                        name='isActive'
                                        render={({ field: { value, onChange, onBlur } }) =>
                                            <Checkbox
                                                checked={!!value}
                                                onChange={(e) => onChange(e.target.checked)}
                                                onBlur={onBlur}
                                            />

                                        }
                                    />
                                </FormControl>
                            </Grid2>
                        </Grid2>
                    </DialogContent>
                    <DialogActions>
                        <Button type='submit' color='success' variant='contained' size='small' loading={loading}>
                            {loading ? 'در حال ثبت...' : 'ثبت'}
                        </Button>
                        <Button size='small' onClick={handleClose} disabled={loading}>
                            بستن
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    )
}
