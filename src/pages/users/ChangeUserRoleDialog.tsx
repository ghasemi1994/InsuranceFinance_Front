import { getRoleList } from '@/server/services/permissionService';
import { updateUserRole } from '@/server/services/userService';
import { RoleResponse } from '@/types/PermissionTypes';
import { IUserResponse, UpdateUserRoleRequest } from '@/types/User';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormLabel, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';


interface ChangeUserRoleDialogProps {
    open: boolean,
    onClose?: (open: boolean) => void,
    user: IUserResponse | null
}

export default function ChangeUserRoleDialog({ open, onClose, user }: ChangeUserRoleDialogProps) {

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<RoleResponse[]>([]);

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting }
    } = useForm<UpdateUserRoleRequest>({
        defaultValues: {
            roleIds: [],
            userId: null
        }
    });

    useEffect(() => {
        if (open && user) {
            reset({
                userId: user.id,
                roleIds: user.roleIds ?? []
            });
        }
    }, [open, user, reset]);

    const onSubmit = async (data: UpdateUserRoleRequest) => {
        setLoading(true);
        await updateUserRole(data)
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
            maxWidth='sm'
            fullWidth
            keepMounted
            onClose={onClose}
            component={'form'}
            onSubmit={handleSubmit(onSubmit)}
        >
            <DialogContent>
                <FormControl fullWidth>
                    <FormLabel>نقش ها</FormLabel>
                    <Controller
                        control={control}
                        name="roleIds"
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
