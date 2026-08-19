import TemplateEditor from '@/components/common/TemplateEditor'
import { getTemplateView } from '@/server/services/reminderService'
import { ReminderCategory } from '@/types/Enums'
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material'
import React, { useEffect, useState } from 'react'


interface SMSTemplateViewerProps {
  open: boolean,
  entityId: number,
  onClose: (open: boolean) => void,
  category : ReminderCategory
}
export default function SMSTemplateViewer({ open, entityId, onClose , category }: SMSTemplateViewerProps) {

  const [templateView, setTemplateView] = useState('');

  const handleSMSTemplateView = async () => {
    await getTemplateView({
      category: category,
      entityIds: [entityId]
    }).then((res => {
      setTemplateView(res?.data?.item2[0]);
    }))
  }

  useEffect(() => {
    if (open)
      handleSMSTemplateView();
  }, [open])

  return (
    <>
      <Dialog
        open={open}
        maxWidth='sm'
        fullWidth
        keepMounted
        onClose={onClose}

      >
        <DialogContent>

          <TemplateEditor
            initialTemplate={templateView}
            disableOperationButtons
            key={entityId}
          />

        </DialogContent>
        {/* <DialogActions>
          <Button variant='text'>بستن</Button>
        </DialogActions> */}
      </Dialog>
    </>
  )
}
