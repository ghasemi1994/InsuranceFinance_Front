import {
    Button,
    Card,
    FormControl,
    FormLabel,
    Grid2,
    Stack,
    TextField,
} from "@mui/material";
import React from "react";
import { NumericFormat } from "react-number-format";
import MyDatePicker from "../../../../components/common/datePicker/MyDatePicker";
import { InstallmentSideType } from "../../../../types/Insurance";
import { useInstallmentStore } from "../../../../stores/installmentStore";
import DueStatusAutoComplete from "../../../../components/common/dropDown/DueStatusAutoComplete";
import SettelmentStatusAutoComplete from "../../../../components/common/dropDown/SettlmentStatusAutoComplete";
import { ImportExport, Search } from "@mui/icons-material";
import DueTypeAutoComplete from "../../../../components/common/dropDown/DueTypeAutoComplete";
import PeopleAutoComplete from "@/components/common/dropDown/PeopleAutoComplete";
import MarketerAutoComplete from "@/components/common/dropDown/MarketerAutoComplete";
import toast from "react-hot-toast";
import { getFinanceItemExcelByte } from "@/server/services/reportService";
import { downloadByteArrayToFile } from "@/utils/export";

interface IProps {
    sideType: InstallmentSideType;
}

export default function Filter({ sideType }: IProps) {

    const { getFinanceItemList, financeItems, setFilter, filter } = useInstallmentStore();

    const handleExportExcelClick = async () => {
        const toastId = toast.loading('در حال آماده سازی فایل اکسل. منتظر بمانید ...')
        try {
            await getFinanceItemExcelByte(filter).then((response) => {
                if (!response?.data) {
                    toast.error('اطلاعات یافت نشد');
                } else {
                    downloadByteArrayToFile(response.data, 'excel_file.xlsx');
                }
                toast.dismiss(toastId)
            });
        } catch (error) {
            toast.dismiss(toastId)
        }

    }

    // وقتی اولین بار لود میشه sideType رو توی فیلتر ست کن
    React.useEffect(() => {
        setFilter({ sideType: sideType });
    }, [sideType, setFilter]);

    return (
        <>
            <Card>
                <Grid2 container spacing={2}>

                    <Grid2 size={{ xl: 3, lg: 3, md: 4, sm: 4, xs: 12 }}>
                        <FormControl fullWidth>
                            <FormLabel>بیمه گذار</FormLabel>
                            <PeopleAutoComplete
                                onChange={(e) => setFilter({ personId: e })}
                                value={filter.personId}
                            />
                        </FormControl>
                    </Grid2>

                    <Grid2 size={{ xl: 3, lg: 3, md: 4, sm: 4, xs: 12 }}>
                        <FormControl fullWidth>
                            <FormLabel>بازاریاب</FormLabel>
                            <MarketerAutoComplete
                                onChange={(e) => setFilter({ marketerId: e })}
                                value={filter.marketerId}
                            />
                        </FormControl>
                    </Grid2>

                    <Grid2 size={{ xl: 3, lg: 3, md: 4, sm: 4, xs: 12 }}>
                        <FormControl fullWidth>
                            <FormLabel>تاریخ شروع سر رسید</FormLabel>
                            <MyDatePicker
                                onChange={(e) => setFilter({ startDate: e?.toLocaleString() })}
                                value={filter.startDate}
                            />
                        </FormControl>
                    </Grid2>

                    <Grid2 size={{ xl: 3, lg: 3, md: 4, sm: 4, xs: 12 }}>
                        <FormControl fullWidth>
                            <FormLabel>تاریخ پایان سر رسید</FormLabel>
                            <MyDatePicker
                                onChange={(e) => setFilter({ endDate: e?.toLocaleString() })}
                                value={filter.endDate}
                            />
                        </FormControl>
                    </Grid2>

                    <Grid2 size={{ xl: 3, lg: 3, md: 4, sm: 4, xs: 12 }}>
                        <FormControl fullWidth>
                            <FormLabel>وضعیت سررسید</FormLabel>
                            <DueStatusAutoComplete
                                onChange={(e) => setFilter({ dueStatus: e })}
                                value={filter.dueStatus}
                            />
                        </FormControl>
                    </Grid2>

                    <Grid2 size={{ xl: 3, lg: 3, md: 4, sm: 4, xs: 12 }}>
                        <FormControl fullWidth>
                            <FormLabel>وضعیت تسویه</FormLabel>
                            <SettelmentStatusAutoComplete
                                onChange={(e) => setFilter({ settlementStatus: e })}
                                value={filter.settlementStatus}
                            />
                        </FormControl>
                    </Grid2>

                    <Grid2 size={{ xl: 3, lg: 3, md: 4, sm: 4, xs: 12 }}>
                        <FormControl fullWidth>
                            <FormLabel>نوع سررسید</FormLabel>
                            <DueTypeAutoComplete
                                onChange={(e) => setFilter({ dueType: e })}
                                value={filter.dueType}
                            />
                        </FormControl>
                    </Grid2>

                    <Grid2 size={{ xl: 3, lg: 3, md: 4, sm: 4, xs: 12 }}>
                        <FormControl fullWidth>
                            <FormLabel>کد ملی</FormLabel>
                            <NumericFormat
                                customInput={TextField}
                                variant="outlined"
                                dir="ltr"
                                allowLeadingZeros
                                onChange={(e) => setFilter({ nationalCode: e.target.value })}
                                value={filter.nationalCode}
                            />
                        </FormControl>
                    </Grid2>

                    <Grid2 size={{ xl: 3, lg: 3, md: 4, sm: 4, xs: 12 }}>
                        <FormControl fullWidth>
                            <FormLabel>تاریخ شروع پرداخت</FormLabel>
                            <MyDatePicker
                                onChange={(e) => setFilter({ startPaymentDate: e?.toLocaleString() })}
                                value={filter.startPaymentDate}
                            />
                        </FormControl>
                    </Grid2>

                    <Grid2 size={{ xl: 3, lg: 3, md: 4, sm: 4, xs: 12 }}>
                        <FormControl fullWidth>
                            <FormLabel>تاریخ پایان پرداخت</FormLabel>
                            <MyDatePicker
                                onChange={(e) => setFilter({ endPaymentDate: e?.toLocaleString() })}
                                value={filter.endPaymentDate}
                            />
                        </FormControl>
                    </Grid2>

                    <Grid2 mt={4}>
                        <FormControl fullWidth>
                            <Button
                                loading={financeItems.status === "loading"}
                                onClick={getFinanceItemList}
                                type="button"
                                color="primary"
                                variant="contained"
                                size="small"
                                endIcon={<Search />}
                            >
                                جستوجو
                            </Button>
                        </FormControl>
                    </Grid2>

                    <Grid2 mt={4}>
                        <FormControl fullWidth>
                            <Button
                                loading={financeItems.status === "loading"}
                                onClick={handleExportExcelClick}
                                type="button"
                                color="success"
                                variant="contained"
                                size="small"
                                endIcon={<ImportExport />}
                            >
                                خروجی اکسل
                            </Button>
                        </FormControl>
                    </Grid2>

                </Grid2>
            </Card>

        </>
    );
}
