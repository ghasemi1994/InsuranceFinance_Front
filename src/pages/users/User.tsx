import MyDataGrid from '@/components/common/dataGrid/MyDataGrid'
import { changeUserActivity, getUserList, resetUserPassword } from '@/server/services/userService'
import { IUserResponse } from '@/types/User'
import { AccountCircle, Edit, Refresh, RollerShadesClosedOutlined, SupervisedUserCircle, Sync } from '@mui/icons-material'
import { Switch, Tooltip } from '@mui/material'
import { GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import ChangeUserRoleDialog from './ChangeUserRoleDialog'
import UpsertUserDialog from './UpsertUserDialog'
import toast from 'react-hot-toast'

export default function User() {

    const [userList, setUserList] = useState<IUserResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [showChangeRoleDialog, setShowChangeRoleDialog] = useState(false);
    const [upsertOpen, setUpsertOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<IUserResponse | null>(null);

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        try {
            setLoading(true);
            await getUserList().then((res) => {
                setUserList(res?.data)
            }).finally(() => setLoading(false))

        } catch {

        }
    }

    const changeUserActivityStatus = async (item: IUserResponse) => {
        await changeUserActivity(item.id).then(() => {
            getUsers();
        });
    }

    const handleChangeRole = (item: IUserResponse) => {
        setShowChangeRoleDialog(true)
        setSelectedUser(item);
    }

    const handleRefreshPassword = async (item: IUserResponse) => {
        if (confirm('آیا از بازنشانی رمز عبور مطمئن هستید ؟')) {
            await resetUserPassword(item.id)
                .then(() => {
                    toast.success('رمز عبور با موفقیت بازنشانی شد');
                });
        }
    }

    const columns: GridColDef<IUserResponse>[] = [
        {
            field: 'fullName',
            headerName: 'نام کاربر',
            width: 200
        },
        {
            field: 'nationalCode',
            headerName: 'نام کاربری',
            width: 120
        },
        {
            field: 'phoneNumber',
            headerName: 'شماره تلفن',
            width: 120
        },
        {
            field: 'isActive',
            headerName: 'وضعیت',
            width: 100,
            renderCell: (params) => (
                <Switch
                    checked={params.row.isActive}
                    color="primary"
                    onChange={(e) => changeUserActivityStatus(params.row)}
                />
            ),
        },
        {
            field: 'roleNames',
            headerName: 'تقش ها',
            width: 150
        },
        {
            field: 'officeBranchName',
            headerName: 'شعبه',
            width: 150
        },
        {
            field: 'action',
            type: 'actions',
            flex: 1.5,
            getActions: (params: GridRowParams<IUserResponse>) => [
                <GridActionsCellItem
                    icon={<Tooltip title="ویرایش"><Edit color='action' /></Tooltip>}
                    label="ویرایش"
                    onClick={() => {
                        setSelectedUser(params.row);
                        setUpsertOpen(true);
                    }}
                />,
                <GridActionsCellItem
                    icon={<Tooltip title="نقش ها"><AccountCircle color='action' /></Tooltip>}
                    label="نقش ها"
                    onClick={() => handleChangeRole(params.row)}
                />,
                <GridActionsCellItem
                    icon={<Tooltip title="بازنشانی رمز عبور"><Sync color='action' /></Tooltip>}
                    label="بازنشانی رمز عبور"
                    onClick={() => handleRefreshPassword(params.row)}
                />,
            ],
        }

    ]



    return (
        <>
            {showChangeRoleDialog &&
                <ChangeUserRoleDialog
                    open={showChangeRoleDialog}
                    onClose={() => {
                        setShowChangeRoleDialog(false);
                        getUsers();
                    }}
                    user={selectedUser}
                />
            }

            {upsertOpen &&
                <UpsertUserDialog
                    open={upsertOpen}
                    onClose={() => {
                        setUpsertOpen(false);
                        getUsers();
                    }}
                    user={selectedUser}
                />
            }

            <MyDataGrid
                rows={userList}
                columns={columns}
                getRowId={(e) => e.id}
                initialPageSize={10}
                loading={loading}
            />
        </>
    )
}
