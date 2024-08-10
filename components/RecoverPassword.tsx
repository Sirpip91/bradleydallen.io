"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import toast, { Toaster } from "react-hot-toast";

export default function RecoverPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      console.error("Password reset error:", error);
      toast.error("Failed to send password reset email. Please check your email address.");
    } else {
      console.log("Password reset email sent:", data);
      toast.success("Password reset email sent! Check your inbox.");
    }

    setLoading(false);
  };



  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription>
          Enter your email below to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handlePasswordReset}>Get Email to Reset Password</Button>
      </CardFooter>
    </Card>
  )
}
