import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import React from 'react';

const SignoutCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/'); // یا مسیر پیش‌فرض پس از خروج
  }, [navigate]);

  return <div>در حال تکمیل فرآیند خروج...</div>;
};

export default SignoutCallbackPage;