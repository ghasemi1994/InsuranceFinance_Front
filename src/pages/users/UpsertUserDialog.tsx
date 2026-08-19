import OfficeBranchAutoComplete from '@/components/common/dropDown/OfficeBranchAutoComplete';
import { getRoleList } from '@/server/services/permissionService';
import { updateUser, updateUserRole } from '@/server/services/userService';
import { RoleResponse } from '@/types/PermissionTypes';
import { IUserResponse, UpdateUserRequest, UpdateUserRoleRequest } from '@/types/User';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormLabel, Grid2, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';


interface UpsertUserDialogProps {
    open: boolean,
    onClose?: (open: boolean) => void,
    user: IUserResponse | null
}

export default function UpsertUserDialog({ open, onClose, user }: UpsertUserDialogProps) {

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<RoleResponse[]>([]);

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting }
    } = useForm<UpdateUserRequest>({
        defaultValues: {
            userRoles: [],
        }
    });

    useEffect(() => {
        if (open && user) {
            reset({
                id: user.id,
                userRoles: user.roleIds ?? [],
                phoneNumber: user.phoneNumber,
                userName: user.userName,
                firstName: user.firstName,
                lastName: user.lastName,
                officeBranchId: user?.officeBranchId
            });
        }
    }, [open, user, reset]);

    const onSubmit = async (data: UpdateUserRequest) => {
        setLoading(true);
        await updateUser(data)
            .then((response) => {
                toast.success('اطلاعات با موفقیت ذخیره شد');
                onClose?.(true);
            }).finally(() => setLoading(false));
    }

    const getData = async () => {
        await getRoleList().then((res) => {
            setData(res?.data);
        });
    }

    useEffect(() => {
        getData();
    }, []);


    return (
        <Dialog
            open={open}
            maxWidth='md'
            fullWidth
            keepMounted
            onClose={onClose}
            component={'form'}
            onSubmit={handleSubmit(onSubmit)}
        >
            <DialogContent>
                <Grid2 container spacing={2}>
                    <Grid2 size={{ xl: 4, lg: 4, md: 6, sm: 6, xs: 12 }}>
                        <FormControl fullWidth>
                            <FormLabel>نام</FormLabel>
                            <Controller
                                control={control}
                                name="firstName"
                                rules={{
                                    required: "فیلد اجباری"
                                }}
                                render={({
                                    field: { value, onChange },
                                    fieldState: { error }
                                }) => (
                                    <TextField
                                        value={value}
                                        onChange={onChange}
                                        error={!!error}
                                        helperText={error?.message}
                                    />
                                )}
                            />
                        </FormControl>
                    </Grid2>
                    <Grid2 size={{ xl: 4, lg: 4, md: 6, sm: 6, xs: 12 }}>
                        <FormControl fullWidth>
                            <FormLabel>نام خانوادگی</FormLabel>
                            <Controller
                                control={control}
                                name="lastName"
                                rules={{
                                    required: "فیلد اجباری"
                                }}
                                render={({
                                    field: { value, onChange },
                                    fieldState: { error }
                                }) => (
                                    <TextField
                                        value={value}
                                        onChange={onChange}
                                        error={!!error}
                                        helperText={error?.message}
                                    />
                                )}
                            />
                        </FormControl>
                    </Grid2>
                    <Grid2 size={{ xl: 4, lg: 4, md: 6, sm: 6, xs: 12 }}>
                        <FormControl fullWidth>
                            <FormLabel>نام کاربری</FormLabel>
                            <Controller
                                control={control}
                                name="userName"
                                rules={{
                                    required: "فیلد اجباری"
                                }}
                                render={({
                                    field: { value, onChange },
                                    fieldState: { error }
                                }) => (
                                    <TextField
                                        value={value}
                                        onChange={onChange}
                                        error={!!error}
                                        helperText={error?.message}
                                        dir='ltr'
                                    />
                                )}
                            />
                        </FormControl>
                    </Grid2>
                    <Grid2 size={{ xl: 4, lg: 4, md: 6, sm: 6, xs: 12 }}>
                        <FormControl fullWidth>
                            <FormLabel>موبایل</FormLabel>
                            <Controller
                                control={control}
                                name="phoneNumber"
                                rules={{
                                    required: "فیلد اجباری"
                                }}
                                render={({
                                    field: { value, onChange },
                                    fieldState: { error }
                                }) => (
                                    <TextField
                                        value={value}
                                        onChange={onChange}
                                        error={!!error}
                                        helperText={error?.message}
                                        dir='ltr'
                                    />
                                )}
                            />
                        </FormControl>
                    </Grid2>
                    {/* <Grid2 size={{ xl: 4, lg: 4, md: 6, sm: 6, xs: 12 }}>
                        <FormControl fullWidth>
                            <FormLabel>شعبه</FormLabel>
                            <Controller
                                control={control}
                                name="officeBranchId"   
                                render={({
                                    field: { value, onChange },
                                    fieldState: { error }
                                }) => (
                                    <OfficeBranchAutoComplete
                                        value={value}
                                        onChange={onChange}
                                        error={!!error}
                                        helperText={error?.message}
                                    />
                                )}
                            />
                        </FormControl>
                    </Grid2> */}


                    <Grid2 size={12}>
                        <FormControl fullWidth>
                            <FormLabel>نقش ها</FormLabel>
                            <Controller
                                control={control}
                                name="userRoles"
                                rules={{
                                    required: "فیلد اجباری"
                                }}
                                render={({
                                    field: { value, onChange },
                                    fieldState: { error }
                                }) => (
                                    <Autocomplete
                                        multiple
                                        options={data ?? []}
                                        value={
                                            (data ?? []).filter(x =>
                                                value?.includes(x.id)
                                            )
                                        }
                                        onChange={(_, selected) =>
                                            onChange(
                                                selected.map(x => x.id)
                                            )
                                        }
                                        getOptionLabel={(option) =>
                                            option.name
                                        }
                                        isOptionEqualToValue={(option, val) =>
                                            option.id === val.id
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        )}
                                    />
                                )}
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
                    ثبت
                </Button>
                <Button
                    variant='contained'
                    onClick={() => onClose?.(false)}
                >
                    بستن
                </Button>
            </DialogActions>
        </Dialog>
    )
}
