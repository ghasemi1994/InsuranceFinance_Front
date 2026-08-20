import { changePassword } from '@/server/services/userService'
import { IChangePassword } from '@/types/User'
import { signOut } from '@/utils/userAuthenticate'
import { Logout } from '@mui/icons-material'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormLabel,
    Grid2,
    TextField,
    Typography
} from '@mui/material'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'


interface UserNeedToChangePasswordDialogProps {
    open: boolean,
    onClose?: (open: boolean) => void,
}
export default function UserNeedToChangePasswordDialog({ open, onClose }: UserNeedToChangePasswordDialogProps) {

    const {
        control,
        handleSubmit,
        formState: { isSubmitting }
    } = useForm<IChangePassword>({
        defaultValues: {
            confirmNewPassword: null,
            currentPassword: null,
            newPassword: null
        }
    });

    const onSubmit = async (req: IChangePassword) => {
        await changePassword(req).then(() => {
            //toast.success('رمز عبور شما با موفقیت تغییر یافت');
            signOut();
        });
    }

    return (
        <>
            <Dialog
                open={open}
                maxWidth='sm'
                fullWidth
                keepMounted
                onClose={onClose}
                component={'form'}
                onSubmit={handleSubmit(onSubmit)}
            >
                <DialogTitle mb={2}>
                    <Typography>کاربر گرامی! رمز عبور شما منقضی شده است  لطفا نسبت به تغییر آن اقدام فرمایید.</Typography>
                </DialogTitle>
                <DialogContent>

                    <Grid2 container spacing={2}>
                        <Grid2 size={{ lg: 4, xl: 4, md: 6, sm: 6, xs: 12 }}>
                            <FormControl fullWidth>
                                <FormLabel>رمز عبور فعلی</FormLabel>
                                <Controller
                                    control={control}
                                    name='currentPassword'
                                    rules={{
                                        required: 'فیلد اجباری است',
                                        min: {
                                            value: 8,
                                            message: 'رمز عبور نباید کم تر از 8 کاراکتر باشد'
                                        },
                                    }}
                                    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) =>
                                        <TextField
                                            value={value}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            dir='ltr'
                                            error={!!error}
                                            helperText={error?.message}
                                            type='password'
                                        />
                                    }
                                />
                            </FormControl>
                        </Grid2>
                        <Grid2 size={{ lg: 4, xl: 4, md: 6, sm: 6, xs: 12 }}>
                            <FormControl fullWidth>
                                <FormLabel>رمز عبور جدید</FormLabel>
                                <Controller
                                    control={control}
                                    name='newPassword'
                                    rules={{
                                        required: 'فیلد اجباری است',
                                        min: {
                                            value: 8,
                                            message: 'رمز عبور نباید کم تر از 8 کاراکتر باشد'
                                        },
                                    }}
                                    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) =>
                                        <TextField
                                            value={value}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            dir='ltr'
                                            error={!!error}
                                            helperText={error?.message}
                                            type='password'
                                        />
                                    }
                                />
                            </FormControl>
                        </Grid2>
                        <Grid2 size={{ lg: 4, xl: 4, md: 6, sm: 6, xs: 12 }}>
                            <FormControl fullWidth>
                                <FormLabel>تکرار رمز عبور جدید </FormLabel>
                                <Controller
                                    control={control}
                                    name='confirmNewPassword'
                                    rules={{
                                        required: 'فیلد اجباری است',
                                        min: {
                                            value: 8,
                                            message: 'رمز عبور نباید کم تر از 8 کاراکتر باشد'
                                        },
                                    }}
                                    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) =>
                                        <TextField
                                            value={value}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            dir='ltr'
                                            error={!!error}
                                            helperText={error?.message}
                                            type='password'
                                        />
                                    }
                                />
                            </FormControl>
                        </Grid2>
                    </Grid2>

                </DialogContent>
                <DialogActions>

                    <Button
                        variant='contained'
                        color='success'
                        type='submit'
                        loading={isSubmitting}
                    >
                        دخیره رمز عبور
                    </Button>
                    <Button
                        variant='contained'
                        endIcon={<Logout />}
                        onClick={() => signOut()}
                    >
                        خروج از برنامه
                    </Button>


                </DialogActions>
            </Dialog>
        </>
    )
}
