import {
    Box,
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormLabel,
    Grid2,
    Stack,
    TextField,
    Tooltip
} from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import PeopleAutoComplete from '../../components/common/dropDown/PeopleAutoComplete';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import MyDataGrid from '../../components/common/dataGrid/MyDataGrid';
import { ICompanyAgencyBankAccountRequest, ICompanyAgencyBankAccountResponse, ICompanyAgencyRequest, ICompanyAgencyResponse } from '../../types/Company';
import { createAgencyBankAccount, createCompanyAgency, deleteAgency, getAgencyBankAccount, getCompanyAgencyList, updateAgencyBankAccount, updateCompanyAgency } from '../../server/services/companyService';
import toast from 'react-hot-toast';
import { AccountBalance, Edit } from '@mui/icons-material';
import { NumericFormat } from 'react-number-format';
import BankAutoComplete from '../../components/common/dropDown/BankAutoComplete';


interface IProps {
    open: boolean
    onClose: (open: boolean) => void,
    companyAgency: ICompanyAgencyResponse | null
}


export default function CompanyAgencyBankAccountDialog(props: IProps) {

    const { open, onClose, companyAgency } = props;

    const defaultValues = {
        accountNumber: '',
        bankId: null,
        branch: '',
        cardNumber: '',
        shebaNumber: '',
        companyAgencyId: companyAgency?.id,
        accountOwner: companyAgency?.fullName
    } as ICompanyAgencyBankAccountRequest



    const { control, handleSubmit, setValue, reset } = useForm<ICompanyAgencyBankAccountRequest>({ defaultValues: defaultValues });

    const [loading, setLoading] = useState<boolean>(false);

    const [data, setData] = useState<Array<ICompanyAgencyBankAccountResponse>>([]);

    const [formState, setFormState] = useState<'add' | 'edit'>('add');

    useEffect(() => {
        if (open) {
            setFormState('add');
            getData();
            reset(defaultValues)
            setValue('companyAgencyId', companyAgency?.id ?? 0);
        }
    }, [open])

    const getData = async () => {
        try {
            await getAgencyBankAccount(companyAgency?.id ?? 0).then((res) => {
                setData(res.data);
            });
        } catch { }
    }

    const handleClose = () => {
        onClose(false);
    };

    const onSubmit = async (data: ICompanyAgencyBankAccountRequest) => {
        if (formState === 'add')
            submitAddForm(data);
        else
            submitEditForm(data);
    }

    {/**edit form */ }
    const submitEditForm = async (data: ICompanyAgencyBankAccountRequest) => {
        try {
            setLoading(true);
            await updateAgencyBankAccount(data).then(() => {
                setLoading(false);
                getData();
                reset(defaultValues);
                setFormState('add');
                toast.success('اطلاعات با موفقیت ویرایش شد');
            });
        } catch {
            setLoading(false);
        }
    }

    {/**add form */ }
    const submitAddForm = async (data: ICompanyAgencyBankAccountRequest) => {
        try {
            setLoading(true);
            await createAgencyBankAccount(data).then(() => {
                setLoading(false);
                getData();
                reset(defaultValues);
                toast.success('اطلاعات با موفقیت ثبت شد');
            });
        } catch {
            setLoading(false);
        }
    }

    const handleDelete = async (id: number) => {
        /*if (window.confirm('از حذف اطلاعات مطمئن هستید؟') === true) {
            await deleteAgency(id).then(() => {
                toast.success('اطلاعات حذف شد');
                getData();
            });
        }*/
    };


    const columns: GridColDef[] = [
        {
            field: 'bankName',
            headerName: 'بانک',
            flex: 1.5,
        },
        {
            field: 'accountNumber',
            headerName: 'شماره حساب',
            flex: 1.5,
        },
        {
            field: 'cardNumber',
            headerName: 'شماره کارت',
            flex: 1.5,
        },
        {
            field: 'shebaNumber',
            headerName: 'شماره شبا',
            flex: 1.5,
        },
        {
            field: 'branch',
            headerName: 'شعبه',
            flex: 1.5,
        },
        {
            field: 'action',
            headerName: 'عملیات',
            flex: 1.5,
            filterable: false,
            sortable: false,
            type: 'actions',
            getActions: (params: any) => [
                // <Tooltip title='حذف'>
                //     <GridActionsCellItem
                //         icon={<DeleteIcon color='error' />}
                //         label="Delete"
                //         onClick={() => handleDelete(params.id)}
                //         showInMenu={false}
                //     />
                // </Tooltip>,
                <Tooltip title='ویرایش'>
                    <GridActionsCellItem
                        icon={<Edit color='primary' />}
                        label="Edit"
                        onClick={() => handleEdit(params.row)}
                        showInMenu={false}
                    />
                </Tooltip>
            ]
        },
    ]

    const handleEdit = (item: ICompanyAgencyBankAccountResponse) => {
        setFormState('edit');
        setValue('id', item.id);
        setValue('accountNumber', item.accountNumber);
        setValue('bankId', item.bankId);
        setValue('branch', item.branch);
        setValue('cardNumber', item.cardNumber);
        setValue('shebaNumber', item.shebaNumber);

    }

    const handleCancelClick = () => {
        reset(defaultValues);
        setFormState('add');
    }


    return (
        <>
            <Dialog
                fullWidth
                maxWidth='md'
                open={open}
                keepMounted
                onClose={handleClose}
                aria-describedby="dialog-person"
            >
                <DialogTitle>{`تعریف حساب بانکی نمایندگی (${companyAgency?.code}) (${companyAgency?.fullName})`}</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
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
                                        name='branch'
                                        rules={{
                                            required: 'فیلد اجباری'
                                        }}
                                        render={({ field: { onChange, value }, fieldState: { error } }) =>
                                            <TextField
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
                                    <FormLabel>شماره کارت</FormLabel>
                                    <Controller
                                        control={control}
                                        name='cardNumber'
                                        rules={{
                                            required: 'فیلد اجباری',
                                            pattern: {
                                                value: /^[0-9]{16}$/,
                                                message: 'شماره کارت معتبر نمی باشد',
                                            },
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
                                                placeholder='IR...'
                                                dir="ltr"
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid2>

                            <Grid2 size={{ lg: 4, xl: 4, md: 6, sm: 6, xs: 12 }}>
                                <FormControl fullWidth>
                                    <FormLabel>صاحب حساب</FormLabel>
                                    <Controller
                                        control={control}
                                        name='accountOwner'
                                        rules={{
                                            required: 'فیلد اجباری'
                                        }}
                                        render={({ field: { onChange, value }, fieldState: { error } }) =>
                                            <TextField
                                                onChange={onChange}
                                                value={value}
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        }
                                    />
                                </FormControl>
                            </Grid2>

                            <Stack sx={{ alignItems: 'end', justifyContent: 'end', flexDirection: 'row', gap: 1, width: '100%' }}>
                                {
                                    formState === 'edit'
                                        ?
                                        <Button type='button' onClick={handleCancelClick} variant='contained' size='small' color='secondary'>انصراف</Button>
                                        : ''
                                }
                                <Button
                                    type='submit'
                                    color={formState === 'add' ? 'success' : 'primary'}
                                    variant='contained'
                                    loading={loading}
                                    size='small'>
                                    {formState === 'add' ? 'ثبت' : 'ویرایش'}
                                </Button>
                            </Stack>
                        </Grid2>
                    </form>

                    <Box sx={{ marginTop: '10px', width: '100%' }}>
                        <MyDataGrid
                            loading={loading}
                            columns={columns}
                            rows={data}
                            getRowId={(row) => row.id}
                        />
                    </Box>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} size='small'>بستن</Button>
                </DialogActions>
            </Dialog>

        </>
    )
}
