"use client"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import { loadStripe } from "@stripe/stripe-js";
import { User } from "@supabase/supabase-js";
import { Check } from "lucide-react";
import Link from 'next/link'; // Import the Link component from Next.js
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

enum PopularPlan {
  NO = 0,
  YES = 1,
}

interface PlanProps {
  title: string;
  popular: PopularPlan;
  price: number;
  description: string;
  buttonText: string;
  benefitList: string[];
  link: string;
}

const plans: PlanProps[] = [
  {
    title: "Free",
    popular: 0,
    price: 0,
    description: "Basic Website Documentation",
    buttonText: "Start Now",
    benefitList: [
      "Documentation",
      "Step-by-Step",
    ],
    link: "/tags/pro-membership",
  },
  {
    title: "Pro",
    popular: 1,
    price: 25,
    description: "Everything from documents to video explanation.",
    buttonText: "Purchase",
    benefitList: [
      "Documentation",
      "Step-By-Step",
      "In-Depth Video Explanation",
    ],
    link: "/pro",
  },
  {
    title: "Premium (Coming Soon)",
    popular: 0,
    price: 60,
    description: "Additional help from myself and those in the discord",
    buttonText: "Comming Soon",
    benefitList: [
      "Documentation",
      "Step-By-Step",
      "In-Depth Video Explanation",
      "Discord Access",
      "5 Coaching Calls",
    ],
    link: "/pro",
  },
];

export const PricingSection = () => {
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
    <section className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Pricing
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        Choose Your Access
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground pb-14">
        All basic information available free, but if you desire to know secrets you can upgrade.
      </h3>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-4">
        {plans.map(
          ({ title, popular, price, description, buttonText, benefitList, link }) => (
            <Card
              key={title}
              className={
                popular === PopularPlan?.YES
                  ? "drop-shadow-xl shadow-black/10 dark:shadow-white/10 border-[1.5px] border-primary lg:scale-[1.1]"
                  : ""
              }
            >
              <CardHeader>
                <CardTitle className="pb-2">{title}</CardTitle>

                <CardDescription className="pb-4">
                  {description}
                </CardDescription>

                <div>
                  <span className="text-3xl font-bold">${price}</span>
                </div>
              </CardHeader>

              <CardContent className="flex">
                <div className="space-y-4">
                  {benefitList.map((benefit) => (
                    <span key={benefit} className="flex">
                      <Check className="text-primary mr-2" />
                      <h3>{benefit}</h3>
                    </span>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Link href={link} passHref>
                  <Button onClick={title === "Pro" ? handleCheckout : undefined}
                    variant={
                      popular === PopularPlan?.YES ? "default" : "secondary"
                    }
                    className="w-full"
                  >
                    {buttonText}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )
        )}
      </div>
    </section>
  );
};
//onClick={title === "Pro" ? handleCheckout : undefined}