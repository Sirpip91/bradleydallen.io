"use client";

import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
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
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";

export function PasswordResetRequest() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleResetRequest = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) throw error;

      toast.success("Reset email sent. Check your email for the password reset link.",{
        duration:4000,
      });
    } catch (error) {
      toast.error("Failed to send reset email. Please try again.",{
        duration:4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Forgot Password</CardTitle>
        <CardDescription className="text-lg">
          Enter your email to receive a password reset link via email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleResetRequest} className="grid gap-4">
          <div className="grid w-full items-center gap-6">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="email" className="text-lg font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="mail@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <CardFooter className="flex flex-col items-center space-y-4 px-0 pt-6">
            <Button type="submit" className="w-full text-lg py-6" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
      <Toaster />
    </Card>
  );
}
