

export interface BranchResponse {
    id: number;
    name: string;
    code: string;
    address: string;
    managerUserId: number | null;
    managerFullName: string;
}

export interface CreateBranchRequest {
    name: string | null;
    code: string | null;
    address: string | null;
    managerUserId?: number | null;
}



export interface UpdateBranchRequest {
    id: number
    name: string | null;
    code: string | null;
    address: string | null;
    managerUserId?: number | null;
}

export interface BranchStaffResponse {
    id: number;
    userId: number;
    fullName: string;
    phoneNumber: string;
}

export interface CreateBranchStaffRequest {
    userId: number | null;
    officeBranchId: number | null;
}