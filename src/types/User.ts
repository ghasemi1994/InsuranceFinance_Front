import { ReactNode } from "react"

export interface ILoginRequest {
    userName: string
    password: string
}

export interface ICurrentUser {
    fullName: string
    token: string
    expireAt?: number
}

export interface IUserInfo {
    fullName: string;
    profileImage: string;
    userName: string
    userTypeId: number,
    organizationName: string,
    ceoFullName: string,
    organizationPersonId: number,
    needToChangePassword: boolean,
    roleName: string,
    permissions: string[]
}

export interface IUserResponse {
    id: number,
    fullName: string,
    userName: string,
    phoneNumber: string,
    isActive: boolean,
    roleIds: Array<number>,
    firstName: string,
    lastName: string,
    officeBranchId: number | null,
    roleNames: string,
    officeBranchName: string
}


export interface IChangePassword {
    currentPassword: string | null,
    newPassword: string | null,
    confirmNewPassword: string | null
}

export interface UpdateUserRoleRequest {
    userId: number | null,
    roleIds: Array<number> | null
}

export interface UpdateUserRequest {
    id: number
    userName: string
    phoneNumber: string
    userRoles: Array<number>
    firstName: string,
    lastName: string,
    officeBranchId: number | null
}