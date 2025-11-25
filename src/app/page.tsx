// src/app/page.tsx
'use client';

import React, { useContext, useEffect } from 'react';
import { redirect } from 'next/navigation';
// import { AuthContext } from './context/AuthContext';
// import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {

  redirect('/login');

}