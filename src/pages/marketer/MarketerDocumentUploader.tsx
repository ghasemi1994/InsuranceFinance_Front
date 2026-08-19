import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material'
import React from 'react'
import { IMarketerResponse } from '../../types/Person';
import AttachmentUploader from '../attachment/AttachmentUploader';

interface IProps {
    open: boolean
    onClose: (open: boolean) => void,
    record: IMarketerResponse | null
}


export default function UploaderDialog({ onClose, open, record }: IProps) {

    return (
        <>
            <Dialog
                maxWidth='sm'
                fullWidth
                open={open}
                keepMounted
                onClose={onClose}
                aria-describedby="dialog-person"
            >
                <DialogTitle color='error'>{"آپلود مدارک بازاریاب"}{' - '}{record?.fullName}</DialogTitle>
                <DialogContent sx={{ paddingBottom: 2 }}>

                    {record &&
                        <AttachmentUploader
                            entityType='personmarketer'
                            entityId={record?.id} />
                    }

                </DialogContent>
                <DialogActions>
                    <Button size='small' onClick={() => onClose(false)}>بستن</Button>
                </DialogActions>

            </Dialog>
        </>
    )
}
