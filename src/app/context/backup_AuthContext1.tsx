// 最原初有基本login功能，但無法設置Cookies

// 想做到可以成功設置Cookies，同時refresh畫面及多開頁面仍然保持登入狀態

// // src/context/AuthContext.tsx
// 'use client';

// import React, { createContext, useState, useEffect, ReactNode } from 'react';
// import Cookies from 'js-cookie';

// interface User {
//   token: string;
// }

// interface AuthContextType {
//   user: User | null;
//   isAuthenticated: boolean;
//   login: (token: string) => void;
//   logout: () => void;
// }

// export const AuthContext = createContext<AuthContextType | null>(null);

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     const token = Cookies.get('token');
//     if (token) {
//       setUser({ token });
//     }
//   }, []);

//   const login = (token: string) => {
//     Cookies.set('token', token);
//     setUser({ token });
//   };

//   const logout = () => {
//     Cookies.remove('token');
//     setUser(null);
//   };

//   const isAuthenticated = !!user;

//   return (
//     <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };