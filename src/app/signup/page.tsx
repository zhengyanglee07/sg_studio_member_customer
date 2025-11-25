// src/app/signup/page.tsx

import React, { Suspense } from 'react';
import SignupPage  from './SignupPage';



const Page = () => {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <SignupPage />
      </Suspense>
    );
  };
  
  export default Page;