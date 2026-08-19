import { Button, FormControl, Card, Box, Grid2, TextField, FormLabel } from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { usePeopleStore } from '../../../stores/peopleStore';
import SearchIcon from '@mui/icons-material/Search';
import React, { useState } from 'react';
import PeopleAutoComplete from '../../../components/common/dropDown/PeopleAutoComplete';


export default function FilterPanel() {
    const [nationalCode, setNationalCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [personId, setPersonId] = useState<number | null>(null);
    const { getList, status } = usePeopleStore();

    const handleFilterClick = () => {
        getList(nationalCode, phoneNumber, '', personId, null);
    };

    return (
        <Card>
            <Grid2 container spacing={2} alignItems="center">

                <Grid2 size={{ xl: 3, lg: 4, md: 6, sm: 12, xs: 12 }}>
                    <FormControl fullWidth>
                        <FormLabel>اشخاص</FormLabel>
                        <PeopleAutoComplete
                            value={personId}
                            onChange={(e) => setPersonId(e)}
                        />
                    </FormControl>
                </Grid2>

                <Grid2 size={{ xl: 3, lg: 4, md: 6, sm: 12, xs: 12 }}>
                    <FormControl fullWidth>
                        <FormLabel>شناسه اقتصادی / کد ملی / کد اختصاصی اتباع</FormLabel>
                        <NumericFormat
                            customInput={TextField}
                            dir="ltr"
                            allowLeadingZeros
                            value={nationalCode}
                            onChange={(e) => setNationalCode(e.target.value)}
                            variant='outlined'
                        />
                    </FormControl>
                </Grid2>

                <Grid2 size={{ xl: 3, lg: 4, md: 6, sm: 12, xs: 12 }}>
                    <FormControl fullWidth>
                        <FormLabel>شماره موبایل</FormLabel>
                        <NumericFormat
                            customInput={TextField}
                            dir="ltr"
                            allowLeadingZeros
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            variant='outlined'
                        />
                    </FormControl>
                </Grid2>


                <Box width={'100%'} display="flex" justifyContent="flex-end">
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={handleFilterClick}
                        loading={status === 'loading'}
                        loadingPosition="start"
                        startIcon={<SearchIcon />}
                    >
                        جستجو
                    </Button>
                </Box>

            </Grid2>
        </Card>
    );
}