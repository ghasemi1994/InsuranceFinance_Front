import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowForward } from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Grid2,
    Step,
    StepButton,
    StepLabel,
    Stepper,
    Typography
} from '@mui/material';
import toast from 'react-hot-toast';
import { FinanceStep, InsuranceFormStep, InsurancePolicyStep, InsurerStep } from './Steps/index'
import { useFormStore } from '../../stores/formStore';
import { FormProvider } from 'react-hook-form';
import { IInsurancePolicyResponse, InstallmentSideType } from '../../types/Insurance';
import { PaymentType } from '../../types/Enums';
import AttachmentUploader from '../attachment/AttachmentUploader';
import PersonModifier from '../people/components/PersonModifier';
import { IPersonResponse } from '../../types/Person';
import SinglePolicyPaymentDialog from './components/payment/SinglePolicyPaymentDialog';
import { checkInsuranceNo } from '@/server/services/insuranceService';
import { useInsurancePolicyManagement } from './useInsurancePolicyManagement';
import { toPersianDate } from '@/utils/convertion';


interface IProps {
    dataForEdit?: IInsurancePolicyResponse | null
    onCloseDialog?: (open: boolean) => void,
    /** تمدید بیمه نامه است ؟ */
    policyRenewal?: boolean,
}

export default function InsurancePolicyManagement({ dataForEdit, onCloseDialog, policyRenewal }: IProps) {

    const [showFeeDialog, setShowFeeDialog] = useState(false);
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [insuranceResponse, setInsuranceResponse] = useState<IInsurancePolicyResponse | null>(null);

    const steps = [
        {
            label: 'اطلاعات بیمه گذار',
            element: <InsurerStep />
        },
        {
            label: 'اطلاعات بیمه نامه',
            element: <InsurancePolicyStep policyRenewal={policyRenewal || false} />
        },
        {
            label: 'فرم بیمه نامه',
            element: <InsuranceFormStep policyRenewal={policyRenewal || false} policyId={dataForEdit?.id} />
        },
        {
            label: 'اطلاعات مالی',
            element: <FinanceStep openFeeDialog={showFeeDialog} onCloseFeeDialog={() => setShowFeeDialog(false)} />
        }
    ]

    const {
        formFieldValues,
        resetFormFieldValue,
        setCurrentFormByCategory
    } = useFormStore();

    const {
        methods,
        defaultValues,
        setDataForEdit,
        setFormStep,
        create, formData,
        getList,
        setFormData,
        status,
        formStep
    } = useInsurancePolicyManagement();

    const { handleSubmit, reset, watch, setValue, setError } = methods;

    const isLastStep = () => {
        return formStep === steps.length - 1;
    };

    const isFirstStep = () => {
        return formStep === 0;
    };;

    const handleStep = (step: number) => () => {
        setFormStep(step);
    };

    const handleBack = () => {
        setFormStep(formStep - 1);
    };



    useEffect(() => {

        if (!dataForEdit) {
            reset(defaultValues);
            setFormStep(0);
            resetFormFieldValue();
            setValue('id', null);
            setDataForEdit(null);
        }
        else {

            // set in store
            setDataForEdit(dataForEdit);

            // set form-step
            setFormStep(0);

            if (policyRenewal) {
                // اگر برای تمدید بود شناسه ست نمیشه ینی ثبت جدید
                setValue('id', null);
                setValue('currentPolicyRenewalId', dataForEdit.id);
            } else {
                setValue('id', dataForEdit.id);
            }

            setValue('personId', dataForEdit.customerId);
            setValue('personMarketerId', dataForEdit.personMarketerId);
            setValue('introducerPersonId', dataForEdit.introducerPersonId);
            setValue('categoryId', dataForEdit.categoryId);
            setValue('companyId', dataForEdit.insuranceCompanyId);
            setValue('insuranceCompanyAgencyId_IssueUnit', dataForEdit.insuranceCompanyAgencyId_IssueUnit);
            setValue('insuranceCompanyAgencyId_IntroducerUnit', dataForEdit.insuranceCompanyAgencyId_IntroducerUnit);

            if (!policyRenewal)
                setValue('insuranceNo', dataForEdit.insuranceNo);

            setValue('uniqueCode', dataForEdit.uniqueCode ? Number(dataForEdit.uniqueCode) : null);

            if (!policyRenewal)
                setValue('issueDate', dataForEdit.issueDate);
            else
                setValue('issueDate', toPersianDate(new Date()));

            if (!policyRenewal)
                setValue('insuranceStartDate', dataForEdit.insuranceStartDate);
            else
                setValue('insuranceStartDate', toPersianDate(new Date()));

            setValue('insuranceTermTypeId', dataForEdit.insuranceTermTypeId);
            setValue('insuranceTermValue', dataForEdit.insuranceTermTypeValue);
            setValue('hasRenewalReminder', dataForEdit.hasRenewalReminder);
            setValue('renewalReminderDay', dataForEdit.renewalReminderDay);

            if (!policyRenewal)
                setValue('totalAmount', dataForEdit.totalAmount);

            setValue('discountAmount', dataForEdit.discountAmount);
            setValue('obligatedToPayType', dataForEdit.obligatedToPayType);

            {/**پرداختی مشتری */ }
            if (!policyRenewal) {
                setValue('paymentType', dataForEdit.paymentTypeId);
                if (dataForEdit.paymentTypeId === PaymentType.Installment) {
                    setValue('customerSideInstallment.prePaymentType', dataForEdit.customerInstallment.prePaymentTypeId);
                    setValue('customerSideInstallment.prePaymentValue', dataForEdit.customerInstallment.prePaymentValue);
                    setValue('customerSideInstallment.installmentCount', dataForEdit.customerInstallment.installmentCount);
                    setValue('customerSideInstallment.intervalBetweenInstalment', dataForEdit.customerInstallment.intervalBetweenInstalment);
                    setValue('customerSideInstallment.prePaymentStartDate', dataForEdit.customerInstallment.prePaymentStartDate);
                    setValue('customerSideInstallment.installmentStartDate', dataForEdit.customerInstallment.installmentStartDate);
                    setValue('customerSideInstallment.installmentAmount', dataForEdit.customerInstallment.installmentAmount);
                }
            }

            {/**پرداختی به بیمه */ }
            if (!policyRenewal) {
                setValue('insurancePaymentType', dataForEdit.insurancePaymentTypeId);
                if (dataForEdit.insurancePaymentTypeId === PaymentType.Installment) {
                    setValue('insuranceSideInstallment.prePaymentType', dataForEdit.insuranceInstallment.prePaymentTypeId);
                    setValue('insuranceSideInstallment.prePaymentValue', dataForEdit.insuranceInstallment.prePaymentValue);
                    setValue('insuranceSideInstallment.installmentCount', dataForEdit.insuranceInstallment.installmentCount);
                    setValue('insuranceSideInstallment.intervalBetweenInstalment', dataForEdit.insuranceInstallment.intervalBetweenInstalment);
                    setValue('insuranceSideInstallment.prePaymentStartDate', dataForEdit.insuranceInstallment.prePaymentStartDate)
                    setValue('insuranceSideInstallment.installmentStartDate', dataForEdit.insuranceInstallment.installmentStartDate)
                    setValue('insuranceSideInstallment.installmentAmount', dataForEdit.insuranceInstallment.installmentAmount);
                }
            }

            {/**Fee */ }
            if (!policyRenewal) {
                setValue('feeReceiverType', dataForEdit.feeReceiverType);
                setValue('feeCalculationType', dataForEdit.feeCalculationType);
                setValue('feePercentage', dataForEdit.feePercentage);
                setValue('vatPercentage', dataForEdit.vatPercentage);
                setValue('incentiveFeePercentage', dataForEdit.incentiveFeePercentage);
                setValue('cost', dataForEdit.cost);
            }

            {/** life insurance */ }
            if (!policyRenewal) {
                setValue('paymentFrequencyType', dataForEdit.paymentFrequencyType);
                setValue('lifeAdjustmentPercent', dataForEdit.lifeAdjustmentPercent);
                setValue('lifeInsuranceYear', dataForEdit.lifeInsuranceYear);
            }

        }
    }, [dataForEdit]);

    const isEditState = watch('id') ? true : false;

    const onSubmit = async () => {
        if (isFirstStep()) {
            try {
                await checkInsuranceNo(watch('id') ?? null, watch('insuranceNo')?.toString() ?? '')
                    .then((res) => {
                        if (res?.data === true) {
                            setError('insuranceNo', {
                                type: 'manual',
                                message: 'شماره بیمه نامه قبلا ثبت شده است'
                            });
                            return;
                        } else {
                            setFormStep(formStep + 1);
                        }
                    })
            } catch (error) { return; toast.error('error'); }
        }
        else if (!isLastStep()) {
            setFormStep(formStep + 1);
        }
        else {
            try {
                await create(methods.watch(), formFieldValues).then((row) => {
                    toast.success('اطلاعات بیمه نامه با موفقیت ثبت شد');
                    getList();
                    reset(defaultValues);
                    setFormStep(0);
                    onCloseDialog?.(false);
                    resetFormFieldValue();
                    setCurrentFormByCategory(null);
                    if (!isEditState) {
                        setInsuranceResponse(row?.data);
                        setShowPaymentDialog(true);
                    }
                });
            } catch (error) { }
        }
    }

    const lastPersonId = useRef<number | null>(null);

    const handlePersonData = useCallback(
        (data: IPersonResponse | null) => {
            if (formData.personId === lastPersonId.current) {
                return;
            }
            lastPersonId.current = formData.personId ?? null;
            if (data) {
                setValue("personMarketerId", data.personMarketerId ?? null);
                setValue("introducerPersonId", data.introducerPersonId ?? null);
            }
        }, [formData.personId, setValue]);

    useEffect(() => {
        if (!watch("personId")) {
            setValue('personMarketerId', null);
            setValue('introducerPersonId', null);
        }
        setFormData({ ...formData, personId: watch("personId"), });
    }, [watch("personId")])


    return (
        <>
            {(showPaymentDialog && insuranceResponse) &&
                <SinglePolicyPaymentDialog
                    open={showPaymentDialog}
                    onClose={() => setShowPaymentDialog(false)}
                    row={insuranceResponse}
                    sideType={InstallmentSideType.Customer}
                />
            }
            <FormProvider {...methods}>
                <Box sx={{ width: '100%' }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Card sx={{
                            bgcolor: "AppWorkspace",
                            borderRadius: 2,
                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'all 0.3s ease',
                            mt: 2
                        }}>
                            <Stepper activeStep={formStep} >
                                {steps.map((item, index) => (
                                    <Step key={index} disabled={true}>
                                        <StepButton onClick={handleStep(index)} optional>
                                            <StepLabel>
                                                <Typography fontSize={14}>
                                                    {item.label}
                                                </Typography>
                                            </StepLabel>
                                        </StepButton>
                                    </Step>
                                ))}
                            </Stepper>
                        </Card>
                        <Card sx={{
                            bgcolor: "AppWorkspace",
                            borderRadius: 2,
                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'all 0.3s ease',
                            mt: 2
                        }}>

                            {steps[formStep].element}

                            <Box sx={{ display: 'flex', justifyContent: isFirstStep() ? 'flex-end' : 'space-between', marginTop: 3 }} >
                                {!isFirstStep() &&
                                    <Button
                                        color='primary'
                                        variant='contained'
                                        type='button'
                                        size='small'
                                        startIcon={<ArrowForward />}
                                        onClick={handleBack}>مرحله قبل</Button>
                                }
                                <Box sx={{ display: 'flex', gap: 1 }} >
                                    {isLastStep() &&
                                        <Button
                                            color='error'
                                            variant='contained'
                                            size='small'
                                            onClick={() => setShowFeeDialog(true)}
                                        >تنظیمات کارمزد</Button>
                                    }

                                    <Button
                                        color='success'
                                        variant='contained'
                                        size='small'
                                        loading={status === 'loading' ? true : false}
                                        type='submit'
                                    >
                                        {!isLastStep() ? 'مرحله بعد' : isEditState ? 'ویرایش اطلاعات' : '  ثبت نهایی'}
                                    </Button>
                                </Box>
                            </Box>
                        </Card>
                    </form>
                </Box>
            </FormProvider>

            {(formStep === 0 && watch('personId') && (watch('personId') ?? 0) > 0) &&
                <>
                    <Grid2 container spacing={2}>
                        <Grid2 size={{ lg: 6, xl: 6 }}>
                            <Card sx={{
                                bgcolor: "AppWorkspace",
                                borderRadius: 2,
                                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.15)'
                                }
                            }}>
                                <Typography component={Divider} mb={1} fontSize={14} fontWeight={500}>اطلاعات شخص</Typography>
                                <CardContent>
                                    <PersonModifier
                                        personId={watch('personId')}
                                        title='اطلاعات مشتری'
                                        setPersonData={(data) => {
                                            handlePersonData(data);
                                        }}
                                    />
                                </CardContent>
                            </Card>
                        </Grid2>

                        <Grid2 size={{ lg: 6, xl: 6 }}>
                            <Card sx={{
                                bgcolor: "AppWorkspace",
                                borderRadius: 2,
                                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.15)'
                                }
                            }}>
                                <Typography component={Divider} mb={1} fontSize={14} fontWeight={500}>مدارک آپلود شده مشتری</Typography>
                                <CardContent>
                                    <AttachmentUploader
                                        entityId={watch('personId') ?? 0}
                                        entityType='person'
                                    />
                                </CardContent>
                            </Card>
                        </Grid2>

                    </Grid2>
                </>
            }

        </>
    )
}
