import React from "react";
import LoginForm from "@/components/SignUpForm";
import UserProfile from "@/components/UserProfile";

export default function User() {
  return (
    <div className="container max-w-6xl py-6 lg:py-10">
    <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-x-4">
          <h1 className="inline-block font-black text-4xl lg:text-5xl">
            Profile Information
          </h1>
        </div>
      </div>
      <hr className="my-8" />
      <UserProfile />
    </div>
  );
}