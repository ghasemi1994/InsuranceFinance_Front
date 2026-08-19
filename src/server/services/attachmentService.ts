import { IAttachmentTypeRequest } from '../../types/Attachment';
import http from '../http';


const getAttachmentTypeList = async () => {
    const { data } = await http.get('/finance/api/attachment/get-type-list');
    return data
}

const getAttachmentTypeByEntityList = async (entity: string) => {
    const { data } = await http.get(`/finance/api/attachment/get-type-list/${entity}`);
    return data
}

const createAttachmentType = async (req: IAttachmentTypeRequest) => {
    const { data } = await http.post('/finance/api/attachment/create-type', req);
    return data
}
const updateAttachmentType = async (req: IAttachmentTypeRequest) => {
    const { data } = await http.put('/finance/api/attachment/update-type', req);
    return data
}

const changeAttachmentTypeStatus = async (id: number) => {
    const { data } = await http.put(`/finance/api/attachment/change-type-status/${id}`);
    return data;
}

const uploadAttachmentFile = async (formData: FormData) => {
    const { data } = await http.post('/finance/api/attachment/upload-file', formData);
    return data
}

const getAttachmentListByEntity = async (entityType: string, entityId: number) => {
    const { data } = await http.get(`/finance/api/attachment/get-attachment-list/${entityId}?entityType=${entityType}`);
    return data
}

const deleteAttachment = async (id: number, accessKey: string) => {
    const { data } = await http.delete(`/finance/api/attachment/delete-attachment/${id}?accessKey=${accessKey}`);
    return data;
}

export {
    getAttachmentTypeList,
    getAttachmentTypeByEntityList,
    createAttachmentType,
    updateAttachmentType,
    changeAttachmentTypeStatus,
    uploadAttachmentFile,
    getAttachmentListByEntity,
    deleteAttachment
}