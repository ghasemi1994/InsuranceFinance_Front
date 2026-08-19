import React, { useEffect, useState } from 'react'
import { getBalance } from '../../../server/services/walletService';
import { FormControl, InputAdornment, Stack, TextField, Tooltip } from '@mui/material';
import { digitSeprator } from '../../../utils/text';
import { WalletOutlined } from '@mui/icons-material';


interface IProps {
    personId: number | null
    refreshBalance?: boolean

}
export default function WalletBalance({ personId, refreshBalance }: IProps) {

    const [balanceValue, setBalanceValue] = useState<number>(0);

    useEffect(() => {
        getWalletBalance();
    }, [personId, refreshBalance])

    const getWalletBalance = async () => {
        try {
            if (personId) {
                await getBalance(personId).then((res) => {
                    const currentBalance = res?.data;
                    setBalanceValue(currentBalance);
                });
            } else {
                setBalanceValue(0);
            }
        } catch { setBalanceValue(-1) }
    };
    return (
        <Stack>
            <Tooltip title='موجودی کیف پول'>
                <FormControl fullWidth>
                    <TextField
                        variant="outlined"
                        value={digitSeprator(balanceValue)}
                        disabled
                        dir="ltr"
                        sx={{
                            '& .MuiOutlinedInput-root.Mui-disabled': {
                                '& fieldset': {
                                    borderColor: balanceValue > 0 ? '#4caf50' : '#f44336', // سبز/قرمز ماتریال
                                    borderWidth: '2px',
                                },
                            },
                            '& .MuiInputBase-input.Mui-disabled': {
                                WebkitTextFillColor: balanceValue > 0 ? '#4caf50' : '#f44336',
                                fontWeight: 'bold',
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <WalletOutlined
                                        sx={{
                                            color: balanceValue > 0 ? '#4caf50' : '#f44336',
                                            ml: 1,
                                        }}
                                    />
                                </InputAdornment>
                            ),
                            endAdornment: <InputAdornment position="end">ریال</InputAdornment>,
                        }}
                    />
                </FormControl>
            </Tooltip>
        </Stack>
    )
}
