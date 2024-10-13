"use client"
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";
import { User } from "@supabase/supabase-js";
import { ReactNode, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ArrowRight, Lock } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useUser } from "@/components/UserContext"; // Import the UserContext

interface CalloutProps {
  children?: ReactNode;
  type?: "default" | "warning" | "danger";
}

//Hide Pro content.
export function ProHandbook({
  children,
  type = "default",
  ...props
}: CalloutProps) {
  const { user, stripeCustomer, purchasedProducts } = useUser(); // Use the UserContext
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  
  
  useEffect(() => {
    if (user) {
      // Check if "handbook" is present in purchased_products array
      const hasBoughtHandbook = purchasedProducts.includes("handbook");
      // Check if the user is a pro member, defaulting to false if undefined
      const isProMember = stripeCustomer?.pro_active ?? false;
  
      // Determine if the user has access
      setHasAccess(hasBoughtHandbook || isProMember);
    } else {
      setHasAccess(false); // No user, no access
    }
  }, [user, purchasedProducts, stripeCustomer]);
  

  return (
    <div
      className={cn(
        "pb-10 pt-10",
        {
          "border-red-900 bg-red-50 dark:prose": type === "danger",
          "": !hasAccess && type === "warning", // Apply warning style only when no access
        }
      )}
      {...props}
    >
      {hasAccess ? (
        <div>{children}</div>
      ) : (
        <Card className="w-full max-w-md mx-auto overflow-hidden">
          <CardHeader className="bg-secondary pb-8 pt-6">
            <div className="flex flex-col items-center justify-center space-y-2">
              <Lock className="w-12 h-12 text-primary" />
              <CardTitle className="text-2xl font-bold">Premium Content</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <Link href="/pro/internship-handbook" className="block">
                <Button size="lg" className="w-full text-lg">
                  Purchase Handbook $20
                </Button>
              </Link>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-muted" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>
              <Link href="/pro" className="block">
                <Button size="lg" variant="outline" className="w-full text-lg">
                  Get <span className="px-1 text-customRed">Pro</span> Access
                </Button>
              </Link>
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
//Use DSACallout to hide DSA premium content.
export function ProDSA({
  children,
  type = "default",
  ...props
}: CalloutProps) {
  const { user, stripeCustomer, purchasedProducts } = useUser(); // Use the UserContext
  const [hasAccess, setHasAccess] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      // Check if "dsa" is present in purchased_products array
      const hasBoughtDSA = purchasedProducts.includes("dsa");
      // Check if the user is a pro member, defaulting to false if undefined
      const isProMember = stripeCustomer?.pro_active ?? false;
  
      // Determine if the user has access
      setHasAccess(hasBoughtDSA || isProMember);
    } else {
      setHasAccess(false); // No user, no access
    }
  }, [user, purchasedProducts, stripeCustomer]);

  return (
    <div
      className={cn(
        "pb-10 pt-10",
        {
          "border-red-900 bg-red-50 dark:prose": type === "danger",
          "": !hasAccess && type === "warning", // Apply warning style only when no access
        }
      )}
      {...props}
    >
      {hasAccess ? (
        <div>{children}</div>
      ) : (
        <Card className="w-full max-w-md mx-auto overflow-hidden">
          <CardHeader className="bg-secondary pb-8 pt-6">
            <div className="flex flex-col items-center justify-center space-y-2">
              <Lock className="w-12 h-12 text-primary" />
              <CardTitle className="text-2xl font-bold">Premium Content</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <Link href="/pro/data-structures" className="block">
                <Button size="lg" className="w-full text-lg">
                  Purchase Data Structures $20
                </Button>
              </Link>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-muted" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>
              <Link href="/pro" className="block">
                <Button size="lg" variant="outline" className="w-full text-lg">
                  Get <span className="px-1 text-customRed">Pro</span> Access
                </Button>
              </Link>
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

//Hide more here
