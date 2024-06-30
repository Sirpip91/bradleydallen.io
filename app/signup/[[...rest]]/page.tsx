'use client'

import { SignUp } from "@clerk/nextjs";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton, } from '@clerk/nextjs'
import { dark } from "@clerk/themes";

export default async function signupPage() {
  return (
    <div className="flex items-center justify-center flex-col gap-10 pt-28 ">
          
           <SignUp appearance={{
          
           }}></SignUp>
    </div>
  );
}
