import MyDataGrid from '@/components/common/dataGrid/MyDataGrid'
import { getSMSTemplateList } from '@/server/services/reminderService'
import { ISMSReminderTemplate } from '@/types/Reminder'
import { Edit, Settings } from '@mui/icons-material'
import { Tooltip } from '@mui/material'
import { GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import TemplateEditorDialog from './TemplateEditorDialog'
import SendReminderSettingDialog from './SendReminderSettingDialog'

export default function ReminderSetting() {

    const [data, setData] = useState<ISMSReminderTemplate[]>([]);
    const [openTemplateEditorDialog, setOpenTemplateEditorDialog] = useState<boolean>(false);
    const [openSettingDialog, setOpenDialogSetting] = useState<boolean>(false);
    const [template, setTemplate] = useState<ISMSReminderTemplate | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        setLoading(true);
        await getSMSTemplateList().then((res) => {
            setData(res.data);
        }).finally(() => setLoading(false));
    }

    const handleEditTemplate = (item: ISMSReminderTemplate) => {
        setTemplate(item);
        setOpenTemplateEditorDialog(true);
    }

    const handleSettingClick = (item: ISMSReminderTemplate) => {
        setOpenDialogSetting(true);
        setTemplate(item);
    }

    const handleDialogClose = () => {
        setOpenDialogSetting(false);
        getData();
    }


    const columns: GridColDef<ISMSReminderTemplate>[] = [
        {
            field: 'reminderCategoryTitle',
            headerName: 'نوع یادآوری',
            width: 200,
        },
        {
            flex: 1.5,
            field: 'action',
            type: 'actions',
            headerName: 'عملیات',
            getActions: (params: GridRowParams<ISMSReminderTemplate>) => [
                <GridActionsCellItem
                    icon={<Tooltip title="ویرایش قالب"><Edit color='primary' /></Tooltip>}
                    label="ویرایش قالب"
                    onClick={() => handleEditTemplate(params.row)}
                />,

                <GridActionsCellItem
                    icon={<Tooltip title="تنظیمات ارسال"><Settings color='primary' /></Tooltip>}
                    label="تنظیمات ارسال"
                    onClick={() => handleSettingClick(params.row)}
                />,
            ],
        }

    ]

    return (
        <>
            <TemplateEditorDialog
                open={openTemplateEditorDialog}
                onClose={() => setOpenTemplateEditorDialog(false)}
                template={template}
            />

            <SendReminderSettingDialog
                open={openSettingDialog}
                onClose={handleDialogClose}
                template={template}
            />

            <MyDataGrid
                rows={data}
                columns={columns}
                getRowId={(e) => e.id}
                loading={loading}
            />
        </>
    )
}
