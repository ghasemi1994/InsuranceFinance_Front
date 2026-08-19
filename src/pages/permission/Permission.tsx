import { Button, Card, CardContent, CardHeader, Divider, FormControl, FormLabel, Grid2, Typography } from '@mui/material'
import React, { useState } from 'react'
import MenuTreeView from './MenuTreeView'
import ResourceTreeView from './ResourceTreeView'
import RoleAutoComplete from '@/components/common/dropDown/RoleAutoComplete'
import { CreatePermissionRequest, MenuResponse, Resource } from '@/types/PermissionTypes'
import { createPermission, getPermissionByRoleId } from '@/server/services/permissionService'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

export default function Permission() {

    const [menus, setMenus] = useState<MenuResponse[]>([]);
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(false);

    const { setValue, watch, control, handleSubmit } = useForm<CreatePermissionRequest>();

    const handleRoleChange = async (roleId: number | null) => {
        setValue('roleId', roleId);
        if (roleId) {
            setLoading(true);
            await getPermissionByRoleId(roleId)
                .then((response) => {
                    setMenus(response?.data?.menus);
                    setResources(response?.data?.resources);
                })
                .finally(
                    () => setLoading(false)
                );
        }
        else {
            setMenus([]);
            setResources([]);
        }
    }

    const onSubmit = async (data: CreatePermissionRequest) => {
        setLoading(true);
        await createPermission(data).then((res) => {
            toast.success('اطلاعات با موفقیت ذخیره شد');
        }).finally(
            () => setLoading(false)
        );
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid2 container spacing={2}>
                    <Grid2 size={{ xl: 4, lg: 6, md: 4, sm: 6, xs: 12 }}>
                        <FormControl fullWidth>
                            <FormLabel>نقش ها</FormLabel>
                            <Controller
                                control={control}
                                name='roleId'
                                rules={{ required: 'فیلد اجباری است' }}
                                render={({ field: { value }, fieldState: { error } }) =>
                                    <RoleAutoComplete
                                        value={value}
                                        onChange={handleRoleChange}
                                        error={error ? true : undefined}
                                        helperText={error?.message}
                                    />
                                }
                            />
                        </FormControl>
                    </Grid2>
                    <Grid2 size={{ xl: 4, lg: 6, md: 4, sm: 6, xs: 12 }}>
                        <Button
                            type='submit'
                            variant='contained'
                            color='success'
                            loading={loading}
                            sx={{
                                marginTop: 4
                            }}>ثبت اطلاعات</Button>
                    </Grid2>
                </Grid2>
                <Divider sx={{ m: 2 }} />
                <Grid2 container spacing={2}>
                    <Grid2 size={{ xl: 4, lg: 6, md: 4, sm: 6, xs: 12 }}>
                        <Card>
                            <ResourceTreeView
                                resources={resources ?? []}
                                setResources={(r) => setValue('resources', r)}
                            />

                        </Card>
                    </Grid2>
                    <Grid2 size={{ xl: 4, lg: 6, md: 4, sm: 6, xs: 12 }}>
                        <Card>
                            <MenuTreeView
                                menus={menus ?? []}
                                setMenus={(m) => setValue('menus', m)}
                            />
                        </Card>
                    </Grid2>
                </Grid2>
            </form>
        </>
    )
}
