import { deleteAddendum, getAddendumListByPolicyId, getPolicyById, getPolicyByInsuranceNo } from "@/server/services/insuranceService";
import { AddendumResponse, AddendumType, DepositStatus, IInsurancePolicyResponse, InstallmentSideType } from "@/types/Insurance";
import { useState } from "react";
import toast from "react-hot-toast";


export default function useAddendum() {

    const [policy, setPolicy] = useState<IInsurancePolicyResponse | null>(null);
    const [addendum, setAddendum] = useState<AddendumResponse | null>(null);
    const [openPaymnetDialog, setOpenPaymentDialog] = useState(false);
    const [insurance, setInsurance] = useState<IInsurancePolicyResponse | null>(null);
    const [addendumLoding, setAddendumLoading] = useState(false);
    const [insuranceNo, setInsuranceNo] = useState('');
    const [openCreateAddendumDialog, setOpenCreateAddendumDialog] = useState(false);
    const [addendumList, setAddendumList] = useState<AddendumResponse[]>([]);

    const paymentAcive = (item: AddendumResponse) => item.addendumType === AddendumType.WithFinancial && (item.premiumChangeAmount ?? 0) > 0

    const handleOpenPaymentDialog = async (addendum: AddendumResponse) => {
        try {
            if (addendum.customerDepositStatus === DepositStatus.Complete) {
                toast.error('الحاقیه قبلا پرداخت شده است');
                return;
            }
            if (!paymentAcive(addendum)) {
                toast.error('الحاقیه در وضعیت معتبر برای پرداخت نمی باشد');
                return;
            }

            if (addendum.policyId === null) return;

            await getPolicyById(addendum.policyId, InstallmentSideType.Customer).then((res) => {
                setPolicy(res?.data);
                setAddendum(addendum);
                setOpenPaymentDialog(true);
            });

        } catch { }
    }

    const handleGetInsurance = async () => {

        if (!insuranceNo)
            return;

        setAddendumLoading(true);
        await getPolicyByInsuranceNo(insuranceNo).then((res) => {
            if (res?.data) {
                setInsurance(res?.data);
                getAddendum(res?.data?.id);
            } else {
                setInsurance(null);
                setAddendumList([]);
            }
        }).finally(() => setAddendumLoading(false));

    }

    const handlePaymentClose = () => {
        setOpenPaymentDialog(false);
        if (insurance)
            getAddendum(insurance?.id);
    }

    const getAddendum = async (policyId: number) => {
        try {
            await getAddendumListByPolicyId(policyId).then((res) => {
                if (res?.data)
                    setAddendumList(res?.data);
                else
                    setAddendumList([]);
            });
        } catch { }
    }

    const deleteAddendumItem = async (item: AddendumResponse) => {
        try {
            if (window.confirm('آیا از حذف الحاقیه مطمئن هستيد؟')) {
                setAddendumLoading(true);
                if (item && item?.policyId)
                    await deleteAddendum(item?.policyId, item.id).then((res) => {
                        if (insurance)
                            getAddendum(insurance?.id);
                        toast.success('الحاقیه با موفقیت حذف شد');
                    });
            }
        } catch { }
        finally { setAddendumLoading(false) }
    }

    const handleOpenDialog = () => {
        if (!insurance)
            toast.error('لطفا ابتدا بیمه نامه مورد نظر را جستوجو کنید');
        else
            setOpenCreateAddendumDialog(true);
    }

    const handleCloseAddedumCreateDialog = () => {
        if (insurance)
            getAddendum(insurance?.id);
        setOpenCreateAddendumDialog(false);
    }


    return {

        handleOpenPaymentDialog,
        handleOpenDialog,
        handlePaymentClose,
        deleteAddendumItem,
        handleGetInsurance,
        handleCloseAddedumCreateDialog,
        setInsuranceNo,

        policy,
        addendum,
        openPaymnetDialog,
        insurance,
        addendumLoding,
        addendumList,
        openCreateAddendumDialog

    }
}