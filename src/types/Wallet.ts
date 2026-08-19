


export enum DepositMethodType {
    TransferToInsuranceCompanyAccount = 1,
    BankTransfer = 2,
    Cash = 3,
    Cheque = 4,
    Wallet = 6,
    Agency = 7,
}

export interface DepositRequest {
    depositMethodType: DepositMethodType | null;
    amount: number | null;
    paymentDate: string | null;
    targetBankAccountId: number | null;
    transactionId: string | null;
    receivedBy: string | null;
    chequeDueDate: string | null;
    chequeBankName: string | null;
    chequeNumber: string | null;
    chequeAccountNumber: string | null;
    chequeAccountOwner: string | null;
    description: string | null;
    companyAgencyBankAccountId: number | null
    files: File[] | null
}

export interface WalletTransactionResponse {
    id: number;
    amount: number;
    transactionType: WalletTransactionType;
    transactionTypeTitle: string;
    transactionStatus: WalletTransactionStatus;
    transactionStatusTitle: string;
    comment: string;
    createdDate: string,
    currentWalletBalance: number
}


export interface DepositWallet {
    personId: number | null,
    depositRequest: DepositRequest | null
}


export enum WalletTransactionType {
    Deposit = 1,
    Withdraw = 2,
    Transfer = 3,
    return = 4
}
export enum WalletTransactionStatus {
    Pending = 1,
    Completed = 2,
    Failed = 3,
    Reversed = 4
}


