
import cookie from 'js-cookie';
import { ICurrentUser } from '../types/User';
import { stopOnlineUsersConnection } from './onlineUserService';


const COOKIE_NAME = "XI-Finance-Token";
const SET_EXPIRE_AT = Date.now() + 24 * 60 * 60 * 1000;

const setTokenInCookie = (toke: string) => {
    cookie.set(COOKIE_NAME, toke,
        {
            secure: true,
            expires: SET_EXPIRE_AT,
            sameSite: 'None',
        });
}

const signIn = (user: ICurrentUser, location?: string) => {
    if (typeof window != 'undefined') {
        user.expireAt = SET_EXPIRE_AT;
        cookie.set(COOKIE_NAME, JSON.stringify(user),
            {
                secure: true,
                expires: SET_EXPIRE_AT,
                sameSite: 'None',
            });
        window.location.href = location ?? "/";
    }
}

const signOut = async (location?: string) => {
    if (typeof window !== "undefined") {
        try {
            await stopOnlineUsersConnection();
        } finally {
            cookie.remove(COOKIE_NAME);
            window.location.href = location ?? "/login";
        }
    }
};

const isUserAuthenticate = () => {
    try {
        var currentUser = getCurrentUser();
        if (!currentUser || new Date() > new Date(SET_EXPIRE_AT))
            return false;
        return true
    } catch (error) {
        return false;
    }
}

const getCurrentUser = () => {
    try {
        if (typeof window != 'undefined') {
            var currentUser: ICurrentUser = cookie.get(COOKIE_NAME) ? JSON.parse(cookie.get(COOKIE_NAME) ?? "") : null;
            return currentUser;
        }
    }
    catch (error) {
        return null;
    }
}

const getAccessToken = () => {
    return getCurrentUser()?.token;
}

const getIdsToken = () => {
    if (typeof window != 'undefined') {
        return cookie.get(COOKIE_NAME);
    }
    return "";
}

export {
    signIn,
    signOut,
    isUserAuthenticate,
    getAccessToken,
    getCurrentUser,
    setTokenInCookie,
    getIdsToken
}