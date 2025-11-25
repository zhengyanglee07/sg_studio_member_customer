// 用 middleware 來處理登入登出


// // src/components/ProtectedRoute.tsx
// "use client";

// import React, { useContext, useEffect } from 'react';
// import { AuthContext } from '../context/backup_AuthContext4';
// import { useRouter } from 'next/navigation';

// export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
//   const authContext = useContext(AuthContext);
//   const router = useRouter();

//   useEffect(() => {
//     if (!authContext?.isAuthenticated) {
//       router.push('/login');
//     }
//   }, [authContext, router]);

//   if (!authContext?.isAuthenticated) {
//     return null; // Or display a loading indicator
//   }

//   return <>{children}</>;
// }