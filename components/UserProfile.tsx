"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import LoginFormAuto from "./LoginFormAuto";
import SignUpForm from "./SignUpForm";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

export default function UserProfile() {
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div>
      <h1 className="inline-block font-black text-3xl lg:text-3xl">Account:</h1>
      {user ? (
        <>
          <p className="text-2xl font-bold  break-words">
            Signed in with email: <strong className="text-yellow-500">{user.email}</strong>
          </p>
          <p>
          User ID: <strong>{user.id}</strong>
          </p>
          

          <h2 className="pt-5 inline-block font-black text-3xl lg:text-3xl">Stripe Information:</h2>



          {stripeCustomer ? (<>
            
            <div className="mockup-code">
              <p>
                  Stripe Customer Name: <strong>{stripeCustomer.customer_name}</strong>
                </p>
                <p>
                  Purchased Videos: <strong className="text-yellow-500">{stripeCustomer.has_paid}</strong>
                </p>
               
             <p>Thank you for being a customer!</p>
            </div>
            </>
          ) : (
            <div>
              <p className="text-yellow-500">
                Stripe customer data not created yet. Buy the videos!
              </p>
            </div>
          )}
          <div className="pt-5">
          <Link
             onClick={handleLogout}
              href="/user"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full sm:w-fit text-lg font-medium"
              )}
            >
              Log Out
            </Link>
            </div>
        </>
      ) : (
        <>
          
          <p className="text-2xl font-bold break-words pt-2">No user logged in.</p>

          <p className="text-2xl font-bold break-words pt-5">Please log in or sign up.</p>
          <div className="pt-5">
          <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full sm:w-fit text-lg font-medium "
              )}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full sm:w-fit text-lg font-medium"
              )}
            >
              Sign Up
            </Link>
          </div>
        </>
      )}
      
    </div>
  );
}

