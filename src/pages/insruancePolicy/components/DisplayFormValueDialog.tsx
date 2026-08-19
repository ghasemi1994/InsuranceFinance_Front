import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React, { useEffect, useState } from 'react'
import FormBuilder from '../../form/builder/FormBuilder'
import { IFormPolicyResponse } from '../../../types/Form'
import { getFormWithValueByPolicyId } from '../../../server/services/insuranceService'
import { useFormStore } from '../../../stores/formStore'



interface IProps {
    open: boolean,
    onClose: (open: boolean) => void
    policyId: number | null,
    disabledInputEditing?: boolean
}
export default function DisplayFormValueDialog({ policyId, onClose, open }: IProps) {

    const [form, setForm] = useState<IFormPolicyResponse | null>(null);
    const { resetFormFieldValue } = useFormStore();

    useEffect(() => {
        if (open) {
            getFormValueData();
        }
    }, [open])

    const getFormValueData = async () => {
        if (policyId)
            await getFormWithValueByPolicyId(policyId).then((response) => {
                setForm(response?.data);
            })
    }

    const handleClose = () => {
        onClose(false);
        resetFormFieldValue();
        setForm(null);
    }

    return (
        <Dialog
            fullWidth
            maxWidth='lg'
            open={open}
            keepMounted
            onClose={handleClose}
        >
            <DialogTitle>نمایش اطلاعات فرم</DialogTitle>
            <DialogContent>
                {open &&
                    <FormBuilder
                        form={form || null}
                        formState='view'
                    />
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(false)} size='small'>بستن</Button>
            </DialogActions>
        </Dialog>
    )
}
