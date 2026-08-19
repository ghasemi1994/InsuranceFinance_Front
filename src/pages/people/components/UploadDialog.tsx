import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React from 'react'
import AttachmentUploader from '../../attachment/AttachmentUploader'


interface IProps {
    open: boolean
    onClose: (open: boolean) => void,
    personId: number | null,
    personName?: string
}

export default function UploadDialog({ onClose, open, personId, personName }: IProps) {
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
                <DialogTitle>{"آپلود مدارک مشتری"}{" ("}{personName}{") "}</DialogTitle>
                <DialogContent sx={{ paddingBottom: 2 }}>
                    {open &&
                        <AttachmentUploader
                            entityId={personId ?? 0}
                            entityType='person'
                        />
                    }

                </DialogContent>
                <DialogActions>
                    <Button size='small' onClick={() => onClose(false)}>بستن</Button>
                </DialogActions>

            </Dialog>
        </>
    )
}
