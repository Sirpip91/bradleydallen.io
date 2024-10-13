"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient"; // Ensure this is a client-side import

interface StripeCustomer {
  customer_name?: string;
  purchased_products?: string[];
  pro_active?: boolean; // Added pro_active field
  plan_expires?: string; // Added plan_expires field
}

interface UserContextType {
  user: any;
  stripeCustomer: StripeCustomer | null;
  purchasedProducts: string[];
  loading: boolean;
  refreshUserData: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [stripeCustomer, setStripeCustomer] = useState<StripeCustomer | null>(null);
  const [purchasedProducts, setPurchasedProducts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (sessionUser: any) => {
    setLoading(true);
    try {
      if (sessionUser) {
        setUser(sessionUser);

        // Fetch purchased products from one_time_payments
        const { data: paymentData, error: paymentError } = await supabase
          .from("one_time_payments")
          .select("purchased_products")
          .eq("user_id", sessionUser.id)
          .maybeSingle();

        // Handle any errors in fetching payment data
        if (paymentError) {
          console.error("Error fetching payment data:", paymentError);
        }

        // Set the purchased products
        const products = paymentData?.purchased_products || [];
        setPurchasedProducts(products);

        // Fetch Stripe customer data, including pro_active and plan_expires fields
        const { data: stripeCustomerData, error: customerError } = await supabase
          .from("stripe_customers")
          .select("*, pro_active, plan_expires") // Ensure pro_active and plan_expires are included
          .eq("user_id", sessionUser.id)
          .maybeSingle();

        // Handle any errors in fetching customer data
        if (customerError && customerError.code !== "PGRST116") {
          console.error("Error fetching stripe customer data:", customerError);
        } else if (!stripeCustomerData) {
          setStripeCustomer(null);
          console.log("No Pro Subscription Found. Buy Pro!");
        } else {
          setStripeCustomer(stripeCustomerData);
          console.log("Stripe customer data found.");
        }
      } else {
        // Reset user data if no session
        setUser(null);
        setPurchasedProducts([]);
        setStripeCustomer(null);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        // Fetch the session first
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Error fetching session:", sessionError);
          setLoading(false);
          return;
        }

        if (!session) {
          console.warn("No auth session found. User is not signed in.");
          setUser(null);
          setLoading(false);
          return;
        }

        // If there's a session, fetch the user data
        await fetchUserData(session.user);
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        fetchUserData(session.user);
      } else if (event === "SIGNED_OUT") {
        fetchUserData(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, stripeCustomer, purchasedProducts, loading, refreshUserData: () => fetchUserData(user) }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
