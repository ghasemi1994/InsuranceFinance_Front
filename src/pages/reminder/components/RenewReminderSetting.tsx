import { ReminderChannelType, ReminderRuleRequest, SendTimeReminder } from '@/types/Reminder'
import {
    CardContent,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid2,
    IconButton, MenuItem,
    Select, Stack,
    TextField,
    Tooltip, Typography, Paper
} from '@mui/material'
import DeleteIcon from "@mui/icons-material/Delete"
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ChannelIcon from '@mui/icons-material/AltRoute'
import AutoModeIcon from '@mui/icons-material/AutoMode'
import React, { useEffect } from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import SendTimeReminderAutoComplete from './SendTimeReminderAutoComplete'

const getCardColor = (index: number) => {
    const hue = (index * 137.508) % 360;
    return `linear-gradient(135deg, hsl(${hue}, 70%, 92%) 0%, hsl(${hue}, 70%, 82%) 100%)`;
};

export default function RenewReminderSetting() {

    const { control } = useFormContext<ReminderRuleRequest>();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "renewConfigRule"
    })

    const handleCountChange = (count: number) => {
        const currentLength = fields.length
        if (count > currentLength) {
            for (let i = 0; i < count - currentLength; i++) {
                append({
                    sendTimeReminder: SendTimeReminder.CurrentDay,
                    reminderChannelType: ReminderChannelType.SMS,
                    time: "09:00",
                    reminderAutoSend: true,
                })
            }
        } else if (count < currentLength) {
            for (let i = currentLength - 1; i >= count; i--) {
                remove(i)
            }
        }
    }

    return (
        <>
            <Grid2 container spacing={2} mb={3}>
                <Grid2 size={{ xl: 6, lg: 6, md: 6, sm: 6, xs: 12 }}>
                    <FormControl fullWidth>
                        <FormLabel>تعداد تکرار</FormLabel>
                        <Select
                            value={fields.length}
                            onChange={(e) => handleCountChange(Number(e.target.value))}
                        >
                            <MenuItem value={1}>یک بار</MenuItem>
                            <MenuItem value={2}>دو بار</MenuItem>
                            <MenuItem value={3}>سه بار</MenuItem>
                            <MenuItem value={4}>چهار بار</MenuItem>
                            <MenuItem value={5}>پنج بار</MenuItem>
                        </Select>
                    </FormControl>
                </Grid2>
            </Grid2>

            <Grid2 container spacing={3}>
                {fields.map((field, index) => (
                    <Grid2 key={field.id} size={{ xl: 6, lg: 6, md: 6, sm: 12, xs: 12 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                background: getCardColor(index),
                                //transition: 'all 0.2s',
                                //'&:hover': { transform: 'scale(1.01)', boxShadow: 6 }
                            }}
                        >
                            <CardContent sx={{ p: 0 }}>
                                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                                    <Typography variant="h6" fontWeight="bold" color="text.primary">
                                        🔹 تکرار {index + 1}
                                    </Typography>
                                    <IconButton
                                        onClick={() => remove(index)}
                                        disabled={fields.length === 1}
                                        sx={{ color: 'error.main' }}
                                    >
                                        <Tooltip title="حذف این تکرار">
                                            <DeleteIcon />
                                        </Tooltip>
                                    </IconButton>
                                </Stack>

                                <Grid2 container spacing={2}>
                                    {/* زمان ارسال */}
                                    <Grid2 size={12}>
                                        <FormControl fullWidth>
                                            <FormLabel>
                                                <AccessTimeIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                                                زمان ارسال
                                            </FormLabel>
                                            <Controller
                                                control={control}
                                                name={`renewConfigRule.${index}.sendTimeReminder`}
                                                render={({ field }) => (
                                                    <SendTimeReminderAutoComplete
                                                        {...field}
                                                        onChange={(val) => field.onChange(val)}
                                                    />
                                                )}
                                            />
                                        </FormControl>
                                    </Grid2>

                                    {/* کانال ارسال */}
                                    <Grid2 size={{ xl: 4, lg: 4, md: 6, sm: 6, xs: 12 }}>
                                        <FormControl fullWidth>
                                            <FormLabel>
                                                <ChannelIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                                                کانال ارسال
                                            </FormLabel>
                                            <Controller
                                                control={control}
                                                name={`renewConfigRule.${index}.reminderChannelType`}
                                                render={({ field }) => (
                                                    <Select {...field} >
                                                        <MenuItem value={ReminderChannelType.SMS}>SMS</MenuItem>
                                                        <MenuItem disabled value={ReminderChannelType.WhatsApp}>WhatsApp</MenuItem>
                                                        <MenuItem disabled value={ReminderChannelType.Bale}>Bale</MenuItem>
                                                    </Select>
                                                )}
                                            />
                                        </FormControl>
                                    </Grid2>

                                    {/* زمان اجرا */}
                                    <Grid2 size={{ xl: 4, lg: 4, md: 6, sm: 6, xs: 12 }}>
                                        <FormControl fullWidth>
                                            <FormLabel>
                                                <AccessTimeIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                                                زمان اجرا
                                            </FormLabel>
                                            <Controller
                                                control={control}
                                                name={`renewConfigRule.${index}.time`}
                                                render={({ field }) => (
                                                    <TextField {...field} type="time" />
                                                )}
                                            />
                                        </FormControl>
                                    </Grid2>

                                    {/* اجرا اتوماتیک */}
                                    <Grid2 size={{ xl: 4, lg: 4, md: 6, sm: 6, xs: 12 }}>
                                        <FormControl fullWidth>
                                            <FormLabel>
                                                <AutoModeIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                                                اجرا اتوماتیک
                                            </FormLabel>
                                            <Controller
                                                control={control}
                                                name={`renewConfigRule.${index}.reminderAutoSend`}
                                                render={({ field }) => (
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={Boolean(field.value)}
                                                                onChange={(e) => field.onChange(e.target.checked)}
                                                                color="primary"
                                                            />
                                                        }
                                                        label="فعال"
                                                        sx={{ mt: 1 }}
                                                    />
                                                )}
                                            />
                                        </FormControl>
                                    </Grid2>
                                </Grid2>
                            </CardContent>
                        </Paper>
                    </Grid2>
                ))}
            </Grid2>
        </>
    )
}