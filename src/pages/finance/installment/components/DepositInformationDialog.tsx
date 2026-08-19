import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Fab, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { IFinanceItem, InstallmentSideType } from '../../../../types/Insurance';
import { GridActionsCellItem, GridColDef, GridRenderCellParams, GridRowParams } from '@mui/x-data-grid';
import MyDataGrid from '../../../../components/common/dataGrid/MyDataGrid';
import { IPolicyPaymentResponse } from '../../../../types/Payment';
import { deleteByPaymentId, getPolicyPayment } from '../../../../server/services/paymentService';
import { digitSeprator } from '../../../../utils/text';
import { Delete, Download } from '@mui/icons-material';
import { useInstallmentStore } from '../../../../stores/installmentStore';
import toast from 'react-hot-toast';

interface IProps {
    open: boolean
    onClose: (open: boolean) => void,
    row: IFinanceItem | null,
    sideType: InstallmentSideType
}

export default function DepositInformationDialog({ onClose, open, row, sideType }: IProps) {

    const [data, setData] = useState<IPolicyPaymentResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { getFinanceItemList } = useInstallmentStore();

    useEffect(() => {
        if (open && row) {
            getData();
        }
    }, [open])

    const getData = async () => {
        try {
            if (row?.sideType) {
                setLoading(true);
                await getPolicyPayment(row?.sideType,
                    row?.policyPaymentGroupType,
                    row?.insurancePolicyId,
                    row?.installmentItemId,
                    row?.addendumId)
                    .then((res) => {
                        setData(res?.data ? [res.data] : []);
                        setLoading(false);
                    });
            }
        } catch {
            setLoading(false);
        }

    }


    const handleClose = () => {
        onClose(false);
    };


    const handleDeletePayment = async (row: IPolicyPaymentResponse) => {
        if (window.confirm('آیا از حذف پرداختی مطمئن هستيد؟')) {
            try {
                setLoading(true);
                await deleteByPaymentId(row.id)
                    .then(() => {
                        setLoading(false);
                        getFinanceItemList();
                        handleClose();
                        toast.success('اطلاعات پرداخت با موفقیت حذف شد');
                    });
            } catch { setLoading(false); }
        }
    }

    const columns: GridColDef[] = [
        {
            field: 'totalAmount',
            headerName: 'مبلغ سررسید',
            width: 120,
            filterable: false,
            sortable: false,
            renderCell: (params: GridRenderCellParams<IPolicyPaymentResponse>) => digitSeprator(params.value)
        },
        {
            field: 'discount',
            headerName: 'تخفیف',
            width: 120,
            filterable: false,
            sortable: false,
            renderCell: (params: GridRenderCellParams<IPolicyPaymentResponse>) => digitSeprator(params.value)
        },
        {
            field: 'amount',
            headerName: 'مبلغ پرداخت شده',
            width: 120,
            filterable: false,
            sortable: false,
            renderCell: (params: GridRenderCellParams<IPolicyPaymentResponse>) => digitSeprator(params.value)
        },
        {
            field: 'paymentDate',
            headerName: 'تاریخ پرداخت',
            width: 150,
            filterable: false,
            sortable: false
        },
        {
            field: 'depositMethodTypeTitle',
            headerName: 'نوع واریز',
            width: 100,
            filterable: false,
            sortable: false
        },
        {
            field: 'description',
            headerName: 'توضیحات',
            flex: 1.5,
            filterable: false,
            sortable: false,
            renderCell: (params: GridRenderCellParams<IPolicyPaymentResponse>) => (
                <Tooltip title={params.value}>
                    <span>
                        {params.value}
                    </span>
                </Tooltip >
            ),
        },
        {
            field: 'attachments',
            headerName: 'پیوست‌ها',

            filterable: false,
            sortable: false,
            renderCell: (params: GridRenderCellParams<IPolicyPaymentResponse>) => (
                <Stack direction="row" spacing={1}>
                    {params.row?.attachments?.map((item, index) => {
                        const fileUrl = `data:${item.fileContentType};base64,${item.fileContent}`;
                        return (
                            <Tooltip key={index} title={`دانلود ${item.attachmentTypeName} ${index + 1}`}>
                                <Box
                                    sx={{
                                        '&:hover': {
                                            color: 'primary',
                                            cursor: 'pointer'
                                        },
                                    }}
                                    onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = fileUrl;
                                        link.download = `${item.attachmentTypeName}.${item.fileContentType.split('/')[1]}`;
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                    }}
                                >
                                    <Download
                                        color='primary'
                                    />
                                </Box>
                            </Tooltip>
                        );
                    })}
                </Stack>
            ),
        },
        {
            field: 'action',
            type: 'actions',
            flex: 1.5,
            getActions: (params: GridRowParams<IPolicyPaymentResponse>) => [
                <GridActionsCellItem
                    icon={<Tooltip title="حذف"><Delete color='error' /></Tooltip>}
                    label="حذف"
                    onClick={() => handleDeletePayment(params.row)}
                />
            ],
        }
    ]

    return (
        <>

            <Dialog
                maxWidth='md'
                open={open}
                keepMounted
                onClose={handleClose}
                fullWidth
            >
                <DialogTitle flexDirection={'row'} alignItems={'center'} display={'flex'} gap={2}>
                    اطلاعات واریز
                    {' '}
                    ({row?.dueTitle})
                    {' '}
                    {row?.customerName} | {row?.category}
                </DialogTitle>
                <DialogContent>
                    <Box height={200} width={'100%'}>
                        <MyDataGrid
                            rowHeight={70}
                            loading={loading}
                            columns={columns}
                            rows={data ?? []}
                            getRowId={(row) => row.id}
                            pagination={false}
                            sx={{
                                '& .MuiDataGrid-row': {
                                    backgroundColor: 'rgb(144,238,144)',
                                    '&:hover': {
                                        backgroundColor: 'rgb(144,238,144,0.8)',
                                    }
                                }
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button size='small' onClick={handleClose}>بستن</Button>
                </DialogActions>
            </Dialog >
        </>
    )
}
