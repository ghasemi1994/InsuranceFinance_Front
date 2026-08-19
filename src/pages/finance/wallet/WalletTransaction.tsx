import { Button, Card, Chip, FormControl, FormLabel, Grid2, Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import PeopleAutoComplete from '../../../components/common/dropDown/PeopleAutoComplete'
import { getTransactionByPersonId } from '../../../server/services/walletService'
import { WalletTransactionResponse, WalletTransactionType } from '../../../types/Wallet';
import MyDataGrid from '../../../components/common/dataGrid/MyDataGrid';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { digitSeprator, numberToPersianWords, truncateText } from '../../../utils/text';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Replay, Search } from '@mui/icons-material';

export default function WalletTransaction() {

    const [data, setData] = useState<WalletTransactionResponse[]>([]);
    const [currentPersonId, setCurrentPersonId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const handlePeopleChange = (id: number | null) => {
        setCurrentPersonId(id);
    }

    const handleSearchClick = () => {
        if (currentPersonId)
            getData(currentPersonId);
        else
            setData([]);
    }

    const getData = async (id: number) => {
        try {
            setLoading(true);
            await getTransactionByPersonId(id).then((res) => {
                setData(res?.data);
            });
        } catch { }
        finally { setLoading(false); }
    }


    const columns: GridColDef[] = [
        {
            field: 'transactionType',
            headerName: 'نوع تراکنش',
            width: 100,
            renderCell: (params: GridRenderCellParams<WalletTransactionResponse>) => {
                const isDeposit = params.row.transactionType === WalletTransactionType.Deposit;
                const isWithdraw = params.row.transactionType === WalletTransactionType.Withdraw;
                const isReturn = params.row.transactionType === WalletTransactionType.return;

                const color = (isDeposit || isReturn) ? 'success' : isWithdraw ? 'error' : 'secondary';
                const icon = isDeposit ? <ArrowUpwardIcon sx={{ color: 'inherit' }} />
                    : isWithdraw ?
                        <ArrowDownwardIcon sx={{ color: 'inherit' }} />
                        : isReturn ? <Replay /> : undefined;

                return (
                    <Tooltip title={params.row.transactionTypeTitle}>
                        <Chip
                            color={color}
                            label={params.row.transactionTypeTitle}
                            icon={icon}
                        />
                    </Tooltip>
                );
            },
        },
        {
            field: 'amount',
            headerName: 'مبلغ تراکنش',
            width: 110,
            renderCell: (params: GridRenderCellParams<WalletTransactionResponse>) => (
                <Tooltip title={numberToPersianWords(params.value, 'Rial')}>
                    <span>
                        {digitSeprator(params.value)}
                    </span>
                </Tooltip >
            ),
        },
        {
            field: 'createdDate',
            headerName: 'تاریخ تراکنش',
            width: 150,
            renderCell: (params: GridRenderCellParams<WalletTransactionResponse>) => {
                return <span dir='ltr'>{params.value}</span>
            }
        },
        {
            field: 'transactionStatusTitle',
            headerName: 'وضعیت تراکنش',
            width: 120,
        },
        {
            field: 'currentWalletBalance',
            headerName: 'موجودی کیف پول',
             width: 150,
            renderCell: (params: GridRenderCellParams<WalletTransactionResponse>) => {
                return (
                    <Tooltip title={numberToPersianWords(params.value, 'Rial')}>
                        <Chip
                            color={params.value < 0 ? 'error' : 'success'}
                            label={
                                <span dir='ltr'>{digitSeprator(params.value)}</span>
                            }
                        />
                    </Tooltip>
                );
            }
        },
        {
            field: 'comment',
            headerName: 'توضیحات',
            flex: 1.5,
            renderCell: (params: GridRenderCellParams<WalletTransactionResponse>) => {
                return <Tooltip title={params.value}>
                    {params.value}
                </Tooltip>
            }
        },
    ]

    return (
        <>
            <Card>
                <Grid2 container spacing={2} alignItems={'center'}>
                    <Grid2 size={{ lg: 4, xl: 3, md: 4, sm: 12, xs: 12 }}>
                        <FormControl fullWidth>
                            <FormLabel>اشخاص</FormLabel>
                            <PeopleAutoComplete
                                onChange={(id) => handlePeopleChange(id)}
                                value={currentPersonId}
                            />
                        </FormControl>
                    </Grid2>
                    <Grid2>
                        <Button
                            onClick={handleSearchClick}
                            variant="contained"
                            sx={{ mt: 3 }}
                            endIcon={<Search />}
                            loading={loading}
                        >
                            جستجو
                        </Button>
                    </Grid2>
                </Grid2>
            </Card>
            <MyDataGrid
                filterMode='client'
                columns={columns}
                rows={data}
                getRowId={(row) => row.id}
                initialPageSize={20}
                pagination={false}
                loading={loading}
            />
        </>
    )
}
