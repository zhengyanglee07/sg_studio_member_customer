// 用 middleware 來處理登入登出


// // src/components/withAuth.tsx
// 'use client';

// import React, { useContext, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { AuthContext } from '../context/backup_AuthContext4';

// const withAuth = (WrappedComponent: React.ComponentType) => {
//   const ComponentWithAuth: React.FC = (props) => {
//     const authContext = useContext(AuthContext);
//     const router = useRouter();

//     // useEffect(() => {
//       console.log('authContext:', authContext?.isAuthenticated);
//       if (authContext?.isAuthenticated === false) {
//         console.log('redirect:');
//         router.replace('/login');
//       }
//     // }, [authContext, router]);
//     console.log('authContext2222:', authContext?.isAuthenticated);

//     if (authContext?.isAuthenticated === null) {
//       return <div>Loading...</div>; // Show a loading indicator while checking auth
//     }

//     return <WrappedComponent {...props} />;
//   };

//   return ComponentWithAuth;
// };

// export default withAuth;