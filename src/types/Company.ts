export interface ICompanyRequest {
    id: number | null,
    name: string | null,
    isActive: boolean,
    logo: File | null,
    code: string | null
    description: string | null
}


export interface ICompanyResponse {
    id: number,
    name: string,
    logoUrl: string,
    isActive: boolean,
    code: string | null
    description: string | null
}

export interface ICompanyAgencyRequest {
    id?: number | null
    personId: number | null,
    companyId: number,
    code: string | null,
}

export interface ICompanyAgencyBankAccountRequest {
    id: number | null
    companyAgencyId: number | null,
    bankId: number | null,
    accountNumber: string | null,
    cardNumber: string | null,
    shebaNumber: string | null,
    branch: string | null,
    accountOwner: string | null
}

export interface ICompanyAgencyBankAccountResponse {
    id: number | null
    companyAgencyId: number | null,
    bankId: number | null,
    accountNumber: string | null,
    cardNumber: string | null,
    shebaNumber: string | null,
    branch: string | null,
    bankName: string | null
}


export interface ICompanyAgencyResponse {
    id: number
    fullName: string,
    nationalCode: string,
    phoneNumber: string
    code: string | null
    bankId: number | null,
    accountNumber: string | null,
    cardNumber: string | null,
    shebaNumber: string | null
    personId: number | null,
}

