// 原初建立的 withAuth

// 不是太能夠運作, 更改當中的邏輯, 直接在這裏向 backend 查詢


// // src/components/withAuth.tsx
// "use client";

// import React, { useContext, useEffect } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import { useRouter } from 'next/navigation';

// const withAuth = (WrappedComponent: React.ComponentType) => {
//   const ComponentWithAuth = (props: any) => {
//     const authContext = useContext(AuthContext);
//     const router = useRouter();

//     console.log('withAuth running');


//     useEffect(() => {
//       if (!authContext?.isAuthenticated) {
//         console.log('withAuth Not authenticated');
        
//         router.push('/login');
//       }
//     }, [authContext, router]);

//     if (!authContext?.isAuthenticated) {
//       console.log('withAuth authenticated');
//       return null; // Or a loading indicator
//     }

//     return <WrappedComponent {...props} />;
//   };

//   return ComponentWithAuth;
// };

// export default withAuth;