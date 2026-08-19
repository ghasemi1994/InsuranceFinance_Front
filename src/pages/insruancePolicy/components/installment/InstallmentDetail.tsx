import {
    Button,
    Card, FormControl,
    FormControlLabel,
    FormLabel, Grid2,
    Paper,
    Radio, RadioGroup,
    Stack, TextField
} from '@mui/material'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import React, { useEffect, useState } from 'react'
import { InstallmentSideType, IPolicyInstallmentResponse, PrePaymentType } from '../../../../types/Insurance';
import { getPolicyInstallment } from '../../../../server/services/insuranceService';
import { NumericFormat } from 'react-number-format';
import MyDatePicker from '../../../../components/common/datePicker/MyDatePicker';
import { useSearchParams } from 'react-router-dom';
import InstallmentList from './InstallmentList';

export default function InstallmentDetail() {

    const [searchParams] = useSearchParams();
    const id = Number(searchParams.get('id'));
    const [value, setValue] = React.useState(0);
    const [customerInstallmentSide, setCustomerInstallmentSide] = useState<IPolicyInstallmentResponse | null>(null);
    const [insuranceInstallmentSide, setInsuranceInstallmentSide] = useState<IPolicyInstallmentResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setValue(0);
        getInstallment(InstallmentSideType.Customer);
    }, [id])

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
        if (newValue === 0)
            getInstallment(InstallmentSideType.Customer);
        else if (newValue === 1)
            getInstallment(InstallmentSideType.Insurance);
    };

    const getInstallment = async (sideType: InstallmentSideType) => {
        try {
            if (id) {
                setLoading(true);
                await getPolicyInstallment(id, sideType, null).then((res) => {
                    if (sideType === InstallmentSideType.Customer) {
                        setCustomerInstallmentSide(res?.data);
                    }
                    else if (sideType === InstallmentSideType.Insurance) {
                        setInsuranceInstallmentSide(res?.data);
                    }
                    setLoading(false);
                })
            }
        }
        catch { setLoading(false); }
    }

    return (
        <>
            <Box sx={{ width: '100%', padding: 2 }} component={Paper}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="اقساط مشتری" {...a11yProps(0)} />
                        <Tab label="اقساط بیمه" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    {
                        loading ? '...Loading' :
                            <>
                                {
                                    !customerInstallmentSide ? 'اطلاعاتی برای نمایش وجود ندارد' :
                                        <>
                                            {/* <InstallmentValueComponent item={customerInstallmentSide} /> */}
                                            <InstallmentList items={customerInstallmentSide?.items ?? []} />
                                        </>
                                }

                            </>
                    }
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    {
                        loading ? '...Loading' :
                            <>
                                {
                                    !insuranceInstallmentSide ? 'اطلاعاتی برای نمایش وجود ندارد' :
                                        <>
                                            {/* <InstallmentValueComponent item={insuranceInstallmentSide} /> */}
                                            <InstallmentList items={insuranceInstallmentSide?.items ?? []} />
                                        </>
                                }
                            </>
                    }
                </CustomTabPanel>
            </Box>
        </>
    )
}





function InstallmentValueComponent({ item }: { item: IPolicyInstallmentResponse | null }) {
    return (
        <>
            <Card sx={{ width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                <Grid2 container spacing={2} width={'100%'}>
                    <Grid2 size={{ xl: 4, lg: 6, md: 6, sm: 6, xs: 12 }}>
                        <FormControl fullWidth>
                            <FormLabel>پیش پرداخت و مقدار (ریال یا درصد)</FormLabel>
                            <Stack flexDirection={'row'}>
                                <RadioGroup
                                    row
                                    name="PrePaymentType"
                                    value={item?.prePaymentTypeId}
                                >
                                    <FormControlLabel
                                        value={PrePaymentType.Amount}
                                        control={<Radio />}
                                        label="مبلغ" />
                                    <FormControlLabel
                                        value={PrePaymentType.Percentage}
                                        control={<Radio />}
                                        label="درصد" />
                                </RadioGroup>
                                <NumericFormat
                                    customInput={TextField}
                                    thousandSeparator
                                    valueIsNumericString
                                    prefix=""
                                    variant="outlined"
                                    dir='ltr'
                                    value={item?.prePaymentValue}
                                />
                            </Stack>
                        </FormControl>
                    </Grid2>

                    <Grid2 size={{ xl: 3, lg: 4, md: 6, sm: 6, xs: 12 }}>
                        <FormControl fullWidth>
                            <FormLabel>شروع (پيش پرداخت)</FormLabel>
                            <MyDatePicker
                                value={item?.prePaymentStartDate}
                            />
                        </FormControl>
                    </Grid2>
                </Grid2>
                <Grid2 container spacing={2} width={'100%'}>
                    <Grid2 size={{ xl: 2, lg: 2, md: 6, sm: 6, xs: 12 }}>
                        <FormControl fullWidth>
                            <FormLabel>تعداد قسط</FormLabel>
                            <TextField
                                dir='ltr'
                                type='number'
                                value={item?.installmentCount}
                            />
                        </FormControl>
                    </Grid2>

                    <Grid2 size={{ xl: 2, lg: 4, md: 6, sm: 6, xs: 12 }}>
                        <FormControl fullWidth>
                            <FormLabel>فاصله بین اقساط (ماه)</FormLabel>
                            <TextField
                                dir='ltr'
                                type='number'
                                value={item?.intervalBetweenInstalment}
                            />
                        </FormControl>
                    </Grid2>

                    <Grid2 size={{ xl: 3, lg: 4, md: 6, sm: 6, xs: 12 }}>
                        <FormControl fullWidth>
                            <FormLabel>تاریخ شروع (قسط)</FormLabel>
                            <MyDatePicker
                                value={item?.installmentStartDate}
                            />
                        </FormControl>
                    </Grid2>
                </Grid2>
            </Card>
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

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
