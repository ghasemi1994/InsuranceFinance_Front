import { usePermission } from "./usePermission";

interface Props {
    permission?: string;
    any?: string[];
    all?: string[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function Can({
    permission,
    any,
    all,
    children,
    fallback = null
}: Props) {
    const permissionService = usePermission();

    let allowed = false;

    if (permission)
        allowed =
            permissionService.hasPermission(
                permission
            );

    if (any)
        allowed =
            permissionService.hasAnyPermission(
                any
            );

    if (all)
        allowed =
            permissionService.hasAllPermissions(
                all
            );

    return allowed
        ? children
        : fallback;
}