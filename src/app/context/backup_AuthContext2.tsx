// checkAuth 存在於這個檔案中


// 想將 checkAuth 獨立出來


// // src/app/context/AuthContext.tsx

// 'use client';

// import React, { createContext, useState, useEffect } from 'react';
// import usePreventDoubleFetch from '../components/usePreventDoubleFetch';


// interface AuthContextType {
//   isAuthenticated: boolean;
//   login: () => void;
//   logout: () => void;
//   checkAuth: () => void;
// }

// export const AuthContext = createContext<AuthContextType | null>(null);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const shouldFetch = usePreventDoubleFetch();

//   console.log('AuthProvider running');

//   // Function to check if the user is authenticated
//   const checkAuth = async () => {
//     if (!shouldFetch()) {
//       return;
//     }

//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/customer_auth/check`, {
//       method: 'GET',
//       credentials: 'include',
//     });
//     setIsAuthenticated(response.ok);
//   };

//   // Call checkAuth on component mount to verify authentication status
//   useEffect(() => {
//     if (!shouldFetch()) {
//       return;
//     }

//     console.log('AuthProvider checkAuth running');
//     checkAuth();
//   }, []);

//   const login = () => {
//     if (!shouldFetch()) {
//       return;
//     }
//     console.log('AuthProvider login running');
//     setIsAuthenticated(true);
//   };

//   const logout = async () => {
//     if (!shouldFetch()) {
//       return;
//     }
    
//     console.log('AuthProvider logout running');
//     await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/customer_auth/logout`, {
//       method: 'POST',
//       credentials: 'include',
//     });
//     setIsAuthenticated(false);
//     // Optionally redirect the user to the login page
//   };

//   return (
//     // <AuthContext.Provider value={{ isAuthenticated, login, logout, checkAuth }}>
//       <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };