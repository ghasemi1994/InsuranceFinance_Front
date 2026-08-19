import { useInsurancePolicyStore } from "@/stores/insurancePolicyStore";
import { FeeCalculationType, FeeReceiverType, InsuranceTermType, ObligatedToPayType, PaymentType } from "@/types/Enums";
import { IInsurancePolicyRequest, PrePaymentType } from "@/types/Insurance";
import { toPersianDate } from "@/utils/convertion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from 'zod';




export function useInsurancePolicyManagement() {

    const defaultValues: IInsurancePolicyRequest = {
        currentPolicyRenewalId: null,
        id: null,
        obligatedToPayType: ObligatedToPayType.Customer,
        issueDate: toPersianDate(new Date()),
        insuranceStartDate: toPersianDate(new Date()),
        insuranceTermTypeId: InsuranceTermType.Monthly,
        insuranceTermValue: 12,
        paymentType: PaymentType.Cash,
        insurancePaymentType: PaymentType.Cash,
        hasRenewalReminder: true,
        renewalReminderDay: 3,
        formFieldValues: [],
        formId: null,
        discountAmount: 0,
        insuranceNo: '',

        feeReceiverType: FeeReceiverType.Marketer,
        feeCalculationType: FeeCalculationType.Default,
        feePercentage: 0,
        vatPercentage: 10,
        cost: 0,
        incentiveFeePercentage: 0,

        lifeAdjustmentPercent: 0,
        lifeInsuranceYear: 0,
        paymentFrequencyType: null,

        customerSideInstallment: {
            prePaymentType: PrePaymentType.Percentage,
            prePaymentValue: 30,
            prePaymentStartDate: toPersianDate(new Date()),
            installmentStartDate: toPersianDate(new Date()),
            installmentCount: 5,
            intervalBetweenInstalment: 1,
        },
        insuranceSideInstallment: {
            prePaymentType: PrePaymentType.Percentage,
            prePaymentValue: 30,
            prePaymentStartDate: toPersianDate(new Date()),
            installmentCount: 5,
            intervalBetweenInstalment: 1,
            installmentStartDate: toPersianDate(new Date()),
        }
    }

    
    const insurerStepSchema = z.object({
        personId: z.number('انتخاب مشتری الزامی است').min(1, "انتخاب مشتری الزامی است"),
        personMarketerId: z.number('انتخاب بازاریاب الزامی است').min(1, "انتخاب بازاریاب الزامی است"),
        introducerPersonId: z.number().nullable(),
        insuranceNo: z.string().min(5, 'شماره بیمه نامه الزامی است'),
    }) satisfies z.ZodType<Partial<IInsurancePolicyRequest>>;

    const insurancePolicyStepSchema = z.object({
        categoryId: z.number('دسته بندی / بیمه الزامی است').min(1, " دسته بندی / بیمه الزامی است"),
        companyId: z.number('بیمه گر (شرکت بیمه) الزامی است').min(1, " بیمه گر (شرکت بیمه) الزامی است"),
        insuranceCompanyAgencyId_IssueUnit: z.number('واحد صدور الزامی است').min(1, "واحد صدور الزامی است"),
        uniqueCode: z.number('کد یکتا الزامی است')
            .nullable()
            .refine((val) => val === null || val.toString().length === 11, 'کد یکتا بیمه نامه باید 11 رقم باشد')
            .optional(),
        insuranceTermValue: z.number('فیلد اجباری است').min(1, 'فیلد اجباری است'),
        insuranceTermTypeId: z.number('فيلد اجباری است'),
        issueDate: z.string('فیلد اجباری است'),
        insuranceStartDate: z.string('فیلد اجباری'),
        hasRenewalReminder: z.boolean().optional(),
        renewalReminderDay: z.number('فیلد اجباری است').min(1, 'فیلد اجباری است'),
    }) satisfies z.ZodType<Partial<IInsurancePolicyRequest>>;

    const insuranceFormStepSchema = z.object({

    }) satisfies z.ZodType<Partial<IInsurancePolicyRequest>>;

    const financeStepSchema = z.object({
        totalAmount: z.number('فیلد اجباری است').min(0, 'مبلغ بیمه نامه صحیح نیست'),
        discountAmount: z.number().optional(),
        obligatedToPayType: z.number('فيلد اجباری است'),
        paymentType: z.number('فيلد اجباری است'),
        insurancePaymentType: z.number('فيلد اجباری است'),


    }) satisfies z.ZodType<Partial<IInsurancePolicyRequest>>;

    const stepSchemas = [
        insurerStepSchema.pick({
            personId: true,
            personMarketerId: true,
            introducerPersonId: true,
            insuranceNo: true,
        }),
        insurancePolicyStepSchema.pick({
            categoryId: true,
            companyId: true,
            insuranceCompanyAgencyId_IssueUnit: true,
            uniqueCode: true,
            insuranceTermTypeId: true,
            insuranceTermValue: true,
            issueDate: true,
            insuranceStartDate: true,
            hasRenewalReminder: true,
            renewalReminderDay: true,
        }),
        insuranceFormStepSchema.pick({

        }),
        financeStepSchema.pick({
            totalAmount: true,
            discountAmount: true,
            obligatedToPayType: true,
            paymentType: true,
            insurancePaymentType: true,
        }),
    ];

    const {
        formStep,
        setFormStep,
        create,
        status,
        getList,
        setFormData,
        formData,
        setDataForEdit
    } = useInsurancePolicyStore();


    const methods = useForm<IInsurancePolicyRequest>({
        defaultValues: defaultValues,
        resolver: zodResolver(stepSchemas[formStep] as any),
        mode: 'onTouched'
    });



    return {
        methods,
        defaultValues,
        setDataForEdit,
        setFormStep,
        create,
        status,
        getList,
        setFormData,
        formData,
        formStep
    }
}