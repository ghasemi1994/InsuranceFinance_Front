export interface IPersonResponse {
    id: number
    firstName: string;
    lastName: string;
    phoneNumber: string;
    nationalCode: string;
    personGroupTypeId: PersonGroupType,
    personGroupTypeTitle: string
    homeAddress: string,
    homePostalCode: string,
    fatherName: string,
    dateOfBirth: string | null,
    phoneNumber2: string;
    phoneNumber3: string;
    phoneNumber4: string;
    issuedFrom: string
    certificateNo: string
    introducerPersonId: number | null
    personMarketerId: number | null,
    fullName: string,
    nationalId: string,
    companyName: string;
    ceoFullName: string
    registrationCode?: string,
    economicCode?: string,
    registrationDate?: string | null,
    jobAddress?: string
    isForeigner: boolean
    foreignerCode: string
    walletBalance: number

}

export interface IUpdatePersonRequest {
    id: number | null
    firstName: string;
    lastName: string;
    phoneNumber: string;
    nationalCode: string;
    homeAddress: string,
    homePostalCode: string,
    fatherName: string,
    dateOfBirth: string | null,
    phoneNumber2: string;
    phoneNumber3: string;
    phoneNumber4: string;
    issuedFrom?: string
    certificateNo: string
    isForeigner: boolean
    foreignerCode: string

    personGroupTypeId: PersonGroupType,

    companyName?: string;
    nationalId?: string,
    ceoFullName?: string
    registrationCode?: string,
    economicCode?: string,
    registrationDate?: string | null,
    jobAddress?: string

}

export interface IPersonRequest {
    id?: number | null
    firstName: string;
    lastName: string;
    phoneNumber: string;
    phoneNumber2: string;
    nationalCode: string;
    dateOfBirth: string | null,
    isForeigner: boolean
    foreignerCode: string,
    fatherName: string,
    homeAddress: string,
    homePostalCode: string
    phoneNumber3: string;
    phoneNumber4: string;

    nationalId?: string,
    companyName?: string;
    ceoFullName?: string,
    registrationCode?: string,
    economicCode?: string,
    registrationDate?: string | null,
    jobAddress?: string

    personGroupTypeId: PersonGroupType,

}

export interface IMarketerResponse {
    id: number
    fullName?: string | null
    marketerCode?: string | null
    phoneNumber?: string;
    nationalCode?: string;
    isActive: boolean,
    personId: number
}

export interface IMarketerRequest {
    userId?: number | null
    marketerCode?: string | null,
}

export interface IMarketerDocumentResponse {
    id: number;
    title: string
    fileData: string;
    fileGuid: string;
    fileContentType: string
}

export interface IMarketerDocumenstRequest {
    title: string,
    file: File,
}


export interface IPersonInquiry {
    fullName: string,
    nationalCode: string,
    phoneNumber: string,
    nationalId: string,
    personGroupTypeId: PersonGroupType,
    personGroupTypeTitle: string
}


export enum PersonGroupType {
    Individual = 1,
    Corporate = 2
}