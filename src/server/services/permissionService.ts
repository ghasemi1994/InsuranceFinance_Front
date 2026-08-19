import { CreatePermissionRequest } from '@/types/PermissionTypes';
import http from '../http';


const getPermissionByRoleId = async (roleId: number) => {
    const { data } = await http.get(`/finance/api/permission/get-permission?roleId=${roleId}`);
    return data
}


const getRoleList = async () => {
    const { data } = await http.get('/finance/api/permission/get-role-list');
    return data
}


const createPermission = async (req: CreatePermissionRequest) => {
    const { data } = await http.post('/finance/api/permission/create-permission', req);
    return data
}

const getUserMenuList = async () => {
    const { data } = await http.get('/finance/api/permission/get-user-menu-list');
    return data
}

export {
    getPermissionByRoleId,
    getRoleList,
    createPermission,
    getUserMenuList
}