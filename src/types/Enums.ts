
/**نوع سررسید */
export enum DueType {
    All,
    Cash,
    Installment,
    Debt,
    Endorsement
}

/**نوع پرداخت */
export enum PaymentType {
    Cash = 1,
    Installment = 2
}

export enum InsuranceTermType {
    Monthly = 1,
    Daily = 2
}


/**متعهد پرداخت */
export enum ObligatedToPayType {
    Customer = 1,
    Marketer = 2,
    IntroducerOrGarantor = 3
}

export enum FeeReceiverType {
    Customer = 1,
    Marketer = 2,
    IntroducerOrGarantor = 3
}

export enum FeeCalculationType {
    Default = 1,
    Customized = 2
}


export type FormState = 'create' | 'update'


export enum ReminderCategory {
    Renew = 1,
    Installment = 2,
    Birthday = 3
}

export enum SmsDeliveryStatus {  
    None,    
    Sent,
    Delivered,
    Undelivered
}