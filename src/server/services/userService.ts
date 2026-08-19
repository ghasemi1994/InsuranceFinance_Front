import { IChangePassword, UpdateUserRequest, UpdateUserRoleRequest } from '@/types/User';
import http from '../http'

const getUserList = async () => {
    const { data } = await http.get(`/finance/api/user/get-user-list`);
    return data;
}

const changeUserActivity = async (id: number) => {
    const { data } = await http.put(`/finance/api/user/change-status/${id}`);
    return data;
}

const changePassword = async (req: IChangePassword) => {
    const { data } = await http.put(`/finance/api/user/change-pass`, req);
    return data;
}

const updateUserRole = async (req: UpdateUserRoleRequest) => {
    const { data } = await http.post('/finance/api/user/update-user-role', req);
    return data;
}

const updateUser = async (req: UpdateUserRequest) => {
    const { data } = await http.put('/finance/api/user/update', req);
    return data;
}

const resetUserPassword = async (userId: number) => {
    const { data } = await http.post(`/finance/api/user/reset-password/${userId}`);
    return data;
}


export {
    getUserList,
    changeUserActivity,
    changePassword,
    updateUserRole,
    updateUser,
    resetUserPassword
}