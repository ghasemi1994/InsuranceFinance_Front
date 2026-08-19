import { ReminderCategory } from '@/types/Enums';
import { SendTimeReminder, ReminderChannelType, ReminderRuleRequest, BirthdayConfigRule } from '@/types/Reminder';
import { toCamelCase } from '@/utils/convertion';
import { Checkbox, FormControl, FormControlLabel, FormLabel, Grid2, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form';



export default function BirthdayReminderSetting() {

    const {
        control,
        setValue,
        reset,
    } = useFormContext<ReminderRuleRequest>();


    return (
        <>
            <Grid2 container spacing={2}>
                <Grid2 size={{ xl: 4, lg: 4, md: 6, sm: 6, xs: 12 }}>
                    <FormControl fullWidth>
                        <FormLabel>ارسال یادآوری</FormLabel>
                        <Controller
                            control={control}
                            name='birthdayConfigRule.sendTimeReminder'
                            render={({ field: { value, onChange }, fieldState: { error } }) =>
                                <Select
                                    onChange={onChange}
                                    value={value}
                                >
                                    <MenuItem value={SendTimeReminder.CurrentDay}>📅 در روز جاری</MenuItem>
                                    <MenuItem value={SendTimeReminder.ADayBefore}>📆 1 روز مانده</MenuItem>
                                    <MenuItem value={SendTimeReminder.TowDayBefore}>📆 2 روز مانده</MenuItem>
                                    <MenuItem value={SendTimeReminder.ThreeDayBefore}>📆 3 روز مانده</MenuItem>
                                </Select>
                            }
                        />
                    </FormControl>
                </Grid2>
                <Grid2 size={{ xl: 3, lg: 3, md: 4, sm: 6, xs: 12 }}>
                    <FormControl fullWidth>
                        <FormLabel>کانال ارسال</FormLabel>
                        <Controller
                            control={control}
                            name='birthdayConfigRule.reminderChannelType'
                            render={({ field: { value, onChange }, fieldState: { error } }) =>
                                <Select
                                    onChange={onChange}
                                    value={value}
                                >
                                    <MenuItem value={ReminderChannelType.SMS}>SMS</MenuItem>
                                    <MenuItem disabled value={ReminderChannelType.WhatsApp}>WhatsApp</MenuItem>
                                    <MenuItem disabled value={ReminderChannelType.Bale}>Bale</MenuItem>
                                </Select>
                            }
                        />
                    </FormControl>
                </Grid2>

                <Grid2 size={{ xl: 3, lg: 3, md: 4, sm: 6, xs: 12 }}>
                    <FormControl fullWidth>
                        <FormLabel>زمان اجرا</FormLabel>
                        <Controller
                            control={control}
                            name='birthdayConfigRule.time'
                            render={({ field: { onChange, value } }) => (
                                <TextField
                                    onChange={onChange}
                                    value={value}
                                    type="time"
                                />
                            )}
                        />
                    </FormControl>
                </Grid2>
                <Grid2 size={{ xl: 2, lg: 2, md: 4, sm: 6, xs: 12 }}>
                    <FormControl >
                        <FormLabel>اجرا اتوماتیک</FormLabel>
                        <Controller
                            control={control}
                            name='birthdayConfigRule.reminderAutoSend'
                            render={({ field }) => (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            onChange={(e) => field.onChange(e.target.checked)}
                                            checked={Boolean(field.value)}
                                        />
                                    }
                                    label=""
                                />
                            )}
                        />
                    </FormControl>
                </Grid2>

            </Grid2>
        </>
    )
}
