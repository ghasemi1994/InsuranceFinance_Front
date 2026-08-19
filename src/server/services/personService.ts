
import { IMarketerRequest, IPersonRequest, IUpdatePersonRequest, PersonGroupType } from '../../types/Person';
import http from '../http';


const getPersonList = async (
    nationalCode: string,
    phoneNumber: string,
    fullName: string,
    id: number | null,
    groupType: PersonGroupType | null
) => {
    const params = {
        ...(nationalCode && { nationalCode }),
        ...(phoneNumber && { phoneNumber }),
        ...(fullName && { fullName }),
        ...(id && { id }),
        ...(groupType !== null && { groupType })
    };

    const { data } = await http.get('/finance/api/person/get-list', { params });
    return data;
};

const getPersonById = async (id: number) => {
    const { data } = await http.get(`/finance/api/person/get/${id}`);
    return data;
}

const updatePerson = async (request: IPersonRequest) => {
    const { data } = await http.put('/finance/api/person/update', request);
    return data;
}

const updatePersonApi = async (request: IUpdatePersonRequest) => {
    const { data } = await http.put('/finance/api/person/update', request);
    return data;
}

const createPerson = async (request: IPersonRequest) => {
    const { data } = await http.post('/finance/api/person/create', request);
    return data;
}

const getMarketerList = async () => {
    const { data } = await http.get('/finance/api/marketer/get-marketer-list');
    return data;
}

const createMarketer = async (model: IMarketerRequest) => {
    const { data } = await http.post('/finance/api/marketer/create-marketer', model);
    return data;
}

const deleteMarketr = async (id: number) => {
    const { data } = await http.delete(`/finance/api/marketer/delete-marketer/${id}`);
    return data;
}

const toggleActivation = async (id: number) => {
    const { data } = await http.put(`/finance/api/marketer/change-marketer-activation/${id}`);
    return data;
}

const getPersonByPhoneNumber = async (phoneNumber: string) => {
    const { data } = await http.get(`/finance/api/person/inquiry/${phoneNumber}`);
    return data;
}

const deletePerson = async (id: number) => {
    const { data } = await http.delete(`/finance/api/person/delete/${id}`);
    return data;
}


export {
    getPersonList,
    updatePerson,
    getMarketerList,
    createPerson,
    createMarketer,
    deleteMarketr,
    getPersonById,
    updatePersonApi,
    getPersonByPhoneNumber,
    toggleActivation,
    deletePerson
}