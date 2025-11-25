// // 'use server';

// import { AuthContext } from '@/app/context/AuthContext';
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
// import { useContext, useEffect } from 'react';
// // import jwt from 'jsonwebtoken';
// import * as jose from 'jose'


// export const config = {
//   matcher: '/((?!login).*)',
// }

// export function middleware(request: NextRequest) {
//   const requestHeaders = new Headers(request.headers)

//   // const authContext = useContext(AuthContext);
//   // useEffect(() => {
//     // console.log('authContext:', authContext?.isAuthenticated);
//     // if (authContext?.isAuthenticated === false) {
//     //   console.log('redirect:');
//     //   return NextResponse.redirect(new URL('/', request.url));
//     // }
//   // }, [authContext]);
//   let token = request.cookies.get('token');
//   console.log('token:', token);
  
//   if (token == undefined || !jose.jwtVerify(token.value, new TextEncoder().encode(process.env.JWT_SECRET!))) {
//     console.log('redirect');
//   // if (!jwt.verify(token, process.env.JWT_SECRET)) {
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

//   // You can also set request headers in NextResponse.next
//   const response = NextResponse.next({
//     request: {
//       // New request headers
//       headers: requestHeaders,
//     },
//   })

//   return response
// }
