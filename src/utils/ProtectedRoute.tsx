import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { isUserAuthenticate } from './userAuthenticate';


export default function ProtectedRoute() {
    if (!isUserAuthenticate())
        return <Navigate to="/login" replace />
    return <Outlet />
}


// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import { useAuth } from 'react-oidc-context';

// export default function ProtectedRoute() {
//     const auth = useAuth();
//     // در حال بارگذاری
//     if (auth.isLoading) {
//         return <div>در حال بارگذاری...</div>;
//     }

//     // خطا در احراز هویت
//     if (auth.error) {
//         console.log(auth.error);
//         return <div>خطا در احراز هویت: {auth.error.message}</div>;
//     }

//     // کاربر لاگین نکرده
//     if (!auth.isAuthenticated) {
//         //return <Navigate to="/login" replace />;
//         auth.signinRedirect()
//     }

//     // کاربر معتبر
//     return <Outlet />;
// }