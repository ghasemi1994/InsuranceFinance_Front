import { icons } from "@/config/mainMenu"


export interface CreatePermissionRequest {
    roleId: number | null,
    resources: Array<string> | [],
    menus: Array<number> | []
}


export interface Resource {
    areaName: string
    controllerDisplayName: string
    value: string
    label: string
    children: Children[]
}

export interface Children {
    id: any
    hasAccess: boolean
    name: string
    value: string,
    label: string
}


export interface MenuResponse {
    id: any;
    name: string;
    path: string;
    parentId: number | null;
    isActive?: boolean;
    icon?: keyof typeof icons;
    displayOrder?: number;
    onlyRoute?: boolean;
    hasAccess?: boolean;
    children?: MenuResponse[];
}

export interface RoleResponse {
    id: number,
    name: string
}