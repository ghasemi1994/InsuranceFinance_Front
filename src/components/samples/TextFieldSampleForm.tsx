import { Box, TextField } from '@mui/material'
import React from 'react'

export default function TextFieldSampleForm() {
    return (
        <Box
            component="form"
            sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
            noValidate
            autoComplete="off"
            dir='rtl'
        >
            <TextField id="outlined-basic" label="نام کاربر" variant="outlined" dir='rtl' size='small'/>    
        </Box>
    )
}
