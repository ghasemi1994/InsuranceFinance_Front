import http from '../http'


const getOnlineUserCount = async () => {
    const { data } = await http.get('/api/online-users/count');
    return data;
}


export {
    getOnlineUserCount
}


