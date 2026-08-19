import {
    Box,
    Divider,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import React from 'react'
import Logo from '../../../assets/images/Logo.png'
import { brand } from '@/theme/themePrimitives';
import { toPersianDate } from '@/utils/convertion';
import { PolicyInstallmentPrintData } from '@/types/Insurance';
import { digitSeprator } from '@/utils/text';
import { Check, Close } from '@mui/icons-material';

interface PrintableInstallmentProps {
    data: PolicyInstallmentPrintData | null
}
const PrintableInstallment = React.forwardRef(({ data }: PrintableInstallmentProps, ref) => {

    const time = (new Date()).toLocaleString('fa-IR', {
        hour: 'numeric',
        minute: 'numeric',
    });

    return (
        <Box ref={ref}>

            {/**Header */}
            <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} sx={{ pt: 4 }}>
                <Stack>
                    <img
                        src={Logo}
                        alt='no-image'
                        width={120}
                    />
                </Stack>
                <Stack sx={{ textAlign: 'center' }}>
                    <Typography variant='subtitle1'>شرکت کارگزاری رسمی بیمه مستقیم بر خط</Typography>
                    <Typography variant='subtitle2'>ممتاز اندیشان آتیه گستر</Typography>
                    <Typography mt={1} color='textSecondary'>اقساط مشتری</Typography>
                </Stack>
                <Stack>{time} - {toPersianDate(new Date())}</Stack>
            </Stack>
            <Divider sx={{ mt: 1, mb: 1 }} />

            {/**Customer data */}
            <Stack flexDirection={'row'} justifyContent={'space-between'}>
                <Stack flexDirection={'column'} gap={1} mb={1}>
                    <Stack flexDirection={'row'} alignItems={'center'} gap={1}>
                        <Typography> شماره بیمه نامه: </Typography>
                        <Typography>{data?.insuranceNo}</Typography>
                    </Stack>
                    <Stack flexDirection={'row'} alignItems={'center'} gap={1}>
                        <Typography> بیمه نامه:</Typography>
                        <Typography>{data?.category}</Typography>
                    </Stack>
                    <Stack flexDirection={'row'} alignItems={'center'} gap={1}>
                        <Typography> جمع کل حق بیمه:</Typography>
                        <Typography>{digitSeprator(data?.totalAmount ?? 0)} {'ریال'}</Typography>
                    </Stack>
                </Stack>
                <Stack flexDirection={'column'} gap={1} mb={1}>
                    <Stack flexDirection={'row'} alignItems={'center'} gap={1}>
                        <Typography>بیمه گذار: </Typography>
                        <Typography>{data?.customerName}</Typography>
                    </Stack>
                    <Stack flexDirection={'row'} alignItems={'center'} gap={1}>
                        <Typography>کد ملی: </Typography>
                        <Typography>{data?.customerNationalCode}</Typography>
                    </Stack>
                    <Stack flexDirection={'row'} alignItems={'center'} gap={1}>
                        <Typography>جمع کل وصول شده: </Typography>
                        <Typography>{digitSeprator(data?.totalPaid ?? 0)} {'ریال'}</Typography>
                    </Stack>
                    <Stack flexDirection={'row'} alignItems={'center'} gap={1}>
                        <Typography>جمع کل مانده: </Typography>
                        <Typography>{digitSeprator(data?.totalRemind ?? 0)} {'ریال'}</Typography>
                    </Stack>
                </Stack>
            </Stack>

            {/**table installment */}
            <TableContainer sx={{ mt: 2 }}>
                <Table size='small'>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: brand[700] }} >
                            <TableCell align='center' sx={{ color: 'white', fontSize: 12, whiteSpace: 'nowrap' }}>ردیف</TableCell>
                            <TableCell align='center' sx={{ color: 'white', fontSize: 12, whiteSpace: 'nowrap' }}>تاريخ سررسيد</TableCell>
                            <TableCell align='center' sx={{ color: 'white', fontSize: 12, whiteSpace: 'nowrap' }}>مبلغ سررسید</TableCell>
                            <TableCell align='center' sx={{ color: 'white', fontSize: 12, whiteSpace: 'nowrap' }}>نوع سررسيد</TableCell>
                            <TableCell align='center' sx={{ color: 'white', fontSize: 12, whiteSpace: 'nowrap' }}>تاریخ وصول</TableCell>
                            <TableCell align='center' sx={{ color: 'white', fontSize: 12, whiteSpace: 'nowrap' }}>روش تسویه</TableCell>
                            <TableCell align='center' sx={{ color: 'white', fontSize: 12, whiteSpace: 'nowrap' }}>کد پیگیری</TableCell>
                            <TableCell align='center' sx={{ color: 'white', fontSize: 12, whiteSpace: 'nowrap' }}>روز تاخیر</TableCell>
                            <TableCell align='center' sx={{ color: 'white', fontSize: 12, whiteSpace: 'nowrap' }}>وضعیت وصول</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.policyInstallment.items?.map((row, index) => (
                            <TableRow key={index}
                                sx={{
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#ffffff',
                                }}>
                                <TableCell align='center' sx={{ fontSize: 12 }}>{index + 1}</TableCell>
                                <TableCell align='center' sx={{ fontSize: 12 }}>{row.dueDate}</TableCell>
                                <TableCell align='center' sx={{ fontSize: 12 }}>{digitSeprator(row.dueAmount) + ' '}<span style={{ fontSize: '10px', color: 'gray' }}>{'ریال'}</span></TableCell>
                                <TableCell align='center' sx={{ fontSize: 12 }}>
                                    <Typography sx={{ color: row.dueAmount > 0 ? 'green' : 'red', fontSize: 12 }}>
                                        {row.isPrePayment ? 'پیش پرداخت' : row.dueAmount > 0 ? 'قسط شماره' + ' ' + row.installmentNumber : 'بستانکار'}
                                    </Typography>
                                </TableCell>
                                <TableCell align='center' sx={{ fontSize: 12 }}>{row.paymentDate}</TableCell>
                                <TableCell align='center' sx={{ fontSize: 12 }}>{row.depositMethodTypeTitle}</TableCell>
                                <TableCell align='center' sx={{ fontSize: 12 }}>{row.parentTransactionId}</TableCell>
                                <TableCell align='center' sx={{ fontSize: 12 }}>{row.numberOfDayLate}</TableCell>
                                <TableCell align='center' sx={{ fontSize: 12 }}>{GeneratePayStatus(row.isPaid)}</TableCell>
                            </TableRow>

                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/**footer */}
            <Stack sx={{ pb: 4 }}
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0
                }}>
                <Stack textAlign={'center'}>
                    <Typography mb={1}>خواهشمندیم حق بیمه اقساط خود را در تاریخ سررسید از طریق یکی از شماره حساب های زیر واریز و رسید آن را به شماره تماس 09205510750 در شبکه اجتماعی ایتا ارسال نمایید.</Typography>
                    <Typography>شماره حساب: 1460507955</Typography>
                    <Typography>شماره کارت: 6104337602969063</Typography>
                    <Typography>شماره شبا: 590120000000001460507955</Typography>
                    <Typography>به نام: آقای علیرضا دلدارمزارکی</Typography>
                </Stack>
            </Stack>

        </Box>
    )
});



const GeneratePayStatus = (isPaid: boolean) => {
    return (
        isPaid ? <Check color='success' fontSize='small'/> : <Close color='error' fontSize='small'/>
    )
}

export default PrintableInstallment