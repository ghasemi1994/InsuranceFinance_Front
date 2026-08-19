import React, { useEffect, useState } from 'react'
import { getFormByCategoryId } from '../../../server/services/formService'
import { Skeleton } from '@mui/material';
import FormCreator from '../../form/builder/FormBuilder';
import { useFormStore } from '../../../stores/formStore';
import { useFormContext } from 'react-hook-form';
import { getFormWithValueByPolicyId } from '../../../server/services/insuranceService';


interface InsuranceFormStepProps {
    policyRenewal: boolean
    policyId?: number
}

/**فرم بیمه */
export default function InsuranceFormStep({ policyRenewal, policyId }: InsuranceFormStepProps) {

    const { resetFormFieldValue, setCurrentFormByCategory, currentFormByCategory } = useFormStore();
    const [loading, setLoading] = useState(false);
    const { watch, setValue } = useFormContext();

    useEffect(() => {
        getById();
    }, [])

    const getById = async () => {
        try {

            const categoryId = watch('categoryId');

            if (!categoryId) return;

            // اگر از قبل فرم همین categoryId لود شده، درخواست نده
            // و در حالت ویرایش نباشیم
            if (currentFormByCategory?.categoryId === categoryId && !policyId && !policyRenewal) {
                setValue('formId', currentFormByCategory?.id);
                return;
            }

            setLoading(true);

            let response;
            if (!policyId) {
                // حالت غیر ویرایش
                response = await getFormByCategoryId(categoryId);
            } else {
                // حالت ویرایش
                response = await getFormWithValueByPolicyId(policyId);
            }

            if (response?.data) {
                setCurrentFormByCategory(response.data);
                setValue('formId', response.data.id);
            } else {
                setValue('formId', null);
                resetFormFieldValue();
                setCurrentFormByCategory(null);
            }
        } catch (error) {
            console.error(error);
            setCurrentFormByCategory(null);
        } finally {
            setLoading(false);

        }
    };

    const editable = policyId && policyId > 0;

    const LoadingForm = () => {
        return (
            <>
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
            </>
        )
    }

    return (
        <>
            {
                loading ? <LoadingForm /> : <FormCreator
                    form={currentFormByCategory || null}
                    formState={editable ? 'update' : 'create'}
                />
            }
        </>
    )
}
