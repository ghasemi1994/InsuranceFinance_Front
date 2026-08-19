class PermissionService {

    private permissions =
        new Set<string>();

    initialize(
        permissions: string[]
    ) {
        this.permissions =
            new Set(permissions);
    }

    has(permission: string) {
        return this.permissions.has(
            permission
        );
    }
}

export const permissionService =
    new PermissionService();