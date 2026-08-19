

export interface IBankAccount {
    id: number | null
    bankId: number | null
    bankName?: string | null
    branchName: string | null
    accountNumber: number | null,
    shebaNumber: string | null,
    ownerAccountName: string | null
    cardNumber: string | null
    isActive: boolean
}
