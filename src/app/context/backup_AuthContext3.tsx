// 完成 checkAuth 獨立出來


// // src/app/context/AuthContext.tsx

// 'use client';

// import React, { createContext, useState, useEffect } from 'react';

// interface AuthContextType {
//   isAuthenticated: boolean;
//   login: () => void;
//   logout: () => void;
// }

// export const AuthContext = createContext<AuthContextType | null>(null);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   console.log('AuthProvider running');

//   const checkAuth = async () => {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/customer_auth/check`, {
//       method: 'GET',
//       credentials: 'include',
//     });
//     setIsAuthenticated(response.ok);
//   };

//   useEffect(() => {
//     console.log('AuthProvider checkAuth running');
//     checkAuth();
//   }, []);

//   const login = () => {
//     console.log('AuthProvider login running');
//     setIsAuthenticated(true);
//   };

//   const logout = async () => {
//     console.log('AuthProvider logout running');
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