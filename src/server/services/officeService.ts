import { CreateBranchRequest, CreateBranchStaffRequest, UpdateBranchRequest } from '@/types/OfficeTypes';
import http from '../http'


const getBranchList = async () => {
    const { data } = await http.get('/finance/api/office/get-branch-list');
    return data;
}

const createBranch = async (req: CreateBranchRequest) => {
    const { data } = await http.post('/finance/api/office/create-office-branch', req);
    return data;
}

const updateBranch = async (req: UpdateBranchRequest) => {
    const { data } = await http.put('/finance/api/office/update-office-branch', req);
    return data;
}

const createBranchStaff = async (req: CreateBranchStaffRequest) => {
    const { data } = await http.post('/finance/api/office/create-branch-staff', req);
    return data;
}

const getBranchStaffList = async (branchId: number) => {
    const { data } = await http.get(`/finance/api/office/get-staff-list/${branchId}`);
    return data;
}

const deleteBranchStaff = async (id: number) => {
    const { data } = await http.delete(`/finance/api/office/delete-branch-staff/${id}`);
    return data;
}


export {
    getBranchList,
    createBranch,
    createBranchStaff,
    getBranchStaffList,
    deleteBranchStaff,
    updateBranch
}