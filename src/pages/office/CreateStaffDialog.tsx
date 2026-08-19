import MyDataGrid from '@/components/common/dataGrid/MyDataGrid';
import UserAutoComplete from '@/components/common/dropDown/UserAutoComplete';
import { createBranchStaff, deleteBranchStaff, getBranchStaffList } from '@/server/services/officeService';
import { BranchResponse, BranchStaffResponse, CreateBranchStaffRequest } from '@/types/OfficeTypes';
import { Delete } from '@mui/icons-material';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    FormLabel,
    Grid2,
    Tooltip
} from '@mui/material'
import { GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';



interface IProps {
    open: boolean
    onClose: (open: boolean) => void,
    currentBranch: BranchResponse | null
}
export default function CreateStaffDialog({ onClose, open, currentBranch }: IProps) {

    const [dataList, setDataList] = useState<BranchStaffResponse[]>([]);

    const { control, handleSubmit, formState: { isSubmitting } } = useForm<CreateBranchStaffRequest>({
        defaultValues: {
            officeBranchId: null,
            userId: null
        }
    });

    const onSubmit = async (data: CreateBranchStaffRequest) => {
        if (currentBranch)
            data.officeBranchId = currentBranch?.id;
        await createBranchStaff(data)
            .then(() => {
                toast.success('اطلاعات با موفقیت ذخیره شد');
                onClose(true);
                getDataList();
            });
    }

    useEffect(() => {
        if (open)
            getDataList();
    }, [open]);

    const getDataList = async () => {
        if (currentBranch)
            await getBranchStaffList(currentBranch?.id)
                .then((response) => {
                    setDataList(response?.data ?? []);
                });
    }

    const columns: GridColDef<BranchStaffResponse>[] = [
        {
            field: 'fullName',
            headerName: 'کارشناس فروش',
            flex: 1.5
        },
        {
            field: 'phoneNumber',
            headerName: 'موبایل',
            flex: 1.5
        },
        {
            field: 'action',
            type: 'actions',
            getActions: (params: GridRowParams<BranchStaffResponse>) => [
                <GridActionsCellItem
                    icon={<Tooltip title="حذف"><Delete color='error' /></Tooltip>}
                    label="حذف"
                    onClick={() => handleDelete(params.row)}
                />,
            ],
        }
    ]

    const handleDelete = async (item: BranchStaffResponse) => {
        await deleteBranchStaff(item.id)
            .then(() => {
                toast.success('کارشناس حذف شد');
                getDataList();
            });
    }

    return (
        <>
            <Dialog
                onSubmit={handleSubmit(onSubmit)}
                component={'form'}
                maxWidth='sm'
                fullWidth
                open={open}
                keepMounted
                onClose={onClose}
            >
                <Divider>
                    <DialogTitle >{"کارشناسان فروش"} ({currentBranch?.name})</DialogTitle>
                </Divider>
                <DialogContent>
                    <Grid2 container spacing={2}>
                        <Grid2 size={{ xl: 6, lg: 6, md: 4, sm: 6, xs: 12 }}>
                            <FormControl fullWidth>
                                <FormLabel>کارشناسان فروش</FormLabel>
                                <Controller
                                    control={control}
                                    name='userId'
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
                        <Divider />
                        <Grid2 size={12}>
                            <MyDataGrid
                                columns={columns}
                                rows={dataList ?? []}
                                getRowId={(row) => row.id}
                                pagination={false}
                            />
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
