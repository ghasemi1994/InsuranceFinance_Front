export interface PermissionContextValue {
    permissions: Set<string>;

    hasPermission(permission: string): boolean;

    hasAnyPermission(
        permissions: string[]
    ): boolean;

    hasAllPermissions(
        permissions: string[]
    ): boolean;
}