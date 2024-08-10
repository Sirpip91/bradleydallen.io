'use client';

import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';
import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from './ui/button';


export default function CheckoutButton() {

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


  const handleCheckout = async() => {
    const { data } = await supabase.auth.getUser();

    if (!data?.user) {
      toast.error("Please log in to create a new Stripe Checkout session");
      return;
    }

    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
    const stripe = await stripePromise;
    const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId: 'price_1PN2guFRcXq5egITHtAIiRnm', userId: data.user?.id, email: data.user?.email }),
      });
    const session = await response.json();
    await stripe?.redirectToCheckout({ sessionId: session.id });
  }

  return (
    <div>

    {stripeCustomer ? (
        <>
          <h1>You already bought</h1>
          {stripeCustomer ? (<>
            
            <Link
              href="/content"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full sm:w-fit text-lg font-medium"
              )}
            >
              View Content
            </Link>
            </>
          ) : (
            <div>
             
            </div>
          )}

        </>
      ) : (
        <>
         

          
              <p>Clicking this button creates a new Stripe Checkout session</p>
              <p className="text-yellow-500">
              <button className="btn btn-accent" onClick={handleCheckout}>Buy Now</button>
              </p>
        </>
      )}



    </div>
  );
}