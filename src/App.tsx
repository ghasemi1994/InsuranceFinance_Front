import React from 'react';
import './styles/app.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './config/routes';
import { Toaster } from 'react-hot-toast';
import { PermissionProvider } from './auth/PermissionProvider';
import { useAuthStore } from './stores/authStore';

const App = () => {

  const { userInfo } = useAuthStore();

  return (
    <div className="App">
      <Toaster position='top-center' reverseOrder={false} />
      <PermissionProvider permissions={userInfo?.permissions ?? []}>
        <RouterProvider router={router} />
      </PermissionProvider>
    </div>

  );
}

export default App;
