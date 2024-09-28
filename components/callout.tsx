"use client"
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";
import { User } from "@supabase/supabase-js";
import { ReactNode, useEffect, useState } from "react";




interface CalloutProps {
  children?: ReactNode;
  type?: "default" | "warning" | "danger";
}

export function Callout({
  children,
  type = "default",
  ...props
}: CalloutProps) {

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
    
    <div
      className={cn(
        "my-6 items-start rounded-md border boder-l-4 p-4 w-full dark:max-w-none",
        {
          "border-red-900 bg-red-50 dark:prose": type === "danger",
          "content-center border-black-900 text-xl text-center": type === "warning",
        }
        
      )}
      {...props}
    >
      {stripeCustomer ? (<>
  
      <div>{children}</div>


      </>
) : (
  <div>
  <p className="text-customRed">
    To view the videos please <a href="/pro" className="text-customRed underline">purchase Pro Membership!</a>
  </p>
</div>

)}
    </div>
  );
}


