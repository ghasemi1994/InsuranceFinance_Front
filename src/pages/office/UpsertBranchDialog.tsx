import UserAutoComplete from '@/components/common/dropDown/UserAutoComplete';
import { createBranch, updateBranch } from '@/server/services/officeService';
import { BranchResponse, CreateBranchRequest } from '@/types/OfficeTypes';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormLabel, Grid2, TextField } from '@mui/material'
import React, { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';



interface IProps {
    open: boolean
    onClose: (open: boolean) => void,
    item: BranchResponse | null
}
export default function UpsertBranchDialog({ onClose, open, item }: IProps) {

    const defaultValues = useMemo<CreateBranchRequest>(() => ({
        address: '',
        code: '',
        managerUserId: undefined,
        name: '',
        id: undefined
    }), []);

    const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm<CreateBranchRequest>({
        defaultValues: defaultValues
    });

    const onSubmit = async (data: CreateBranchRequest) => {
        if (!item) {
            await createBranch(data)
                .then(() => {
                    toast.success('اطلاعات با موفقیت ذخیره شد');
                    onClose(true);
                });
        } else {

            await updateBranch({
                address: data.address,
                code: data.code,
                name: data.name,
                managerUserId: data.managerUserId,
                id: item.id
            })
                .then(() => {
                    toast.success('اطلاعات با موفقیت ذخیره شد');
                    onClose(true);
                });
        }
    }

    useEffect(() => {
        if (!open) return;

        reset(
            item
                ? {
                    address: item.address ?? '',
                    code: item.code ?? '',
                    managerUserId: item.managerUserId,
                    name: item.name ?? '',
                }
                : defaultValues
        );
    }, [open]);

    return (
        <>
            <Dialog
                onSubmit={handleSubmit(onSubmit)}
                component={'form'}
                maxWidth='md'
                fullWidth
                open={open}
                keepMounted={false}
                onClose={onClose}
            >
                <Divider>
                    <DialogTitle >{"ایجاد شعبه"}</DialogTitle>
                </Divider>
                <DialogContent>
                    <Grid2 container spacing={2}>
                        <Grid2 size={{ xl: 4, lg: 4, md: 4, sm: 6, xs: 12 }}>
                            <FormControl fullWidth>
                                <FormLabel>نام شعبه</FormLabel>
                                <Controller
                                    control={control}
                                    name='name'
                                    rules={{
                                        required: 'فیلد اجباری'
                                    }}
                                    render={({ field, fieldState: { error } }) =>
                                        <TextField
                                            {...field}
                                            error={!!error}
                                            helperText={error?.message}
                                        />
                                    }
                                />
                            </FormControl>
                        </Grid2>
                        <Grid2 size={{ xl: 4, lg: 4, md: 4, sm: 6, xs: 12 }}>
                            <FormControl fullWidth>
                                <FormLabel>کد شعبه</FormLabel>
                                <Controller
                                    control={control}
                                    name='code'
                                    rules={{
                                        required: 'فیلد اجباری'
                                    }}
                                    render={({ field, fieldState: { error } }) =>
                                        <TextField
                                            {...field}
                                            dir='ltr'
                                            error={!!error}
                                            helperText={error?.message}
                                        />
                                    }
                                />
                            </FormControl>
                        </Grid2>
                        <Grid2 size={{ xl: 4, lg: 4, md: 4, sm: 6, xs: 12 }}>
                            <FormControl fullWidth>
                                <FormLabel>مدیر شعبه</FormLabel>
                                <Controller
                                    control={control}
                                    name='managerUserId'
                                    rules={{
                                        required: 'فیلد اجباری'
                                    }}
                                    render={({ field, fieldState: { error } }) =>
                                        <UserAutoComplete
                                            {...field}
                                            error={!!error}
                                            helperText={error?.message}
                                        />
                                    }
                                />
                            </FormControl>
                        </Grid2>
                        <Grid2 size={12}>
                            <FormControl fullWidth>
                                <FormLabel>آدرس شعبه</FormLabel>
                                <Controller
                                    control={control}
                                    name='address'
                                    rules={{
                                        required: 'فیلد اجباری'
                                    }}
                                    render={({ field, fieldState: { error } }) =>
                                        <TextField
                                            {...field}
                                            error={!!error}
                                            helperText={error?.message}
                                        />
                                    }
                                />
                            </FormControl>
                        </Grid2>
                    </Grid2>
                </DialogContent>
                <DialogActions>
                    <Button type='submit' color='success' variant='contained' loading={isSubmitting} >ثبت</Button>
                    <Button type='button' onClick={() => onClose(false)}>بستن</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
