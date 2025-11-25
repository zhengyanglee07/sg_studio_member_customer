// src/components/LogoutButton.tsx
'use client';

import React, { useContext } from 'react';

import { useRouter } from 'next/navigation';
import { cookies } from 'next/headers';
import "./logout_button.css";
import { LogoutOutlined } from '@ant-design/icons';
import { setEmptyCookie } from './action';

const LogoutButton: React.FC = () => {

  const router = useRouter();

  const handleLogout = async () => {

    localStorage.removeItem(`${process.env.NEXT_PUBLIC_TENANT_HOST}_authToken`);
    
    const response = await setEmptyCookie("");


    if (response.success) {
      console.log("Logout successful");

      // ✅ Delay before redirecting to ensure cookie removal
      // setTimeout(() => {
        window.location.href = "/login"; // ✅ Full page reload to clear cached cookies
      // }, 1000);
    } else {
      console.error("Logout failed");
    }
  };

  return (
    <button onClick={handleLogout} id='logout-btn'>
      <span className='logout-title'>登出</span>
      <LogoutOutlined style={{ color: '#2989C5', fontSize: '20px',paddingLeft: "auto" }} />
    </button>
  );
};

export default LogoutButton;