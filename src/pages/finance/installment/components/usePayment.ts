import {  getAddendumById, getPolicyById } from "@/server/services/insuranceService";
import { getPaytmentDebtById } from "@/server/services/paymentService";
import { AddendumResponse, IInsurancePolicyResponse, InstallmentSideType, PolicyPaymentGroupType } from "@/types/Insurance";
import { PolicyPaymentPendingDebtResponse } from "@/types/Payment";
import { useState } from "react";
import toast from "react-hot-toast";

interface ShowPaymentDialog {
    
    installmentItemId: number | null,
    policyPaymentGroupType: PolicyPaymentGroupType,
    insurancePolicyId: number,

    addendumId?: number | null,
    policyPaymentPendingDebtId?: number | null
}

export default function usePayment() {

    const [debt, setDebt] = useState<PolicyPaymentPendingDebtResponse | null>(null);
    const [addendum, setAddendum] = useState<AddendumResponse | null>(null);
    const [groupType, setGroupType] = useState<PolicyPaymentGroupType>(PolicyPaymentGroupType.CashGroup);
    const [installmentItemId, setInstallmentItemId] = useState<number | null>(null);
    const [policy, setPolicy] = useState<IInsurancePolicyResponse | null>(null);
    const [openDialog, setOpenDialog] = useState<boolean>(false);


    const openPaymentDialog = async (props: ShowPaymentDialog) => {
        try {
            setInstallmentItemId(props.installmentItemId);
            setGroupType(props.policyPaymentGroupType);
            await getPolicyById(props.insurancePolicyId, InstallmentSideType.Customer).then((res) => {
                setPolicy(res?.data);
                if (props.policyPaymentGroupType === PolicyPaymentGroupType.AddendumGroup) {
                    if (!props.addendumId) {
                        toast.error('payment incorrect');
                        return;
                    }
                    getAddendum(props.addendumId);
                }
                else if (props.policyPaymentGroupType === PolicyPaymentGroupType.DebtGroup) {
                    if (!props.policyPaymentPendingDebtId) {
                        toast.error('payment incorrect');
                        return;
                    }
                    getDebt(props.policyPaymentPendingDebtId);
                }
                else {
                    setOpenDialog(true);
                }
            });
        } catch { }
    }

    const getAddendum = async (addendumId: number) => {
        try {
            await getAddendumById(addendumId).then((res) => {
                setAddendum(res?.data);
                setOpenDialog(true);
            })
        } catch { }
    }

    const getDebt = async (id: number) => {
        try {
            await getPaytmentDebtById(id).then((res) => {
                setDebt(res?.data);
                setOpenDialog(true);
            })
        } catch { }
    }

    return {
        openPaymentDialog,

        openDialog,
        setOpenDialog,

        policy,

        debt,
        setDebt,

        installmentItemId,

        groupType,

        addendum,
        setAddendum
    }

}