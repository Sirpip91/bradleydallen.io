"use client"

import { useEffect, useState } from "react"
import Link, { LinkProps } from "next/link"
import { useRouter } from "next/navigation"
import { LogIn, LogOut, Menu, Moon, Sun, UserPlus } from "lucide-react"
import { supabase } from "@/lib/supabaseClient";
import { siteConfig } from "@/config/site"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { useTheme } from "next-themes"
import { User } from "@supabase/supabase-js"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const { setTheme, theme } = useTheme()

  // This function is just for demonstration purposes
  const toggleSignIn = () => {
    setIsSignedIn(!isSignedIn)
    setOpen(false)
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-10 px-0 sm:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <div className="flex justify-between items-center mb-4">
          <MobileLink href="/" className="flex items-center">
            <span className="font-bold">{siteConfig.name}</span>
          </MobileLink>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
        <div className="flex flex-col gap-3 mt-3">
          <MobileLink onOpenChange={setOpen} href="/content">
            Content
          </MobileLink><div className="text-customRed">
          <MobileLink onOpenChange={setOpen} href="/pro">
            Pro
          </MobileLink>
          </div>
          <MobileLink onOpenChange={setOpen} href="/about">
            About
          </MobileLink>
         <hr />
        </div>
        <div className="flex flex-col gap-3 mt-6">
          {user ? (
            <>
              <span className="text-foreground">
                {stripeCustomer?.customer_name ? `Welcome, ${stripeCustomer.customer_name}` : "Signed In!"}
              </span>
              <MobileLink onOpenChange={setOpen} href="/user">
                Profile
              </MobileLink>
              <Link href="/user">
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
              </Link>
            </>
          ) : (
            <>
               <Link href="/login">
                <Button variant="outline" onClick={toggleSignIn}>
                <LogIn className="mr-2 h-4 w-4" />
                Login
                </Button>
                </Link>
              <Link href="/signup">
              <Button onClick={toggleSignIn}>
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
              </Button></Link>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

interface MobileLinkProps extends LinkProps {
  children: React.ReactNode
  onOpenChange?: (open: boolean) => void
  className?: string
}

function MobileLink({
  href,
  onOpenChange,
  children,
  className,
  ...props
}: MobileLinkProps) {
  const router = useRouter()
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString())
        onOpenChange?.(false)
      }}
      className={className}
      {...props}
    >
      {children}
    </Link>
  )
}