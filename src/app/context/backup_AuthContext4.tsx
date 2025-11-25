// 用 middleware 來處理登入登出


// // src/app/context/AuthContext.tsx

// 'use client';

// import React, { createContext, useState, useEffect, ReactNode } from 'react';

// interface AuthContextType {
//   isAuthenticated: boolean | null;
//   login: () => void;
//   logout: () => void;
// }

// export const AuthContext = createContext<AuthContextType | null>(null);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

//   const checkAuth = async () => {
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/customer_auth/check`, {
//         method: 'GET',
//         credentials: 'include',
//       });
//       console.log('response', response);
//       setIsAuthenticated(response.ok);
//     } catch (error) {
//       console.error('Error checking authentication:', error);
//       setIsAuthenticated(false);
//     }
//   };

//   useEffect(() => {
//     checkAuth();
//   }, []);

//   const login = () => {
//     setIsAuthenticated(true);
//   };

//   const logout = async () => {
//     await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/customer_auth/logout`, {
//       method: 'POST',
//       credentials: 'include',
//     });
//     setIsAuthenticated(false);
//   };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };