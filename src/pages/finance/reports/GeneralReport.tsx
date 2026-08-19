import { Button, Card, Divider, FormControl, FormLabel, Grid2, InputAdornment, TextField, Tooltip } from '@mui/material'
import React, { useState } from 'react'
import MyDatePicker from '../../../components/common/datePicker/MyDatePicker'
import { toPersianDate } from '../../../utils/convertion';
import { getGeneralFinanceReport } from '../../../server/services/reportService';
import { GeneralFinanceReport, GeneralFinanceReportFilter } from '../../../types/Report';
import { Search } from '@mui/icons-material';
import { digitSeprator, numberToPersianWords } from '../../../utils/text';
import MarketerAutoComplete from '../../../components/common/dropDown/MarketerAutoComplete';
import CategoryAutoComplete from '../../../components/common/dropDown/CategoryAutoComplete';

export default function GeneralReport() {

  const [report, setReport] = useState<GeneralFinanceReport>({
    customerTotlalUnpaid: 0,
    insuranceIssuedCount: 0,
    insuranceTotlalUnpaid: 0,
    totalCustomerPaid: 0,
    customerIndebtedness: 0,
  });

  const [filter, setFilter] = useState<GeneralFinanceReportFilter>({
    startDate: toPersianDate(new Date()),
    endDate: toPersianDate(new Date()),
    personMarketerId: null,
    categoryId: null
  });

  const [loading, setLoading] = useState(false);

  const getData = async () => {
    try {
      setLoading(true);
      await getGeneralFinanceReport(filter)
        .then((response) => {
          setReport(response?.data);
        });
    } catch { }
    finally { setLoading(false); }
  }

  return (
    <>
      <Card>
        <Grid2 container spacing={2} alignItems={'center'}>
          <Grid2 size={{ xl: 2, lg: 4 }}>
            <FormControl fullWidth>
              <FormLabel>تاریخ شروع</FormLabel>
              <MyDatePicker
                onChange={(e) => setFilter({ ...filter, startDate: e ?? '' })}
                value={filter.startDate}
              />
            </FormControl>
          </Grid2>
          <Grid2 size={{ xl: 2, lg: 4 }}>
            <FormControl fullWidth>
              <FormLabel>تاریخ پایان</FormLabel>
              <MyDatePicker
                onChange={(e) => setFilter({ ...filter, endDate: e ?? '' })}
                value={filter.endDate}
              />
            </FormControl>
          </Grid2>
          <Grid2 size={{ xl: 3, lg: 4 }}>
            <FormControl fullWidth>
              <FormLabel>بازارياب</FormLabel>
              <MarketerAutoComplete
                value={filter.personMarketerId}
                onChange={(e) => setFilter({ ...filter, personMarketerId: e })}
              />
            </FormControl>
          </Grid2>
          <Grid2 size={{ xl: 3, lg: 4 }}>
            <FormControl fullWidth>
              <FormLabel>دسته بندی</FormLabel>
              <CategoryAutoComplete
                onChange={(e) => setFilter({ ...filter, categoryId: e })}
                value={filter.categoryId}
              />
            </FormControl>
          </Grid2>
          <Grid2 size={{ xl: 2, lg: 3 }}>
            <Button
              sx={{ mt: 3 }}
              variant='contained'
              endIcon={<Search />}
              onClick={() => getData()}
              loading={loading}
            >جستجو</Button>
          </Grid2>

        </Grid2>


        <Divider sx={{ my: 4 }}>نتایج</Divider>

        <Grid2 container spacing={2}>
          <Grid2 size={{ xl: 2, lg: 3 }}>
            <FormControl fullWidth>
              <FormLabel>جمع کل وصولی مشتری</FormLabel>
              <Tooltip title={numberToPersianWords(report.totalCustomerPaid, 'Toman')}>
                <TextField
                  disabled
                  value={digitSeprator(report.totalCustomerPaid)}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">ریال</InputAdornment>
                      ),
                    },
                  }}
                />
              </Tooltip>
            </FormControl>
          </Grid2>
          <Grid2 size={{ xl: 2, lg: 3 }}>
            <FormControl fullWidth>
              <FormLabel>تعداد بیمه نامه صادر شده</FormLabel>
              <Tooltip title={numberToPersianWords(report.insuranceIssuedCount)}>
                <TextField disabled value={digitSeprator(report.insuranceIssuedCount)}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">عدد</InputAdornment>
                      ),
                    },
                  }}
                />
              </Tooltip>
            </FormControl>
          </Grid2>
          <Grid2 size={{ xl: 2, lg: 3 }}>
            <FormControl fullWidth>
              <FormLabel>جمع مطالبات مشتری</FormLabel>
              <Tooltip title={numberToPersianWords(report.customerTotlalUnpaid, 'Toman')}>
                <TextField disabled value={digitSeprator(report.customerTotlalUnpaid)}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">ریال</InputAdornment>
                      ),
                    },
                  }}
                />
              </Tooltip>
            </FormControl>
          </Grid2>
          <Grid2 size={{ xl: 2, lg: 3 }}>
            <FormControl fullWidth>
              <FormLabel>جمع کل بدهی به شرکت بیمه</FormLabel>
              <Tooltip title={numberToPersianWords(report.insuranceTotlalUnpaid, 'Toman')}>
                <TextField disabled value={digitSeprator(report.insuranceTotlalUnpaid)}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">ریال</InputAdornment>
                      ),
                    },
                  }}
                />
              </Tooltip>
            </FormControl>
          </Grid2>
          <Grid2 size={{ xl: 2, lg: 3 }}>
            <FormControl fullWidth>
              <FormLabel>جمع کل بدهی مشتری (ها)</FormLabel>
              <Tooltip title={numberToPersianWords(report.customerIndebtedness, 'Toman')}>
                <TextField disabled value={digitSeprator(report.customerIndebtedness)}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">ریال</InputAdornment>
                      ),
                    },
                  }}
                />
              </Tooltip>
            </FormControl>
          </Grid2>
        </Grid2>
      </Card >
    </>
  )
}
