import PrivacyPolicy from "@/components/privacy-policy";
import React from "react";

export default function Login() {
  return (
    <div className="mb-6 mt-14 flex flex-col items-center">
        <div className="mb-3 flex space-x-4">
            <PrivacyPolicy/>
      </div>
    </div>
  );
}
