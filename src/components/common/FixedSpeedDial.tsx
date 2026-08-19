import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { Calculate, Wallet } from '@mui/icons-material';
import { useState } from 'react';
import DepositWalletDialog from './wallet/DepositWalletDialog';
import { useNavigate } from 'react-router-dom';
import InstallmentCalculationDialog from './tools/InstallmentCalculationDialog';

enum Keys {
    WALLET = 'WALLET',
    POLICY_LIST = 'POLICY_LIST',
    INSERT_POLICY = 'INSERT_POLICY',
    INSTALLMENT_CALCULATION = 'INSTALLMENT_CALCULATION'
}

const actions = [
    { icon: <Wallet color='success' />, name: 'کیف پول', key: Keys.WALLET },
    // { icon: <SaveIcon color='primary' />, name: 'ثبت بیمه نامه', key: Keys.INSERT_POLICY },
    // { icon: <LibraryBooksIcon color='primary' />, name: 'لیست بیمه نامه', key: Keys.POLICY_LIST },
    { icon: <Calculate color='error' />, name: 'محاسبه گر قسط', key: Keys.INSTALLMENT_CALCULATION },

];

export default function FixedSpeedDial() {

    const [openWallet, setOpenWallet] = useState(false);
    const navigate = useNavigate();
    const [openDialog, setopenDialog] = useState(false);

    const handleClick = (key: Keys) => {
        if (key === Keys.WALLET) {
            setOpenWallet(true);
        }
        if (key === Keys.POLICY_LIST) {
            navigate('/insurance-policy');
        }
        if (key === Keys.INSERT_POLICY) {
            navigate('/insurance-policy/create');
        }
        if (key === Keys.INSTALLMENT_CALCULATION) {
            setopenDialog(true);
        }
    }

    return (
        <>
            <DepositWalletDialog
                open={openWallet}
                onClose={() => setOpenWallet(false)}
            />
            <InstallmentCalculationDialog
                openDialog={openDialog}
                onCloseDialog={() => setopenDialog(false)}
            />
            <Box>
                <SpeedDial
                    ariaLabel="SpeedDial fixed example"
                    sx={{
                        position: 'fixed', // ثابت میشه
                        bottom: 16,
                        right: 16,
                        zIndex: 1300 // روی همه عناصر
                    }}
                    icon={<SpeedDialIcon />}
                >
                    {actions.map((action) => (
                        <SpeedDialAction
                            key={action.name}
                            icon={action.icon}
                            tooltipTitle={action.name} // نسخه جدید MUI به این شکل ساپورت میکنه
                            onClick={() => handleClick(action.key)}
                        />
                    ))}
                </SpeedDial>
            </Box>
        </>
    );
}
