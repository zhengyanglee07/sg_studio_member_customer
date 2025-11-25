// 


// 將 withAuth 又放回 AuthContext

// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// const withAuth = (WrappedComponent: React.ComponentType) => {
//   const ComponentWithAuth = (props: any) => {
//     const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
//     const router = useRouter();

//     // Function to check if the user is authenticated
//     const checkAuth = async () => {
//       try {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/customer/customer_auth/check`,
//           {
//             method: "GET",
//             credentials: "include",
//           }
//         );
//         const authStatus = response.ok;
//         setIsAuthenticated(authStatus);
//       } catch (error) {
//         console.error("Authentication check failed:", error);
//         setIsAuthenticated(false);
//       }
//     };

//     // Check authentication on component mount
//     useEffect(() => {
//       checkAuth();
//     }, []);

//     // Handle redirection based on isAuthenticated
//     useEffect(() => {
//       if (isAuthenticated === false) {
//         router.push("/login");
//       }
//     }, [isAuthenticated, router]);

//     // Render loading indicator while checking authentication
//     if (isAuthenticated === null) {
//       return <div>Loading...</div>;
//     }

//     // If authenticated, render the wrapped component
//     return <WrappedComponent {...props} />;
//   };

//   return ComponentWithAuth;
// };

// export default withAuth;