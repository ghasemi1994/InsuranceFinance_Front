import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Typography } from '@mui/material';
import { useReportStore } from '../../stores/reportStore';

export default function PersianInstallmentChart() {
    const { overviewData, status } = useReportStore();

    const showChart = (overviewData?.customerInstallmentItem?.totalItemCount ?? 0 > 0)
        || (overviewData?.insuranceInstallmentItem?.totalItemCount ?? 0 > 0)

    return (
        <Box sx={{
            width: '100%',
            direction: 'rtl',
            p: 2,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            display: showChart ? 'block' : 'none'
        }}>
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                نمودار وضعیت اقساط
            </Typography>

            <BarChart
                loading={status === 'loading' ? true : false}
                height={400}
                borderRadius={10}
                series={[
                    {
                        data: [
                            overviewData?.customerInstallmentItem.totalItemCount ?? 0,
                            overviewData?.insuranceInstallmentItem.totalItemCount ?? 0
                        ], // کل اقساط
                        label: 'کل اقساط',
                        id: 'total',
                    },
                    {
                        data: [
                            overviewData?.customerInstallmentItem.totalItemExpired ?? 0,
                            overviewData?.insuranceInstallmentItem.totalItemExpired ?? 0
                        ], // معوق شده
                        label: 'معوق شده',
                        id: 'expired'
                    },
                    {
                        data: [
                            overviewData?.customerInstallmentItem.totalItemPaid ?? 0,
                            overviewData?.insuranceInstallmentItem.totalItemPaid ?? 0
                        ], // پرداخت شده
                        label: 'پرداخت شده',
                        id: 'paid'
                    },
                    {
                        data: [
                            overviewData?.customerInstallmentItem.totalItemUnPaid ?? 0,
                            overviewData?.insuranceInstallmentItem.totalItemUnPaid ?? 0
                        ], // پرداخت نشده
                        label: 'پرداخت نشده',
                        id: 'unpaid'
                    },
                ]}
                xAxis={[
                    {
                        data: ['وضعیت اقساط با مشتری', 'وضعیت اقساط با بیمه'], // فقط یک دسته بندی
                        scaleType: 'band'
                    }
                ]}
                margin={{ left: 80, right: 40, top: 40, bottom: 60 }}
                colors={[
                    '#3f51b5', // آبی
                    '#d32f2f', // قرمز
                    '#2e7d32', // سبز
                    '#ef6c00'  // نارنجی
                ]}
                slotProps={{
                    legend: {
                        direction: 'row',
                        position: { vertical: 'top', horizontal: 'middle' },
                        padding: 0,
                        hidden: true
                    },

                }}
            />
        </Box>
    );
}