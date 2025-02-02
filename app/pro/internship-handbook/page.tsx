"use client";

import { useEffect } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";
import handbook from '../../../content/content/img/handbook.jpg';
import toast from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import Link from 'next/link';
import { useUser } from '@/components/UserContext'; // Import your UserContext

export default function InternshipHandbookLanding() {
  const { user, purchasedProducts, stripeCustomer, loading } = useUser(); // Destructure user data
  const hasAccess = purchasedProducts.includes("handbook") || stripeCustomer?.pro_active===true; // Check access based on purchased products

  const handleCheckout = async (priceId: string, productName: string) => {
    if (!user) {
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
        priceId: priceId,
        userId: user.id,
        email: user.email,
        buyMode: 'payment',
        product_name: productName,
      }),
    });
    const session = await response.json();
    await stripe?.redirectToCheckout({ sessionId: session.id });
  };

  const benefits = [
    "Comprehensive guide to landing your dream internship",
    "Expert tips on resume building and interview preparation",
    "Insider knowledge on navigating the internship process",
    "Strategies for networking and building professional relationships",
    "PDF Download and Full Access on Content page"
  ];

  if (loading) {
    return <div className="text-center">Loading...</div>; // Show loading state
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="pt-20 pb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Internship Mastery Handbook
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
          Unlock your potential with this comprehensive internship guide!
        </p>
      </header>

      <main className="container mx-auto px-4 pb-20">
        <div className="grid gap-12 md:grid-cols-2 items-center ml-8">
          <div>
            <Image
              src={handbook}
              alt="Internship Mastery Handbook Cover"
              width={400}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6">What You&apos;ll Get</h2>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 space-y-4">
              {hasAccess ? (
                <Link href="/tags/internship-handbook" passHref>
                  <Button size="lg" className="w-full">
                    View Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Button size="lg" className="w-full" onClick={() => handleCheckout('price_1Q9ybaFRcXq5egITkXDQEoQn', 'handbook')}>
                    Pre Purchase Handbook $30
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  {/*
                  <p className='text-3xl text-center pb-4'>or</p>
                  <Link href="/pro" passHref>
                    <Button size="lg" variant="outline" className="w-full">
                      Get Pro Access to All Content
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  */}
                </>
              )}
            </div>
          </div>
        </div>

        <section className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Supercharge Your Internship Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Don&apos;t miss out on the opportunity to gain a competitive edge in your internship search.
            Get your copy of the Internship Mastery Handbook today!
          </p>
          {hasAccess ? (
            <Link href="/tags/internship-handbook" passHref>
              <Button size="lg">
                Access Your Handbook
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <div className="space-x-4">
              <Link href="/tags/internship-handbook" passHref>
              <Button size="lg">
                Try for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              </Link>
                 {/*
              <Link href="/pro" passHref>
                <Button size="lg" variant="outline">
                  Get Pro Access
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              */}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
