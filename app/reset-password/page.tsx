import React from "react";
import { PasswordResetConfirmation } from "@/components/password-reset-confirmation";

export default function Login() {
  return (
    <div className="mb-6 mt-14 flex flex-col items-center">
        <div className="mb-3 flex space-x-4">
        <PasswordResetConfirmation/>
      </div>
    </div>
  );
}
