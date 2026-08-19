import { GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import { Box, Button, Chip, CircularProgress, Stack, Switch, Tooltip } from '@mui/material';
import { Add } from '@mui/icons-material';
import { IAttachmentTypeResponse } from '../../types/Attachment';
import MyDataGrid from '../../components/common/dataGrid/MyDataGrid';
import AttachmentTypeDialog from './AttachmentTypeDialog';
import { useAttachmentStore } from '../../stores/attachmentStore';
import EditIcon from '@mui/icons-material/Edit';

export default function Attachment() {

    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const { dataTypeList, getTypeList, status, toggleStatus } = useAttachmentStore();
    const [row, setRow] = useState<IAttachmentTypeResponse | null>(null);

    const handleToggleStatus = async (row: IAttachmentTypeResponse) => {
        toggleStatus(row.id);
    };

    const handleEdit = (row: IAttachmentTypeResponse) => {
        setRow(row);
        setOpenDialog(true);
    }

    const handleOpen = () => {
        setRow(null);
        setOpenDialog(true);
    }

    useEffect(() => {
        if (status === 'idle') {
            getTypeList();
        }
    }, [])

    const columns: GridColDef<IAttachmentTypeResponse>[] = [
        {
            field: 'name',
            headerName: 'Name',
            flex: 1.5,
        },
        {
            field: 'description',
            headerName: 'Description',
            flex: 1.5,
        },
        {
            field: 'applicableEntity',
            headerName: 'Applicable Entity',
            width: 150
        },
        {
            field: 'allowedExtensions',
            headerName: 'Allowed Extensions',
            flex: 1.5,
            renderCell: (params) => {
                const extensions = Array.isArray(params.value)
                    ? params.value
                    : params.value?.split(/[, ]+/) || [];
                return (
                    <Stack direction="row" spacing={1} sx={{ marginTop: 1 }}>
                        {extensions.map((ext: string, index: number) => (
                            <Chip
                                key={index}
                                label={ext.trim()}
                                size="small"
                                sx={{
                                    fontSize: '0.75rem',
                                    direction: 'rtl',
                                }}
                            />
                        ))}
                    </Stack>
                );
            }
        },
        {
            field: 'isActive',
            headerName: 'وضعیت',
            width: 80,
            renderCell: (params) => {
                const isUpdating = status === 'loading' &&
                    dataTypeList?.some(item => item.id === params.row.id && item.isActive !== params.row.isActive);
                return (
                    <Tooltip title={params.row.isActive ? "غیرفعال کردن" : "فعال کردن"}>
                        <Box position="relative" display="inline-flex">
                            <Switch
                                checked={params.row.isActive}
                                onChange={(e) => handleToggleStatus(params.row)}
                                color={params.row.isActive ? "success" : "default"}
                                disabled={isUpdating}
                            />
                            {isUpdating && (
                                <CircularProgress
                                    size={24}
                                    sx={{
                                        position: 'absolute',
                                        top: -4,
                                        left: -4,
                                        color: params.row.isActive ? 'success.main' : 'default'
                                    }}
                                />
                            )}
                        </Box>
                    </Tooltip>
                );
            }
        },
        {
            field: 'action',
            type: 'actions',
            getActions: (params: GridRowParams<IAttachmentTypeResponse>) => [
                <GridActionsCellItem
                    icon={<Tooltip title="ویرایش"><EditIcon color='primary' /></Tooltip>}
                    label="ویرایش"
                    onClick={() => handleEdit(params.row)}
                />,
            ],
        }
    ]

    return (
        <>
            <Button
                onClick={handleOpen}
                variant='contained'
                endIcon={<Add />}
                sx={{
                    maxWidth: '150px'
                }}
            >
                ثبت نوع جدید
            </Button>

            <AttachmentTypeDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                record={row}
            />

            <MyDataGrid
                filterMode='client'
                loading={status === 'loading' && true}
                columns={columns}
                rows={dataTypeList ?? []}
                getRowId={(row) => row.id}

            />

        </>
    )
}
