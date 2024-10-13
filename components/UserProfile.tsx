"use client";

import { useEffect, useState } from "react";
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
import { CreditCard, LogOut, Trash2 } from "lucide-react";
import { createPortalSession } from "@/app/portal/portalActions";
import toast from "react-hot-toast";
import { useUser } from "@/components/UserContext"; // Import the custom hook

export default function UserProfile() {
  const { user, stripeCustomer, purchasedProducts, refreshUserData } = useUser(); // Use context
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [hasAccess, setHasAccess] = useState<boolean>(false);

  useEffect(() => {
    // Determine if the user has access based on purchased products or pro membership
    if (stripeCustomer) {
      const hasBoughtHandbook = stripeCustomer.purchased_products?.includes("handbook") || false;
      const isProMember = stripeCustomer.pro_active || false;
      setHasAccess(hasBoughtHandbook || isProMember);
    }
  }, [stripeCustomer]);

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

  const handleClick = async () => {
    try {
      if (!user) {
        throw 'Please log in to manage your billing.';
      }

      const { data: customer, error: fetchError } = await supabase
        .from('stripe_customers')
        .select('stripe_customer_id')
        .eq('user_id', user.id)
        .single();

      const { url } = await createPortalSession(customer?.stripe_customer_id);
      window.location.href = url;

    } catch (error) {
      console.error(error);
      toast.error('Failed to create billing portal session:');
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
              {stripeCustomer || purchasedProducts ? (
                
<CardContent>
  {/* Show if the user is a Pro member */}
  {stripeCustomer?.pro_active ? (
    <p className="mt-2">
      Membership Status: <strong className="text-yellow-500">Pro Member</strong>
    </p>
  ) : (
    <p className="mt-2">
      Membership Status: <strong className="text-red-500">Not a Pro Member</strong>
    </p>
  )}

  {/* Show plan expiration date if it exists */}
  {stripeCustomer?.plan_expires && (
    <p>
      Plan Expires: <strong>{new Date(Number(stripeCustomer.plan_expires) * 1000).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</strong>
    </p>
  )}

  {/* Show purchased content */}
  {purchasedProducts.length > 0 ? (
    <div className="mt-4">
      <h3 className="text-lg font-bold">Purchased Content:</h3>
      <ul className="list-disc list-inside mt-2">
        {purchasedProducts.map((product, index) => (
          <li key={index} className="text-md text-yellow-500">{product}</li>
        ))}
      </ul>
    </div>
  ) : (
    <p className="mt-2">No purchased content available.</p>
  )}

  <p className="text-sm text-muted-foreground mt-2">Thank you for being a customer!</p>
  
  <div className="mt-4">
    <Button onClick={handleClick} variant="outline" size="lg" className="w-full">
      <CreditCard className="mr-2 h-4 w-4" /> Manage Billing
    </Button>
  </div>
</CardContent>

                
              ) : (
                
                  <CardContent className="pt-2">
                  <p className="text-lg">
                      Stripe Customer Name: <strong className="text-yellow-500"> N/A</strong>
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
