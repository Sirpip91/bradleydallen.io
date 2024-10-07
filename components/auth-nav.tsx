"use client"

import Link from "next/link"
import { LogIn, LogOut, UserPlus, Menu } from "lucide-react"
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";
import { User } from "@supabase/supabase-js";
import { ReactNode, useEffect, useState } from "react";

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"



export default function AuthNavbar() {
  const [isSignedIn, setIsSignedIn] = useState(false)
 

  // This function is just for demonstration purposes
  const toggleSignIn = () => {
    setIsSignedIn(!isSignedIn)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };


  const [user, setUser] = useState<User | null>(null);
  const [stripeCustomer, setStripeCustomer] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      setUser(user);

      if (user) {
        const { data: stripeCustomerData, error } = await supabase
          .from("stripe_customers")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.log("No stripe customer data found",);
        } else {
          setStripeCustomer(stripeCustomerData);
          console.log("working");
        }
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") {
          if (session) {
            setUser(session.user);
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setStripeCustomer(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="flex items-center  p-4 ">
      <div className="hidden md:flex items-center space-x-4">
        {user ? (
          <>
          <span className="text-foreground">
            {stripeCustomer?.customer_name ? `Welcome, ${stripeCustomer.customer_name}` : "Signed In!"}
          </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Account</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
              <Link href="/user" passHref>
                <DropdownMenuItem>Profile</DropdownMenuItem>
            </Link>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <> 
          <Link href="/login" passHref>
            <Button variant="outline">
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
           </Link>
           <Link href="/signup" passHref>
            <Button onClick={toggleSignIn}>
              <UserPlus className="mr-2 h-4 w-4" />
              Sign Up
            </Button>
            </Link>
          </>
        )}
      </div>

     
    </nav>
  )
}