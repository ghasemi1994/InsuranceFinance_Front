
import http from '../http';
import { ILoginRequest } from '../../types/User';


const getToken = async (request: ILoginRequest) => {
    const { data } = await http.post('/finance/api/account/authenticate', request);
    return data;
}

const getUserInfo = async () => {
    const { data } = await http.get('/finance/api/account/get-current-user');
    return data;
}

export {
    getToken,
    getUserInfo
}
