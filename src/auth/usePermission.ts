import { useContext } from "react";
import { PermissionContext } from "./PermissionProvider";

export function usePermission() {
    return useContext(PermissionContext);
}