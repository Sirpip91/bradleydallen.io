'use client';

import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';
import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from './ui/button';
import { ArrowRight } from 'lucide-react';

export default function HandbookCheckout() {
    const [user, setUser] = useState<User | null>(null);
    const [hasAccess, setHasAccess] = useState<boolean>(false);

    useEffect(() => {
      const fetchUserData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          // Fetch one-time payments and pro membership status in parallel
          const [{ data: paymentData }, { data: proData }] = await Promise.all([
            supabase
              .from("one_time_payments")
              .select("purchased_products")
              .eq("user_id", user.id)
              .single(),
            supabase
              .from("stripe_customers")
              .select("pro_active")
              .eq("user_id", user.id)
              .single()
          ]);

            // Check if "handbook" is present in purchased_products array
          const hasBoughtHandbook = paymentData?.purchased_products?.includes("handbook");
            // Check if the user is a pro member
          const isProMember = proData?.pro_active;

          // Determine if the user has access
          if (hasBoughtHandbook || isProMember) {
            setHasAccess(true);
          }
        }
      };

      fetchUserData();

      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (event === "SIGNED_IN") {
            setUser(session?.user ?? null);
          } else if (event === "SIGNED_OUT") {
            setUser(null);
            setHasAccess(false);
          }
        }
      );

      return () => {
        authListener.subscription.unsubscribe();
      };
    }, []);

    const handleCheckout = async () => {
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
        body: JSON.stringify({
          priceId: 'price_1Q8TE2FRcXq5egITFkHWy2ri',
          userId: data.user?.id,
          email: data.user?.email,
          buyMode: 'payment',
          product_name: 'handbook'
        }),
      });
      const session = await response.json();
      await stripe?.redirectToCheckout({ sessionId: session.id });
    };

    return (
      <div>
        {hasAccess ? (
          <>
            <h1>You have full access to this content 🎉</h1>
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
          <>
            <p>Clicking this button lets you buy Internship Handbook</p>
            <p className="text-yellow-500">
              <Button className="mt-10" onClick={handleCheckout}>
                Buy Now for $49
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </p>
          </>
        )}
      </div>
    );
}
