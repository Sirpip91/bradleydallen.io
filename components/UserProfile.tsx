"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { LogOut, Trash2 } from "lucide-react";

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [stripeCustomer, setStripeCustomer] = useState<any>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
          console.log("No stripe customer data found");
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

  const handleDeleteAccount = async () => {
    const confirmDelete = confirm("Are you sure you want to delete your account? This action is irreversible.");
  
    if (confirmDelete && user) {
      try {
        const response = await fetch("/api/delete-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.id }),
        });
  
        if (response.ok) {
          setUser(null);
          setStripeCustomer(null);
          handleLogout();
          alert("Your account has been deleted.");
        } else {
          const errorData = await response.json();
          console.error("Error deleting account:", errorData.error);
          alert("Failed to delete the account.");
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete the account.");
      }
    }
  };

  const openConfirmModal = () => {
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const confirmDelete = () => {
    handleDeleteAccount();
    closeConfirmModal();
  };

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-3xl font-black">Account</CardTitle>
        {!user && <CardDescription>Please log in or sign up.</CardDescription>}
      </CardHeader>
      <CardContent>
        {user ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">User Information</h2>
              <p className="text-lg">
                Signed in with email: <span className="font-bold text-yellow-500">{user.email}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                User ID: <span className="font-medium">{user.id}</span>
              </p>
            </div>
            <Separator />
            <div>
              <h2 className="text-2xl font-bold mb-2">Stripe Information</h2>
              {stripeCustomer ? (
                
                  <CardContent className="pt-6">
                    <p>
                      Stripe Customer Name: <strong>{stripeCustomer.customer_name}</strong>
                    </p>
                    <p>
                      Purchased Content: <strong className="text-yellow-500">{stripeCustomer.has_paid}</strong>
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">Thank you for being a customer!</p>
                  </CardContent>
                
              ) : (
                
                  <CardContent className="pt-2">
                  <p className="text-lg">
                      Stripe Customer Name: <strong className="text-yellow-500"> N/A</strong>
                    </p>
                    <p className="text-lg">
                      Purchased Content: <strong className="text-yellow-500">N/A</strong>
                    </p>
                  </CardContent>
                
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xl font-bold">No user logged in.</p>
            <div className="flex space-x-4">
              <Link href="/login">
                <Button variant="outline" size="lg">Login</Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline" size="lg">Sign Up</Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
      {user && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="lg" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Log Out
          </Button>
          <Button variant="destructive" size="lg" onClick={openConfirmModal}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete Account
          </Button>
        </CardFooter>
      )}

      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Account Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeConfirmModal}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}