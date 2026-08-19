import { ReminderCategory } from '@/types/Enums';
import { SendTimeReminder, ReminderChannelType, ISMSReminderTemplate, ReminderRuleRequest, BirthdayConfigRule, InstallmentConfigRule, RenewConfigRule } from '@/types/Reminder'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form';
import BirthdayReminderSetting from './components/BirthdayReminderSetting';
import RenewReminderSetting from './components/RenewReminderSetting';
import InstallmentReminderSetting from './components/InstallmentReminderSetting';
import { updateReminderRule } from '@/server/services/reminderService';
import toast from 'react-hot-toast';
import { toCamelCase } from '@/utils/convertion';


interface SendReminderSettingDialogProps {
    open: boolean,
    onClose: (open: boolean) => void,
    template: ISMSReminderTemplate | null
}

export default function SendReminderSettingDialog({ open, onClose, template }: SendReminderSettingDialogProps) {

    const methods = useForm<ReminderRuleRequest>({
        defaultValues: {
            SMSReminderTemplateId: template?.id,
            birthdayConfigRule: {
                sendTimeReminder: SendTimeReminder.CurrentDay,
                reminderChannelType: ReminderChannelType.SMS,
                reminderAutoSend: true,
                time: "08:30"
            },
            renewConfigRule: [
                {
                    sendTimeReminder: SendTimeReminder.CurrentDay,
                    reminderChannelType: ReminderChannelType.SMS,
                    reminderAutoSend: true,
                    time: "09:00",
                }
            ],
            installmentConfigRule: [
                {
                    sendTimeReminder: SendTimeReminder.CurrentDay,
                    reminderChannelType: ReminderChannelType.SMS,
                    reminderAutoSend: true,
                    time: "08:30"
                }
            ],
        },
    });


    useEffect(() => {
        if (open && template) {

            methods.setValue('SMSReminderTemplateId', template.id);
            methods.setValue('reminderCategory', template.reminderCategory);

            /*let newDefaultValues: Partial<ReminderRuleRequest> = {
                SMSReminderTemplateId: template.id,
                reminderCategory: template.reminderCategory,
            };*/

            if (template.reminderCategory === ReminderCategory.Birthday) {

                if (!template.reminderRuleConfig)
                    return;

                const parsedConfig = JSON.parse(template.reminderRuleConfig);

                methods.setValue('birthdayConfigRule', {
                    reminderAutoSend: parsedConfig.reminderAutoSend,
                    reminderChannelType: parsedConfig.reminderChannelType,
                    sendTimeReminder: parsedConfig.sendTimeReminder,
                    time: parsedConfig.time
                });

            }
            else if (template.reminderCategory === ReminderCategory.Installment) {
                if (!template.reminderRuleConfig)
                    return;

                const parsedConfig = JSON.parse(template.reminderRuleConfig);

                const renewConfigArray = Array.isArray(parsedConfig) ? parsedConfig : [parsedConfig];

                methods.setValue('installmentConfigRule', renewConfigArray, {
                    shouldDirty: true,
                    shouldValidate: true,
                    shouldTouch: true
                });      

            }
            else if (template.reminderCategory === ReminderCategory.Renew) {
                if (!template.reminderRuleConfig) return;

                const parsedConfig = JSON.parse(template.reminderRuleConfig);

                const renewConfigArray = Array.isArray(parsedConfig) ? parsedConfig : [parsedConfig];

                methods.setValue('renewConfigRule', renewConfigArray, {
                    shouldDirty: true,
                    shouldValidate: true,
                    shouldTouch: true
                });
            }
        }
    }, [open, template, methods]);

    const onSubmit = async (req: ReminderRuleRequest) => {
        await updateReminderRule(req).then(() => {
            toast.success('اطلاعات با موفقیت ثبت شد');
            onClose(false);
        });
    }
    return (
        <>
            <FormProvider {...methods}>
                <Dialog
                    open={open}
                    maxWidth='md'
                    fullWidth
                    keepMounted
                    onClose={onClose}
                    component={'form'}
                    onSubmit={methods.handleSubmit(onSubmit)}
                >
                    <DialogTitle color='primary'>
                        تنظیمات ارسال یادآوری
                        {" "}
                        ({template?.reminderCategoryTitle})
                    </DialogTitle>
                    <DialogContent>
                        {template?.reminderCategory == ReminderCategory.Birthday && <BirthdayReminderSetting />}
                        {template?.reminderCategory == ReminderCategory.Renew && <RenewReminderSetting />}
                        {template?.reminderCategory == ReminderCategory.Installment && <InstallmentReminderSetting />}
                    </DialogContent>
                    <DialogActions>
                        <Button color='success' type='submit' loading={methods.formState.isSubmitting}>ذخیره</Button>
                        <Button onClick={() => onClose(false)} variant='text' type='button'>بستن</Button>
                    </DialogActions>
                </Dialog>
            </FormProvider>
        </>
    )
}
