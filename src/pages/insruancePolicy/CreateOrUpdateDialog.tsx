import { Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import InsurancePolicyManagement from './InsurancePolicyManagement';
import { getPolicyById } from '../../server/services/insuranceService';
import { IInsurancePolicyResponse, InstallmentSideType } from '../../types/Insurance';
import { Close } from '@mui/icons-material';


interface IProps {
    open: boolean,
    onClose: (open: boolean) => void
    policyId: number | null,
    /** تمدید بیمه نامه است ؟ */
    policyRenewal: boolean,
}
export default function CreateOrUpdateDialog({ onClose, open, policyId, policyRenewal }: IProps) {

    const [policyData, setPolicyData] = useState<IInsurancePolicyResponse | null>(null);

    const handleClose = () => {
        onClose(false);
        setPolicyData(null);
    }

    useEffect(() => {
        if (open) {
            getPolicy();
        }
    }, [open])

    const getPolicy = async () => {
        try {
            if (policyId)
                await getPolicyById(policyId, InstallmentSideType.Customer).then((response) => {
                    setPolicyData(response?.data);                    
                });
        } catch { }
    }

    const title = policyRenewal ? `تمدید بیمه نامه (${policyData?.customerName} - ${policyData?.insuranceNo})` :
        !policyData
            ?
            'ثبت بيمه نامه جديد'
            :
            <>
                {'ویرایش بیمه نامه'} ({policyData.customerName} - {policyData.insuranceNo})
            </>
        ;

    return (
        <Dialog
            maxWidth='xl'
            fullWidth
            open={open}
            keepMounted
            onClose={handleClose}
        >
            <DialogTitle>
                <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
                    <Typography fontSize={16} fontWeight={500}>
                        {title}
                    </Typography>
                    <IconButton
                        onClick={() => onClose(false)}
                        sx={{
                            p: 0.5,
                            m: 0
                        }}>
                        <Close />
                    </IconButton>
                </Stack>
            </DialogTitle>
            <DialogContent>

                <InsurancePolicyManagement
                    dataForEdit={policyData}
                    onCloseDialog={handleClose}
                    policyRenewal={policyRenewal}
                />

            </DialogContent>
            {/* <DialogActions>
                <Button size='small' onClick={handleClose} >بستن</Button>
            </DialogActions> */}
        </Dialog>
    )
}
