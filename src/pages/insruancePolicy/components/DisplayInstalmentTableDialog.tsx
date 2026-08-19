import {
    Button,
    Card,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, Skeleton, Stack, Table,
    TableBody,
    TableCell, TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react'
import { getInstallmentCalculated } from '../../../server/services/insuranceService';
import { IInstallmentCalculatedResponse, IInstallmentCalculationRequest } from '../../../types/Insurance';
import Paper from '@mui/material/Paper';
import toast from 'react-hot-toast';
import { digitSeprator } from '../../../utils/text';
import { brand } from '../../../theme/themePrimitives';

interface IProps {
    open: boolean
    onClose: (open: boolean) => void,
    calculationData: IInstallmentCalculationRequest,
    title?: string
}
export default function DisplayInstalmentTableDialog(props: IProps) {

    const { open, onClose, calculationData, title } = props;
    const [openDialog, setOpenDialog] = React.useState(open);
    const [data, setData] = useState<IInstallmentCalculatedResponse>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            if (!calculationData?.totalAmount ||
                !calculationData?.installmentCount ||
                !calculationData?.installmentStartDate ||
                !calculationData?.prePaymentStartDate ||
                !calculationData?.prePaymentType
            ) {
                handleClose();
                toast.error("برای مشاهده جدول قسط لطفا اطلاعات را تکمیل کنید");
            } else {
                setOpenDialog(true);
                getDueDates();
            }
        }
    }, [open])


    const getDueDates = async () => {
        try {
            setLoading(true);
            await getInstallmentCalculated(calculationData).then((response) => {
                setData(response?.data);
                setLoading(false);
            });
        } catch {
            handleClose();
            setLoading(false);
        }
    }

    const handleClose = () => {
        onClose(false);
        setOpenDialog(false);
    }

    return (
        <Dialog
            maxWidth='sm'
            fullWidth
            open={openDialog}
            keepMounted
            onClose={handleClose}
        >
            <DialogTitle>{title || 'جزئیات اقساط'}</DialogTitle>
            <DialogContent sx={{ paddingBottom: 0 }}>

                {loading ?
                    <>
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                    </>
                    :
                    <>
                        <Card sx={{ marginBottom: 1 }}>
                            <Stack flexDirection={'row'} justifyContent={'space-between'}>
                                <Typography>
                                    تعداد آیتم ها:
                                    {' '}
                                    {data?.items.length}
                                </Typography>
                                <Typography>
                                    درصد پیش پرداخت:
                                    {' '}
                                    {data?.prePaymentValue}%
                                </Typography>
                            </Stack>
                        </Card>
                        <TableContainer component={Paper}>
                            <Table size='small'>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: brand[700] }}>
                                        <TableCell align='center' sx={{ color: 'white' }}>ردیف</TableCell>
                                        <TableCell align='center' sx={{ color: 'white' }}>تاريخ سررسيد</TableCell>
                                        <TableCell align='center' sx={{ color: 'white' }}>مبلغ سررسید</TableCell>
                                        <TableCell align='center' sx={{ color: 'white' }}>نوع سررسيد</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data?.items?.map((row, index) => (
                                        <TableRow key={index}
                                            sx={{
                                                '&:last-child td, &:last-child th': { border: 0 },
                                                backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#ffffff',
                                            }}>
                                            <TableCell align='center'>{index + 1}</TableCell>
                                            <TableCell align='center'>{row.dueDate}</TableCell>
                                            <TableCell align='center'>{digitSeprator(row.dueAmount) + ' '}<span style={{ fontSize: '10px', color: 'gray' }}>{'ریال'}</span></TableCell>
                                            <TableCell align='center'>
                                                <Typography sx={{ color: row.dueAmount > 0 ? 'green' : 'red' }}>
                                                    {row.isPrePayment ? 'پیش پرداخت' : row.dueAmount > 0 ? 'قسط شماره' + ' ' + row.installmentNumber : 'بستانکار'}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                }
            </DialogContent>
            <DialogActions>
                <Button size='small' onClick={handleClose} >بستن</Button>
            </DialogActions>
        </Dialog>

    )
}
