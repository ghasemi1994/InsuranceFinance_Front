import TemplateEditor, { Tag } from '@/components/common/TemplateEditor'
import { ReminderCategory } from '@/types/Enums'
import { ISMSReminderTemplate } from '@/types/Reminder'
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material'
import React, { useEffect, useState } from 'react'


interface TemplateEditorDialogProps {
    open: boolean,
    onClose: (open: boolean) => void,
    template: ISMSReminderTemplate | null
}

export default function TemplateEditorDialog({ open, onClose, template }: TemplateEditorDialogProps) {

    const [tags, setTags] = useState<Tag[]>([]);

    useEffect(() => {
        if (template && open) {
            const tags: Tag[] = JSON.parse(template.jsonTags) ?? [];
            setTags(tags);
        }
    }, [open])

    return (
        <>
            <Dialog
                open={open}
                maxWidth='md'
                fullWidth
                keepMounted
                onClose={onClose}

            >
                <DialogContent>

                    <TemplateEditor
                        initialTemplate={template?.template}
                        availableTags={tags}
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => onClose(false)} variant='text'>بستن</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
