      
'use'

import { SignUp } from "@clerk/nextjs";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export default async function signupPage() {
  return (
    <div className="flex items-center justify-center flex-col gap-10 pt-28">
          
           <SignUp></SignUp>
    </div>
  );
}
