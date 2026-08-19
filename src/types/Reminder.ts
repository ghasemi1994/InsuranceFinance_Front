import { Tag } from "@/components/common/TemplateEditor";
import { ReminderCategory, SmsDeliveryStatus } from "./Enums";


export interface RejectReminderRequest {
    entityIds: number[],
    category: ReminderCategory
}



export interface SendReminderSmsRequest {
    entityIds: number[],
    category: ReminderCategory,
}


export interface ReminderCategoryResponse {
    reminderCategory: ReminderCategory,
    reminderCategoryTitle: string
    totalCount: number
}


export interface ReminderCategoryDetailResponse {
    reminderCategory: ReminderCategoryResponse,
    entityId: number
    fullName: string
    insuranceCategory: string
    phoneNumber: string,
    description: string,
    nationalCode: string,
    remindDay: number,
    smsDeliveryStatus: SmsDeliveryStatus,
    expireDate: string,
    insuranceNo: string,
    marketer: string,
    introducer: string,
    dueDate: string
}

export interface SMSTemplate {
    tags: Tag[]
    template: string,
}

export interface ReminderDetailResponse {
    details: ReminderCategoryDetailResponse[]
    template: SMSTemplate
}

export interface ISMSReminderTemplate {
    id: number,
    reminderCategory: ReminderCategory,
    reminderCategoryTitle: string,
    template: string,
    jsonTags: string,
    reminderRuleConfig: string
}

export interface ReminderRuleRequest {
    birthdayConfigRule?: BirthdayConfigRule,
    renewConfigRule?: RenewConfigRule[],
    installmentConfigRule?: InstallmentConfigRule[]

    reminderCategory: ReminderCategory,
    SMSReminderTemplateId: number,
    repetition: number

}

export interface BirthdayConfigRule {
    sendTimeReminder: SendTimeReminder,
    reminderChannelType: ReminderChannelType,
    reminderAutoSend: boolean,
    time: string
}

export interface RenewConfigRule {
    sendTimeReminder: SendTimeReminder,
    reminderChannelType: ReminderChannelType,
    reminderAutoSend: boolean,
    time: string,
}

export interface InstallmentConfigRule {
    sendTimeReminder: SendTimeReminder,
    reminderChannelType: ReminderChannelType,
    reminderAutoSend: boolean,
    time: string
}

export enum SendTimeReminder {
    CurrentDay,
    ADayBefore,
    TowDayBefore,
    ThreeDayBefore,
    FourDayBefore,
    FiveDayBefore,
    SixDayBefore,
    SevenDayBefore,
    EightDayBefore,
    NineDayBefore,
    TenDayBefore,
    Expired = -1,
}

export enum ReminderChannelType {
    SMS = 1,
    WhatsApp = 2,
    Bale = 3
}



