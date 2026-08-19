import React from 'react'
import {
    createContext,
    useMemo
} from "react";


import { PermissionContextValue } from "./types";

export const PermissionContext =
    createContext<PermissionContextValue>(
        null!
    );

interface Props {
    children: React.ReactNode;
    permissions: string[];
}

export function PermissionProvider({
    children,
    permissions
}: Props) {
    const permissionSet = useMemo(
        () => new Set(permissions),
        [permissions]
    );

    const value = useMemo(
        (): PermissionContextValue => ({
            permissions: permissionSet,

            hasPermission(permission) {
                return permissionSet.has(permission);
            },

            hasAnyPermission(permissions) {
                return permissions.some(x =>
                    permissionSet.has(x)
                );
            },

            hasAllPermissions(permissions) {
                return permissions.every(x =>
                    permissionSet.has(x)
                );
            }
        }),
        [permissionSet]
    );

    return (
        <PermissionContext.Provider value={value}>
            {children}
        </PermissionContext.Provider>
    );
}