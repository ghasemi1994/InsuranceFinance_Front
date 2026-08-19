import { useReminderStore } from '@/stores/reminderStore';
import { ReminderCategory } from '@/types/Enums';
import { NotificationsNone } from '@mui/icons-material'
import { Badge, IconButton, Stack, Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ReminderCategoryResponse } from '@/types/Reminder';
import ReminderBirthdayDialog from './ReminderBirthdayDialog';
import ReminderInstallmentDialog from './ReminderInstallmentDialog';
import ReminderRenewDialog from './ReminderRenewDialog';


export default function Reminder() {

    const [openDialogBirthday, setOpenDialogBirthday] = useState(false);
    const [openDialogInstallment, setOpenDialogInstallment] = useState(false);
    const [openDialogRenew, setOpenDialogRenew] = useState(false);



    const [categorySelected, setCategorySelected] = useState<ReminderCategoryResponse | null>(null);

    const {
        getReminderCategoryList,
        reminderCategoryList,
        status,
    } = useReminderStore();

    useEffect(() => {
        if (status === 'idle')
            getReminderCategoryList();
    }, [status]);

    const policy = reminderCategoryList.find(c => c.reminderCategory === ReminderCategory.Renew);
    const birthday = reminderCategoryList.find(c => c.reminderCategory === ReminderCategory.Birthday);
    const installment = reminderCategoryList.find(c => c.reminderCategory === ReminderCategory.Installment);

    const handleBirthdayClick = (category: ReminderCategory) => {
        setCategorySelected(reminderCategoryList.find(c => c.reminderCategory === category) ?? null);
        setOpenDialogBirthday(true);
    }

    const handleInstallmentClick = (category: ReminderCategory) => {
        setCategorySelected(reminderCategoryList.find(c => c.reminderCategory === category) ?? null);
        setOpenDialogInstallment(true);
    }

    const handleRenewClick = (category: ReminderCategory) => {
        setCategorySelected(reminderCategoryList.find(c => c.reminderCategory === category) ?? null);
        setOpenDialogRenew(true);
    }


    return (
        <>

            <Stack flexDirection={'row'} alignItems={'center'}>

                {(policy?.totalCount ?? 0) > 0 &&
                    <>
                        {
                            openDialogRenew &&
                            <ReminderRenewDialog
                                open={openDialogRenew}
                                category={categorySelected}
                                onClose={() => setOpenDialogRenew(false)}
                            />
                        }

                        <IconButton
                            onClick={() => handleRenewClick(ReminderCategory.Renew)}
                        >
                            <Tooltip title='یادآوری تمدید بیمه نامه ها'>
                                <Badge badgeContent={policy?.totalCount} color='error' >
                                    <NotificationsNone fontSize='small' />
                                </Badge>
                            </Tooltip>
                        </IconButton>
                    </>
                }

                {(installment?.totalCount ?? 0) > 0 &&
                    <>
                        {
                            openDialogInstallment &&
                            < ReminderInstallmentDialog
                                open={openDialogInstallment}
                                category={categorySelected}
                                onClose={() => setOpenDialogInstallment(false)}
                            />
                        }
                        <IconButton
                            onClick={() => handleInstallmentClick(ReminderCategory.Installment)}
                        >
                            <Tooltip title='یادآوری اقساط'>
                                <Badge badgeContent={installment?.totalCount} color='error' >
                                    <NotificationsNone fontSize='small' />
                                </Badge>
                            </Tooltip>
                        </IconButton>
                    </>
                }

                {(birthday?.totalCount ?? 0) > 0 &&
                    <>
                        {
                            openDialogBirthday &&
                            <ReminderBirthdayDialog
                                open={openDialogBirthday}
                                category={categorySelected}
                                onClose={() => setOpenDialogBirthday(false)}
                            />
                        }

                        <IconButton
                            onClick={() => handleBirthdayClick(ReminderCategory.Birthday)}
                        >
                            <Tooltip title='یادآوری تولد'>
                                <Badge badgeContent={birthday?.totalCount} color='error' >
                                    <NotificationsNone fontSize='small' />
                                </Badge>
                            </Tooltip>
                        </IconButton>
                    </>
                }

            </Stack>
        </>
    )
}
