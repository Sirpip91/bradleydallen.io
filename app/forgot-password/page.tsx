import React from "react";
import { PasswordResetRequest } from "@/components/password-reset-request";

export default function Login() {
  return (
    <div className="mb-6 mt-14 flex flex-col items-center">
        <div className="mb-3 flex space-x-4">
        <PasswordResetRequest/>
      </div>
    </div>
  );
}
