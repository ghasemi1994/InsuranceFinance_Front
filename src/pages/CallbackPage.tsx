import { useAuth } from 'react-oidc-context';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { setTokenInCookie } from '../utils/userAuthenticate';

const CallbackPage = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (!auth.isLoading && !auth.error) {
            setTokenInCookie(auth.user?.access_token ?? '');
            // کاربر با موفقیت وارد شده
            navigate('/'); // یا مسیر پیش‌فرض پس از ورود
        }
    }, [auth.isLoading, auth.error, navigate, auth.user?.access_token]);

    if (auth.isLoading) {
        return <div>در حال تکمیل فرآیند ورود...</div>;
    }

    if (auth.error) {
        return (
            <div>
                خطا در ورود: {auth.error.message}
                <button onClick={() => auth.signinRedirect()}>بازگشت به صفحه ورود</button>
            </div>
        );
    }

    return <></>;
};

export default CallbackPage;