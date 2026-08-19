import { Box, Tab, Tabs, Tooltip } from '@mui/material';
import React from 'react'
import ReceiptTab from './components/ReceiptTab';
import PaymentTab from './components/PaymentTab';
import { Payment, Receipt } from '@mui/icons-material';


export default function InstallmentManagent() {

    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <Box sx={{ width: '100%', padding: 2 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary">
                        <Tooltip title='دریافت از مشتری'>
                            <Tab label="دریافت" icon={<Receipt />} iconPosition='start' />
                        </Tooltip>
                        <Tooltip title='پرداخت به بیمه'>
                            <Tab label="پرداخت" icon={<Payment />} iconPosition='start' />
                        </Tooltip>
                    </Tabs>
                </Box>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <ReceiptTab />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <PaymentTab />
            </CustomTabPanel>
        </>
    )
}


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}


